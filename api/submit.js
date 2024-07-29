
const axios = require('axios');

const webhookUrl = process.env.WEBHOOK_URL;

module.exports = async (req, res) => {
if (req.method !== 'POST') {
res.status(405).send('Method Not Allowed');
return;
}

const { botID, botPrefix, ownerID, ownerName } = req.body;
const inviteLink = `https://discord.com/oauth2/authorize?client_id=${botID}&scope=bot&permissions=0`;

const embed = {
title: "New Bot Submission",
color: 3447003,
fields: [
{ name: "Bot ID", value: botID, inline: false },
{ name: "Bot Prefix", value: botPrefix, inline: false },
{ name: "Owner ID", value: ownerID, inline: false },
{ name: "Owner Name", value: ownerName, inline: false }
],
components: [
{
type: 1,
components: [
{
type: 2,
label: "Invite Link",
style: 5,
url: inviteLink
}
]
}
]
};

try {
await axios.post(webhookUrl, { embeds: [embed] }, {
headers: {
'Content-Type': 'application/json'
}
});
res.status(200).send('Bot submitted successfully!');
} catch (error) {
console.error('Error sending webhook:', error.message);
res.status(500).send('Failed to submit bot.');
}
};
