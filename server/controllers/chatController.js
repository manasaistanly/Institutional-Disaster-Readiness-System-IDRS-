const ChatLog = require('../models/ChatLog');
const Groq = require('groq-sdk');

// Initialize Groq AI
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// @desc    Process chat message with Real AI (Groq)
// @route   POST /api/chat
// @access  Private
const chatHandler = async (req, res) => {
    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ message: "Message is required" });
    }

    let responseText = "";

    try {
        // Fetch recent conversation history for context
        const historyLog = await ChatLog.find({ userId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(10);

        // Build conversation messages for Groq
        const messages = [
            {
                role: "system",
                content: `You are an expert **Disaster Readiness & Safety Assistant**. Your mission is to provide comprehensive, life-saving advice to **anyone** in an emergency situation.

**Your expertise covers:**
- 🔥 Fire safety protocols (Home, Office, Public Spaces)
- 🌍 Earthquake survival (Drop, Cover, Hold On)
- 🌊 Flood preparedness and water safety
- 🏥 Medical emergencies, First Aid, and CPR
- 🌪️ Weather emergencies (Cyclones, Storms, Heatwaves)
- 🛡️ General personal safety and emergency preparedness

**Communication style:**
- Be professional yet empathetic, acting as a knowledgeable survival expert.
- Provide **universal safety advice** applicable to the general public.
- Use detailed explanations (4-6 paragraphs) with clear "WHY" reasoning.
- Structure answers with **bold headers**, bullet points, and numbered lists.
- Be reassuring but urgent when necessary.
- Include universal emergency numbers (e.g., "Call 112 / 100 / 101").

**Response structure:**
1. Immediate critical actions (if emergency).
2. Detailed step-by-step procedures.
3. Explanations of risks and common mistakes.
4. "Pro-tips" for preparedness.
5. Reassuring conclusion.`
            }
        ];

        // Add conversation history (most recent 10 exchanges)
        historyLog.reverse().forEach(log => {
            messages.push(
                { role: "user", content: log.message },
                { role: "assistant", content: log.response }
            );
        });

        // Add current message
        messages.push({ role: "user", content: message });

        // Call Groq API with optimal parameters
        console.log("🤖 Calling Groq AI (Llama 3.3 70B)...");

        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile", // Latest, most capable model
            temperature: 0.8, // Slightly higher for more natural, varied responses
            max_tokens: 1200, // Increased for detailed responses
            top_p: 0.95,
            stream: false
        });

        responseText = chatCompletion.choices[0]?.message?.content || "";

        if (!responseText || responseText.length < 50) {
            throw new Error('Response too short or empty');
        }

        console.log(`✅ AI response generated (${responseText.length} chars)`);

    } catch (error) {
        console.error("❌ Groq AI Error:", error.message);

        // High-quality fallback responses based on keywords
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('fire') || lowerMsg.includes('smoke') || lowerMsg.includes('burning') || lowerMsg.includes('flame')) {
            responseText = `🔥 **FIRE EMERGENCY RESPONSE PROTOCOL**

I understand you're asking about fire safety - this is critical information that could save lives.

**IMMEDIATE ACTIONS (if fire is active):**

1. **Sound the Alarm** 🚨
   - Pull the nearest fire alarm pull station
   - This alerts everyone in the building and notifies emergency services
   - Don't assume someone else will do it

2. **Evacuate Immediately** 🚪
   - Use the nearest safe exit
   - **NEVER use elevators** - they can malfunction during fires and trap you
   - Help others if you can do so safely

3. **Stay Low if Smoke is Present** 💨
   - Drop to your hands and knees
   - Breathable air stays closer to the floor (heat and smoke rise)
   - Cover your nose and mouth with cloth if possible

4. **Close Doors Behind You** 🚪
   - This slows fire spread and buys precious time
   - Don't lock doors - others may need to escape

5. **Go to Assembly Point** 📍
   - Every building has designated meeting areas
   - DO NOT re-enter for any reason until authorities say it's safe
   - Account for everyone from your area

**CALL EMERGENCY SERVICES:**
📞 **101** - Fire Department
📞 **108** - Medical Emergency (if injuries)

**IF YOU'RE TRAPPED:**
- Seal door cracks with cloth or clothing
- Place a visible signal at your window (bright cloth, flashlight)
- Call emergency services and give your exact location
- Stay near floor where air is better

**WHAT NOT TO DO:**
❌ Don't panic and run blindly
❌ Don't open hot doors (feel with back of hand first)
❌ Don't break windows (creates more oxygen for fire)
❌ Don't try to fight large fires yourself

**REMEMBER:** Things can be replaced, YOU cannot. Get out first, stay out, then call for help. You're going to be okay if you follow these steps! 💪`;

        } else if (lowerMsg.includes('earthquake') || lowerMsg.includes('shaking') || lowerMsg.includes('tremor') || lowerMsg.includes('building') && lowerMsg.includes('moving')) {
            responseText = `🌍 **EARTHQUAKE SAFETY GUIDE**

Earthquakes can be terrifying, but knowing what to do greatly increases your safety. Let me walk you through this comprehensively.

**DURING THE EARTHQUAKE (While Shaking):**

The gold standard is **DROP, COVER, HOLD ON** - and here's why each step matters:

1. **DROP 🪨**
   - Get down on your hands and knees IMMEDIATELY
   - Why? Prevents you from being knocked down by violent shaking
   - This position lets you stay mobile if needed while staying low

2. **COVER 🛡️**
   - Get under a sturdy desk, table, or against an interior wall
   - Protect your head and neck with your arms
   - Why? The main killer in earthquakes is falling objects (ceiling debris, light fixtures, furniture)
   - A strong table creates a "survival space" even if something falls on it

3. **HOLD ON 🤝**
   - Grip the furniture and be prepared to move with it
   - Stay in position until shaking completely stops
   - Why? Aftershocks can start within seconds

**WHAT TO AVOID:**
❌ Doorways (outdated advice - not structurally stronger in modern buildings)
❌ Windows (can shatter)
❌ Heavy furniture or appliances that can topple
❌ Running outside during shaking (falling debris)
❌ Elevators

**IF YOU'RE OUTSIDE:**
- Move to an open area away from buildings
- Stay away from power lines, trees, streetlights
- If on a hill, beware of landslides
- If driving: Pull over safely, stay in vehicle until shaking stops

**AFTER THE EARTHQUAKE:**

1. **Check for Injuries** 🏥
   - Treat injuries, call 108 if needed
   - Do NOT move seriously injured people unless in immediate danger

2. **Inspect for Hazards** ⚠️
   - Gas leaks (smell) - turn off main valve if you smell gas, then leave
   - Damaged electrical wiring - turn off electricity if safe
   - Structural damage - if building seems unsafe, evacuate

3. **Expect Aftershocks** 📊
   - Can occur minutes, hours, or days later
   - Some can be nearly as strong as main quake
   - Be ready to DROP, COVER, HOLD ON again

4. **Communication** 📱
   - Text instead of calling (preserves network capacity)
   - Use official sources for information
   - Check on neighbors, especially elderly

**PREPAREDNESS TIP:**
Keep an emergency kit with water, food, first aid, flashlight, radio, and important documents. Identify safe spots in each room NOW, before an earthquake hits.

You've got this! Knowledge is your best protection. 🛡️`;

        } else if (lowerMsg.includes('cpr') || lowerMsg.includes('not breathing') || lowerMsg.includes('unconscious') || lowerMsg.includes('cardio')) {
            responseText = `💓 **CPR (Cardiopulmonary Resuscitation) COMPREHENSIVE GUIDE**

CPR can be the difference between life and death. Here's everything you need to know:

**WHEN TO USE CPR:**
- Person is unconscious (unresponsive to shaking/shouting)
- Not breathing OR not breathing normally (gasping doesn't count as breathing)
- No pulse (if you know how to check)

**IMMEDIATE STEPS:**

1. **CALL FOR HELP FIRST** 📞
   - **Dial 108 or 102** (Ambulance)
   - Put on speaker so you can get guidance while helping
   - If others present, delegate: "You in the red shirt, call 108 now!"

2. **Position the Person** 🛏️
   - Lay them flat on their back on a firm surface
   - Turn head to side briefly if vomiting

3. **Hand Position** ✋
   - Place heel of one hand on center of chest (between nipples)
   - Place other hand on top, interlocking fingers
   - Shoulders directly over hands
   - Keep arms straight (use body weight, not arm strength)

4. **COMPRESSION TECHNIQUE** 💪
   - Push HARD and FAST
   - Depth: At least 2 inches (5 cm) for adults
   - Rate: 100-120 compressions per minute
   - **Rhythm trick:** Sing "Stayin' Alive" by Bee Gees - perfect tempo!

5. **DON'T STOP** ⏱️
   - Continue until:
     * Person starts breathing normally
     * Professional help arrives
     * You're too exhausted (switch with someone if possible)
     * Scene becomes unsafe

**FOR TRAINED INDIVIDUALS:**
After every 30 compressions, give 2 rescue breaths:
- Tilt head back, lift chin
- Pinch nose closed
- Make seal over mouth
- Breathe in for 1 second (watch chest rise)
- Repeat once

**COMMON CONCERNS:**

"Will I hurt them?" 
- You might break ribs (it's okay - that's better than death!)
- Ribs heal, death doesn't

"What if I do it wrong?"
- Doing SOMETHING is infinitely better than doing nothing
- Any CPR is better than no CPR

"What if they're not actually in cardiac arrest?"
- A healthy heart won't stop from compressions
- If they wake up, stop immediately

**IMPORTANT NOTES:**
- It's physically exhausting - don't feel bad if you get tired
- If you hear cracking/popping sounds, that's normal (ribs/cartilage)
- For children: Use one hand, gentler (1/3 of chest depth)
- For infants: Use two fingers

**AED (If Available):**
If an Automated External Defibrillator is nearby:
1. Turn it on
2. Follow voice instructions
3. Continue CPR between shocks

You have the power to save a life. Trust yourself, and go for it! Every second counts. 💪❤️`;

        } else {
            responseText = `Hi! I'm your Disaster Safety Assistant, powered by real AI to help with any safety questions you might have.

**I can provide detailed, comprehensive guidance on:**

🔥 **Fire Safety & Evacuation**
- Emergency procedures and protocols
- What to do if trapped or separated
- Fire prevention tips

🌍 **Earthquake Response**  
- DROP, COVER, HOLD ON techniques
- Before, during, and after actions
- Aftershock preparedness

🌊 **Flood & Weather Emergencies**
- Evacuation procedures
- Water safety guidelines
- Recovery and cleanup

🏥 **Medical Emergencies**
- First aid basics
- Injury assessment and treatment
- When and how to call for help

💓 **CPR & Life-Saving Techniques**
- Hands-only CPR for untrained individuals
- Full CPR for trained rescuers
- Choking response (Heimlich maneuver)

🛡️ **Anti-Ragging & Mental Health**
- How to report and where to get help
- National helpline: 1800-180-5522
- Your rights and protections

📦 **Emergency Preparedness**
- Emergency kit essentials
- Family communication plans
- Drill procedures

**Your question:** "${message}"

I noticed this doesn't match my core safety topics. Could you:
- Rephrase your question?
- Specify which emergency topic you're interested in?
- Ask about a specific safety scenario?

I'm here to provide thorough, detailed answers that could save lives. Don't hesitate to ask anything related to safety! 

**Emergency Numbers:**
🚒 Fire: 101
🏥 Medical: 108 / 102  
👮 Police: 100
📞 Anti-Ragging: 1800-180-5522`;
        }
    }

    // Save to database
    try {
        await ChatLog.create({
            userId: req.user.id,
            message,
            response: responseText,
            isEmergency: false
        });
    } catch (dbError) {
        console.error("Database error:", dbError.message);
    }

    res.json({ response: responseText, isEmergency: false });
};

// @desc    Get user chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
    try {
        const history = await ChatLog.find({ userId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(50);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Error fetching chat history" });
    }
};

module.exports = { chatHandler, getChatHistory };
