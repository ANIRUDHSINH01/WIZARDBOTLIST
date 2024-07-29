const axios = require('axios');
const fs = require('fs');
const path = require('path');

const webhookUrl = process.env.WEBHOOK_URL;
const submissionsFile = path.join(__dirname, 'submissions.json');

// Load submissions from file
const loadSubmissions = () => {
    try {
        const data = fs.readFileSync(submissionsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Save submissions to file
const saveSubmissions = (submissions) => {
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
};

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
res.status(405).send('Method Not Allowed');
        return;
    }

    const { botID, userID } = req.body;
    const adminIDs = ['863112842390929448', 'admin2_id']; // Replace with actual admin IDs

    if (!adminIDs.includes(userID)) {
        res.status(403).send('Forbidden');
        return;
    }

    const submissions = loadSubmissions();
    const submission = submissions.find(sub => sub.botID === botID);

    if (!submission) {
        res.status(404).send('Bot not found.');
        return;
    }

    submission.status = 'approved';
    saveSubmissions(submissions);

    const embed = {
        title: "Bot Approved",
        color: 3447003,
        fields: [
            { name: "Bot ID", value: submission.botID, inline: false },
            { name: "Bot Prefix", value: submission.botPrefix, inline: false },
            { name: "Owner ID", value: submission.ownerID, inline: false },
            { name: "Owner Name", value: submission.ownerName, inline: false }
        ]
    };

    try {
        await axios.post(webhookUrl, { content: `<@${submission.ownerid}>`, embeds: [embed] }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.status(200).send('Bot approved successfully!');
    } catch (error) {
        console.error('Error sending webhook:', error.message);
        res.status(500).send('Failed to approve bot.');
    }
};
