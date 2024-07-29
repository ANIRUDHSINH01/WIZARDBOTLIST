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
    if (req.method === 'POST') {
        const { botID, botPrefix, ownerID, ownerName } = req.body;
        const submissions = loadSubmissions();

        submissions.push({ botID, botPrefix, ownerID, ownerName, status: 'pending' });
        saveSubmissions(submissions);

        res.status(200).send('Bot submitted successfully!');
    } else if (req.method === 'GET') {
        const submissions = loadSubmissions();
        res.status(200).json(submissions);
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
