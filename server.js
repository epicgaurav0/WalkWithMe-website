const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const friendsFile = path.join(__dirname, 'friends.json');
const requestsFile = path.join(__dirname, 'requests.json');

// Helper to read JSON safely
function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper to write JSON safely
function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Ensure files exist
if (!fs.existsSync(friendsFile)) writeJsonFile(friendsFile, []);
if (!fs.existsSync(requestsFile)) writeJsonFile(requestsFile, []);

// GET /api/friends → returns JSON of friends
app.get('/api/friends', (req, res) => {
    const friends = readJsonFile(friendsFile);
    res.json(friends);
});

// POST /api/register → accepts friend registration data
app.post('/api/register', (req, res) => {
    const newFriend = req.body;
    if (!newFriend.name || !newFriend.area) {
        return res.status(400).json({ error: 'Name and Area are required.' });
    }

    // Add unique ID and timestamp
    newFriend.id = Date.now().toString();
    newFriend.registeredAt = new Date().toISOString();

    const friends = readJsonFile(friendsFile);
    friends.push(newFriend);
    writeJsonFile(friendsFile, friends);

    res.status(201).json({ success: true, friend: newFriend });
});

// POST /api/request → accepts hangout request
app.post('/api/request', (req, res) => {
    const newRequest = req.body;
    if (!newRequest.friendId || !newRequest.yourName || !newRequest.phone) {
        return res.status(400).json({ error: 'Missing required request fields.' });
    }

    newRequest.id = Date.now().toString();
    newRequest.requestedAt = new Date().toISOString();

    const requests = readJsonFile(requestsFile);
    requests.push(newRequest);
    writeJsonFile(requestsFile, requests);

    res.status(201).json({ success: true, message: 'Request submitted successfully.' });
});

// Catch-all route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
