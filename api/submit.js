const axios = require('axios');
const discordClientId = process.env.DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;
const discordRedirectUri = process.env.DISCORD_REDIRECT_URI;
const webhookUrl = process.env.WEBHOOK_URL;

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
        console.error('Error fetching access token:', error);
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
        console.error('Error fetching user info:', error);
        return null;
    }
};

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const { code, botID, botPrefix } = req.body;

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

    const ownerId = userInfo.id;
    const ownerName = userInfo.username;
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${botID}&scope=bot&permissions=0`;
    const embed = {
        "title": "New Bot Submission",
        "color": 3447003,
        "fields": [
            { "name": "Bot ID", "value": botID, "inline": false },
            { "name": "Bot Prefix", "value": botPrefix, "inline": false },
            { "name": "Owner ID", "value": ownerId, "inline": false },
            { "name": "Owner Name", "value": ownerName, "inline": false }
        ],
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Invite Link",
                        "style": 5,
                        "url": inviteLink
                    }
                ]
            }
        ]
    };

    try {
        await axios.post(webhookUrl, { embeds: [embed] });
        res.status(200).send('Bot submitted successfully!');
    } catch (error) {
        console.error('Error sending webhook:', error);
        res.status(500).send('Failed to submit bot.');
    }
};
