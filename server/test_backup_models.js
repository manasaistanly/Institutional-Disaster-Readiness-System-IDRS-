const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config();

const modelsToTest = [
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest"
];

async function testModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const logFile = 'model_test_results.txt';
    fs.writeFileSync(logFile, 'Starting Model Test\n');

    for (const modelName of modelsToTest) {
        console.log(`Testing ${modelName}...`);
        fs.appendFileSync(logFile, `Testing ${modelName}...\n`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            const text = response.text();

            const successMsg = `✅ SUCCESS: ${modelName} responded: ${text}\n`;
            console.log(successMsg);
            fs.appendFileSync(logFile, successMsg);
            return; // Found a working one
        } catch (error) {
            const failMsg = `❌ FAILED: ${modelName} - ${error.message}\n`;
            console.log(failMsg);
            fs.appendFileSync(logFile, failMsg);
        }
    }
}

testModels();
