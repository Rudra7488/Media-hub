import instagramService from '../services/instagramService.js';
import SearchHistory from '../models/SearchHistory.js';

export const getProfileData = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const profile = await instagramService.getProfile(username);

    // Log success to DB
    await SearchHistory.create({ username, success: true }).catch(e => console.error('DB Log Error:', e.message));

    return res.status(200).json({
        ...profile,
        warning: profile.warning || null
    });

  } catch (error) {
    console.error('Controller Error:', error.message);
    
    // Log failure to DB
    await SearchHistory.create({ username, success: false }).catch(e => console.error('DB Log Error:', e.message));

    // Determine status code based on error message
    let status = 500;
    if (error.message.includes('not found')) status = 404;
    if (error.message.includes('private')) status = 403;
    if (error.message.includes('timeout') || error.message.includes('blocked')) status = 503;

    return res.status(status).json({ 
        message: error.message || 'Could not fetch Instagram profile data' 
    });
  }
};
