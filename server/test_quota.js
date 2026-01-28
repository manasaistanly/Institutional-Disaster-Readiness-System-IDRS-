const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const modelsToTest = [
    "gemini-2.0-flash-lite-preview-09-2025",
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-2.0-flash-001",
    "gemini-2.5-flash"
];

async function testModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    for (const modelName of modelsToTest) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello?");
            const response = await result.response;
            console.log(`✅ SUCCESS: ${modelName}`);
            console.log(`Response: ${response.text().substring(0, 50)}...`);
            return; // Exit after first success
        } catch (error) {
            console.log(`❌ FAILED: ${modelName}`);
            // console.log(`Error: ${error.message}`);
            if (error.status) console.log(`Status: ${error.status} ${error.statusText}`);
            if (error.response) console.log(`Response Status: ${error.response.status}`);
        }
    }
    console.log("\nAll tested models failed.");
}

testModels();
