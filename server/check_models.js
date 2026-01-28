const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Checking models with key: ${apiKey.substring(0, 10)}...`);

https.get(url, (res) => {
    let data = '';

    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Status Message: ${res.statusMessage}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const fs = require('fs');
            fs.writeFileSync('models.json', JSON.stringify(json, null, 2));
            console.log("Models saved to models.json");
        } catch (e) {
            console.error("Error parsing JSON:", e);
        }
    });

}).on('error', (err) => {
    console.error("Network Error:", err.message);
});
