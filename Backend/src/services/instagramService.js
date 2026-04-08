const axios = require('axios');
const cheerio = require('cheerio');
const puppeteerService = require('./puppeteerService');

class InstagramService {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
    this.proxy = process.env.PROXY_URL || null;
    this.cookie = process.env.INSTAGRAM_COOKIE || null;
  }

  async fetchWithRetry(url, retries = 3, timeout = 12000) {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            const config = {
                timeout,
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Referer': 'https://www.instagram.com/',
                }
            };

            if (this.cookie) {
                config.headers.Cookie = `sessionid=${this.cookie}`;
            }

            const response = await axios.get(url, config);
            return response.data;
        } catch (error) {
            console.error(`Axios Attempt ${i + 1} failed: ${error.message}`);
            lastError = error;
            if (error.response?.status === 404) throw error; // Don't retry 404s
            if (i < retries - 1) await new Promise(res => setTimeout(res, 2000 * (i + 1))); 
        }
    }
    throw lastError;
  }

  parseProfileData(html) {
    const $ = cheerio.load(html);
    let allJsonData = [];

    $('script').each((i, el) => {
        const text = $(el).html();
        if (!text) return;
        if (text.includes('window._sharedData')) {
            try {
                const jsonString = text.substring(text.indexOf('=') + 1, text.lastIndexOf(';'));
                allJsonData.push(JSON.parse(jsonString));
            } catch (e) {}
        }
        if (text.includes('window.__additionalDataLoaded')) {
             try {
                const matches = text.match(/window\.__additionalDataLoaded\(['"][^'"]+['"],\s*({.+})\);/);
                if (matches && matches[1]) allJsonData.push(JSON.parse(matches[1]));
             } catch (e) {}
        }
        if ($(el).attr('type') === 'application/json') {
            try {
                allJsonData.push(JSON.parse(text));
            } catch (e) {}
        }
    });

    let user = null;
    for (const data of allJsonData) {
        user = this.findUserInObject(data);
        if (user) break;
    }

    if (!user) return this.parseFromMetaTags($);

    return this.mapUserObject(user);
  }

  findUserInObject(obj) {
      if (!obj || typeof obj !== 'object') return null;
      if (obj.username && (obj.edge_followed_by || obj.follower_count)) return obj;
      if (obj.graphql?.user) return obj.graphql.user;
      if (obj.user && typeof obj.user === 'object' && obj.user.username) return obj.user;

      for (const key in obj) {
          if (key === 'node' || key === 'edges' || key === 'activity_feed') continue;
          const result = this.findUserInObject(obj[key]);
          if (result) return result;
      }
      return null;
  }

  mapUserObject(user) {
      return {
          username: user.username,
          full_name: user.full_name,
          profile_pic_url: user.profile_pic_url_hd || user.profile_pic_url,
          followers: user.edge_followed_by?.count || user.follower_count || 0,
          following: user.edge_follow?.count || user.following_count || 0,
          posts_count: user.edge_owner_to_timeline_media?.count || user.media_count || 0,
          bio: user.biography,
          is_private: user.is_private,
          posts: (user.edge_owner_to_timeline_media?.edges || []).map(edge => ({
              id: edge.node.id,
              image_url: edge.node.display_url,
              is_video: edge.node.is_video,
              caption: edge.node.edge_media_to_caption?.edges[0]?.node?.text || ''
          }))
      };
  }

  parseFromMetaTags($) {
      const ogUrl = $('meta[property="og:url"]').attr('content') || '';
      let username = ogUrl.split('/').filter(Boolean).pop();

      if (!username || username === 'www.instagram.com') {
          const title = $('meta[property="og:title"]').attr('content') || '';
          username = title.split('•')?.[0]?.trim().replace('@', '');
      }

      if (!username) return null;

      const description = $('meta[property="og:description"]').attr('content') || '';
      const followersMatch = description.match(/([\d.,KMB]+)\s*Followers/i);
      const followingMatch = description.match(/([\d.,KMB]+)\s*Following/i);
      const postsMatch = description.match(/([\d.,KMB]+)\s*Posts/i);

      return {
          username: username,
          full_name: $('meta[name="twitter:title"]').attr('content') || username,
          profile_pic_url: $('meta[property="og:image"]').attr('content'),
          followers: followersMatch ? followersMatch[1] : '0',
          following: followingMatch ? followingMatch[1] : '0',
          posts_count: postsMatch ? postsMatch[1] : '0',
          bio: description.split('-')[0]?.trim() || '',
          is_private: false,
          posts: [], 
          warning: "Limited data - Using Meta Tag Fallback."
      };
  }

  async getProfile(username) {
    try {
      console.log(`[Axios] Fetching ${username}...`);
      const html = await this.fetchWithRetry(`https://www.instagram.com/${username}/`);
      const profile = this.parseProfileData(html);
      
      if (profile && !profile.warning) {
          if (profile.is_private) throw new Error('Private account.');
          return profile;
      }
      
      console.log(`[Axios] Incomplete data for ${username}, falling back to Puppeteer...`);
    } catch (error) {
       console.error(`[Axios] Failed for ${username}: ${error.message}`);
       if (error.message.includes('not found')) throw error;
    }

    try {
      console.log(`[Puppeteer] Fetching ${username}...`);
      const profile = await puppeteerService.getProfile(username);
      if (profile.is_private) throw new Error('This account is private.');
      return profile;
    } catch (puppeteerError) {
       console.error(`[Puppeteer] Failed: ${puppeteerError.message}`);
       throw new Error('Instagram blocked request or parsing failed. User might be private.');
    }
  }
}

module.exports = new InstagramService();
