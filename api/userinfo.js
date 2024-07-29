const axios = require('axios');

const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const discordRedirectUri = process.env.DISCORD_REDIRECT_URI;

const getAccessToken = async (code) => {
    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: discordClientId,
            client_secret: discordClientSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: discordRedirectUri
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        return null;
    }
};

const getUserInfo = async (token) => {
    try {
        const response = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error.response ? error.response.data : error.message);
        return null;
    }
};

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const { code } = req.query;

    const accessToken = await getAccessToken(code);
    if (!accessToken) {
        res.status(400).send('Failed to fetch access token.');
        return;
    }

    const userInfo = await getUserInfo(accessToken);
    if (!userInfo) {
        res.status(400).send('Failed to fetch user info.');
        return;
    }

    res.status(200).json(userInfo);
};
