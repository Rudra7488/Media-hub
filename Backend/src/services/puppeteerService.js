import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

class PuppeteerService {
  async getProfile(username) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: "new",
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process'
        ]
      });

      const page = await browser.newPage();

      // Set viewport for consistent rendering
      await page.setViewport({ width: 1280, height: 800 });

      // Set randomized user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

      const url = `https://www.instagram.com/${username}/`;
      console.log(`Puppeteer navigating to: ${url}`);

      // Navigate with longer timeout
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Wait for profile data to load (biography is a good indicator)
      await page.waitForSelector('header h1', { timeout: 10000 }).catch(() => null);

      const data = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script'));

        // Method 1: window._sharedData
        const sharedDataScript = scripts.find(s => s.textContent.includes('window._sharedData'));
        if (sharedDataScript) {
          const text = sharedDataScript.textContent;
          const json = JSON.parse(text.substring(text.indexOf('=') + 1, text.lastIndexOf(';')));
          const user = json.entry_data?.ProfilePage?.[0]?.graphql?.user;
          if (user) return user;
        }

        // Method 2: Extracting from React state in __additionalDataLoaded
        const addDataScript = scripts.find(s => s.textContent.includes('window.__additionalDataLoaded'));
        if (addDataScript) {
          const text = addDataScript.textContent;
          const match = text.match(/window\.__additionalDataLoaded\(['"][^'"]+['"],\s*({.+})\);/);
          if (match && match[1]) {
            const json = JSON.parse(match[1]);
            return json.graphql?.user || json.user;
          }
        }

        // Method 3: Direct DOM scraping fallback (Minimal)
        const username = document.querySelector('header h1')?.innerText || '';
        const fullName = document.querySelector('header h2')?.innerText || '';
        const bio = document.querySelector('header section div:nth-child(2) span')?.innerText || '';
        const profilePic = document.querySelector('header img')?.src || '';

        if (username) {
          return {
            username,
            full_name: fullName,
            biography: bio,
            profile_pic_url: profilePic,
            is_private: document.body.innerText.includes('This account is private'),
            edge_followed_by: { count: 0 },
            edge_follow: { count: 0 },
            edge_owner_to_timeline_media: { count: 0, edges: [] }
          };
        }

        return null;
      });

      if (!data) {
        throw new Error('Puppeteer could not find user data.');
      }

      return {
        username: data.username,
        full_name: data.full_name,
        profile_pic_url: data.profile_pic_url_hd || data.profile_pic_url,
        followers: data.edge_followed_by?.count || data.follower_count || 0,
        following: data.edge_follow?.count || data.following_count || 0,
        posts_count: data.edge_owner_to_timeline_media?.count || data.media_count || 0,
        bio: data.biography,
        is_private: data.is_private,
        posts: (data.edge_owner_to_timeline_media?.edges || []).map(edge => ({
          id: edge.node.id,
          image_url: edge.node.display_url,
          is_video: edge.node.is_video,
          caption: edge.node.edge_media_to_caption?.edges[0]?.node?.text || ''
        }))
      };

    } catch (error) {
      console.error('Puppeteer Service Error:', error.message);
      throw error;
    } finally {
      if (browser) await browser.close();
    }
  }
}

export default new PuppeteerService();
