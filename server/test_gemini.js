require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        console.log("Testing 'gemini-pro'...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Test");
        console.log("gemini-pro success:", resultPro.response.text());
    } catch (e) {
        console.error("gemini-pro failed.");
        if (e.response) {
            console.error("Status:", e.response.status, e.response.statusText);
        } else {
            console.error("Error:", e.message);
        }
    }

    try {
        console.log("Testing 'gemini-1.5-flash'...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultFlash = await modelFlash.generateContent("Test");
        console.log("gemini-1.5-flash success:", resultFlash.response.text());
    } catch (e) {
        console.error("gemini-1.5-flash failed.");
        if (e.response) {
            console.error("Status:", e.response.status, e.response.statusText);
        } else {
            console.error("Error:", e.message);
        }
    }
}

testGemini();
