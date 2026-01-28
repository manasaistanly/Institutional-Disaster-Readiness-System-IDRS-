const ChatLog = require('../models/ChatLog');
const DisasterSOP = require('../models/DisasterSOP');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// @desc    Process chat message
// @route   POST /api/chat
// @access  Private

// Predefined Safety Rules (Emergency Responses)
const SAFETY_RULES = {
    'fire': "IMMEDIATE ACTION: 1. Pull nearest alarm. 2. Evacuate via stairs (DO NOT USE ELEVATORS). 3. Assemble at the designated point. 4. Call 101.",
    'earthquake': "DROP, COVER, HOLD ON. Stay away from windows. If outside, find open ground away from buildings.",
    'flood': "Move to higher ground. Disconnect electrical appliances. Do not walk through moving water.",
    'medical': "Call ambulance. Check breathing/pulse. Perform CPR if trained. Keep patient warm.",
    'ragging': "Report immediately to Anti-Ragging Squad. Call National Helpline 1800-180-5522. Your identity will be protected."
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Process chat message
// @route   POST /api/chat
// @access  Private
const chatHandler = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }

    const lowerMsg = message.toLowerCase();

    let responseText = "";
    let isEmergency = false;
    let safetyContext = "";

    // 1. Check for Emergency Keywords (Use as Context, not just direct return)
    for (const [key, val] of Object.entries(SAFETY_RULES)) {
        if (lowerMsg.includes(key)) {
            safetyContext = `CRITICAL SAFETY PROCEDURE: ${val}. `;
            isEmergency = true;
            break;
        }
    }

    try {
        // Fetch last 5 messages for conversation memory
        const historyLog = await ChatLog.find({ userId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(5);

        // Format history for Gemini
        // Note: Gemini expects history in chronological order [user, model, user, model...]
        const history = historyLog.reverse().reduce((acc, log) => {
            acc.push({ role: "user", parts: [{ text: log.message }] });
            acc.push({ role: "model", parts: [{ text: log.response }] });
            return acc;
        }, []);

        // Inject the safety rule into the user's message if it exists
        const finalPrompt = safetyContext
            ? `${safetyContext} \n\n User Question: ${message} \n\n (Instructions: Explain the above procedure in detail to the user. Be comforting but urgent.)`
            : message;

        // Initial Attempt with gemini-flash-latest
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: "You are the 'Preparedness Disaster Bot', a highly intelligent and empathetic safety expert for an educational institution. Your goal is to keep students safe. If I have a specific safety rule, I will provide it to you as 'CRITICAL SAFETY PROCEDURE'. You MUST incorporate this procedure into your answer, but expand on it, explain WHY it is important, and add helpful reassurance. Do not be brief. Be detailed, structured, and 'real'. If there is no specific rule, answer using your general knowledge." }]
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I will act as an empathetic, detailed, and intelligent safety expert. I will incorporate any critical procedures provided and ensure my responses are comprehensive, reassuring, and practical." }]
                    },
                    ...history
                ],
            });
            const result = await chat.sendMessage(finalPrompt);
            const response = await result.response;
            responseText = response.text();

        } catch (initialError) {
            console.warn("Primary model failed, attempting fallback to gemini-pro...", initialError.message);
            // Fallback to gemini-pro
            const modelFallback = genAI.getGenerativeModel({ model: "gemini-pro" });
            const chatFallback = modelFallback.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: "You are the 'Preparedness Disaster Bot', a highly intelligent and empathetic safety expert for an educational institution. Your goal is to keep students safe. If I have a specific safety rule, I will provide it to you as 'CRITICAL SAFETY PROCEDURE'. You MUST incorporate this procedure into your answer, but expand on it, explain WHY it is important, and add helpful reassurance. Do not be brief. Be detailed, structured, and 'real'. If there is no specific rule, answer using your general knowledge." }]
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I will act as an empathetic, detailed, and intelligent safety expert. I will incorporate any critical procedures provided and ensure my responses are comprehensive, reassuring, and practical." }]
                    },
                    ...history
                ],
            });
            const resultFallback = await chatFallback.sendMessage(finalPrompt);
            const responseFallback = await resultFallback.response;
            responseText = responseFallback.text();
        }

    } catch (error) {
        console.error("Gemini AI Error (Both Primary & Fallback Failed):", error);

        const fs = require('fs');
        fs.appendFileSync('server_error.log', `${new Date().toISOString()} - Gemini Error: ${error.message}\n`);



        // Fallback if AI crashes
        try {
            if (safetyContext) {
                responseText = safetyContext + " (AI unavailable, defaulting to standard procedure)";
            } else {
                const sop = await DisasterSOP.findOne({ $text: { $search: message } });
                if (sop) {
                    responseText = `Found SOP: ${sop.title}. ${sop.content.substring(0, 100)}...`;
                } else {
                    responseText = "I'm having trouble connecting to the network, but I'm here. If this is an emergency, please call 101 immediately.";
                }
            }
        } catch (fallbackError) {
            console.error("Fallback Logic Error:", fallbackError);
            responseText = "I'm currently unable to process your request. Please contact the help desk or call 101 for emergencies.";
        }
    }

    // 3. Save to Log
    await ChatLog.create({
        userId: req.user.id,
        message,
        response: responseText,
        isEmergency
    });

    res.json({ response: responseText, isEmergency });
};

// @desc    Get user chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
    const history = await ChatLog.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(50);
    res.json(history);
};

module.exports = { chatHandler, getChatHistory };
