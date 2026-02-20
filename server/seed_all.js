const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Institution = require('./models/Institution');
const DisasterSOP = require('./models/DisasterSOP');
const Alert = require('./models/Alert');
const Drill = require('./models/Drill');
const { Quiz } = require('./models/Quiz');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const institutionsData = [
    {
        name: 'Hyderabad Public School',
        address: '123 Banjara Hills, Hyderabad, Telangana 500034',
        contactEmail: 'admin@hps.edu.in',
        contactPhone: '+91-40-23456789',
        location: { type: 'Point', coordinates: [78.4867, 17.3850] }
    },
    {
        name: 'Secunderabad Government College',
        address: '45 MG Road, Secunderabad, Telangana 500003',
        contactEmail: 'admin@sgc.edu.in',
        contactPhone: '+91-40-27891234',
        location: { type: 'Point', coordinates: [78.5013, 17.4399] }
    },
    {
        name: 'Warangal Engineering Institute',
        address: '7 Kazipet Road, Warangal, Telangana 506004',
        contactEmail: 'info@wei.edu.in',
        contactPhone: '+91-870-2456001',
        location: { type: 'Point', coordinates: [79.5941, 17.9784] }
    }
];

const usersData = (institutions) => [
    // ── Super Admin ────────────────────────────────────────────────────────────
    {
        name: 'Super Admin',
        email: 'admin@idrs.in',
        password: 'admin@123',
        role: 'super_admin',
        location: { state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad', country: 'India' }
    },
    // ── Institution Admins ─────────────────────────────────────────────────────
    {
        name: 'Ravi Kumar',
        email: 'ravi.kumar@hps.edu.in',
        password: 'admin@123',
        role: 'institution_admin',
        institutionId: institutions[0]._id,
        location: { state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad', country: 'India' }
    },
    {
        name: 'Priya Sharma',
        email: 'priya.sharma@sgc.edu.in',
        password: 'admin@123',
        role: 'institution_admin',
        institutionId: institutions[1]._id,
        location: { state: 'Telangana', district: 'Secunderabad', city: 'Secunderabad', country: 'India' }
    },
    // ── Regular Users ──────────────────────────────────────────────────────────
    {
        name: 'Ananya Reddy',
        email: 'ananya.reddy@hps.edu.in',
        password: 'user@123',
        role: 'user',
        institutionId: institutions[0]._id,
        location: { state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad', country: 'India' }
    },
    {
        name: 'Mohammed Aslam',
        email: 'm.aslam@sgc.edu.in',
        password: 'user@123',
        role: 'user',
        institutionId: institutions[1]._id,
        location: { state: 'Telangana', district: 'Secunderabad', city: 'Secunderabad', country: 'India' }
    },
    {
        name: 'Divya Nair',
        email: 'divya.nair@wei.edu.in',
        password: 'user@123',
        role: 'user',
        institutionId: institutions[2]._id,
        location: { state: 'Telangana', district: 'Warangal', city: 'Warangal', country: 'India' }
    }
];

const sopsData = (institutions) => [
    // ── Global SOPs (no institutionId) ─────────────────────────────────────────
    {
        title: 'Fire Emergency Standard Procedure',
        type: 'Fire',
        content: `## Fire Emergency SOP\n\n**Immediate Actions:**\n1. Activate the nearest fire alarm pull station.\n2. Call emergency services: **Dial 101** (Fire) / **112** (National Emergency).\n3. If safe, attempt to extinguish small fires using a CO2 or ABC fire extinguisher (PASS technique: Pull, Aim, Squeeze, Sweep).\n4. Evacuate the building via designated fire exits — **never use elevators**.\n5. Proceed to the assembly point and await roll call.\n\n**Warden Responsibilities:**\n- Conduct floor sweep to ensure no one is left behind.\n- Report all clear / missing persons to the Incident Commander.\n\n**Post Event:**\n- Do not re-enter until cleared by fire authorities.\n- Document the incident and conduct a debrief.`,
        institutionId: null,
        fileUrl: ''
    },
    {
        title: 'Earthquake Response Protocol',
        type: 'Earthquake',
        content: `## Earthquake Response SOP\n\n**During Shaking (DROP–COVER–HOLD ON):**\n1. **DROP** to hands and knees immediately.\n2. Take **COVER** under a sturdy desk/table or against an interior wall away from windows.\n3. **HOLD ON** until shaking stops.\n4. If outdoors, move away from buildings, streetlights, and utility wires.\n\n**After Shaking Stops:**\n1. Check for injuries and hazards (gas leaks, structural damage, downed power lines).\n2. Evacuate the building cautiously via stairways.\n3. Do not use elevators.\n4. Activate emergency communication chain.\n\n**Immediate Notification:**\n- Building Emergency: Report via PA system / WhatsApp emergency group.\n- Public Emergency Line: **Dial 112**.`,
        institutionId: null,
        fileUrl: ''
    },
    {
        title: 'Flood & Heavy Rain Safety Guidelines',
        type: 'Flood',
        content: `## Flood Safety SOP\n\n**Before Flooding:**\n1. Monitor weather alerts from IMD (India Meteorological Department).\n2. Secure important documents and valuables at higher elevations.\n3. Prepare an emergency kit: water, food (3 days), torch, first aid, medicines.\n\n**During Flooding:**\n1. Move to higher floors/levels immediately.\n2. Never walk or drive through floodwaters.\n3. Disconnect electrical appliances if safe; turn off the main switch.\n4. Maintain contact using the institution emergency contact list.\n\n**Evacuation:**\n- Follow NDMA-designated evacuation routes.\n- Emergency Helpline: **1078** (NDMA) / **112**.`,
        institutionId: null,
        fileUrl: ''
    },
    {
        title: 'General Emergency & First Aid Protocol',
        type: 'General',
        content: `## General Emergency SOP\n\n**Medical Emergency:**\n1. Call for help immediately — alert the nearest trained first aider.\n2. Dial **108** (Ambulance) / **112** (Emergency).\n3. Do not move the casualty unless there is immediate danger.\n4. Perform CPR if trained and victim is unresponsive and not breathing.\n\n**Bomb Threat / Security Threat:**\n1. Do not touch suspicious objects.\n2. Evacuate immediately via the nearest exit and call Police: **100**.\n3. Gather at the emergency assembly point.\n\n**Communication Protocol:**\n- Notify the Institution Safety Officer within 5 minutes.\n- Maintain incident log for post-event review.`,
        institutionId: null,
        fileUrl: ''
    },
    // ── Institution-Specific SOP ────────────────────────────────────────────────
    {
        title: 'HPS Fire Evacuation Plan',
        type: 'Fire',
        content: `## Hyderabad Public School — Fire Evacuation Plan\n\n**Assembly Points:**\n- Primary: **Basketball Court (Block A)**\n- Secondary: **School Gate 2 Parking Area**\n\n**Floor Wardens by Block:**\n| Block | Floor | Warden |\n|-------|-------|--------|\n| A | Ground, 1st, 2nd | Ravi Kumar |\n| B | All floors | Rajesh Pillai |\n\n**Evacuation Routes:**\n- Use **staircase A** for blocks A & B.\n- Emergency exits are marked in **green** throughout corridors.\n\n**Drill Schedule:** Every semester (January & July).`,
        institutionId: institutions[0]._id,
        fileUrl: ''
    }
];

const alertsData = (superAdmin) => [
    {
        title: 'Cyclone Warning — Bay of Bengal',
        description: 'IMD has issued a cyclone alert for coastal Andhra Pradesh and Telangana border districts. Expect heavy rains and strong winds (80–100 km/h) over the next 48 hours. All institutions in affected districts should activate emergency protocols.',
        severity: 'emergency',
        source: 'IMD',
        targetInstitutionId: null,
        targetRegions: { states: ['Telangana', 'Andhra Pradesh'], districts: [], cities: [] },
        targetScope: 'state',
        issuedBy: superAdmin._id,
        active: true,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hrs from now
    },
    {
        title: 'Flash Flood Watch — Hyderabad',
        description: 'Hyderabad district has been placed under a flash flood watch following 200mm+ rainfall in the last 24 hours. Citizens should avoid low-lying areas and subways. Schools may consider early dismissal.',
        severity: 'warning',
        source: 'NDMA',
        targetInstitutionId: null,
        targetRegions: { states: ['Telangana'], districts: ['Hyderabad'], cities: [] },
        targetScope: 'district',
        issuedBy: superAdmin._id,
        active: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
        title: 'Earthquake Tremors Reported',
        description: 'Minor tremors (Magnitude 3.8) detected near Warangal. No structural damage reported yet. Residents should remain alert and follow DROP-COVER-HOLD ON procedures if shaking resumes.',
        severity: 'info',
        source: 'INCOIS',
        targetInstitutionId: null,
        targetRegions: { states: ['Telangana'], districts: ['Warangal'], cities: [] },
        targetScope: 'district',
        issuedBy: superAdmin._id,
        active: true,
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
    },
    {
        title: 'Heat Wave Advisory — Telangana',
        description: 'Temperatures are forecast to exceed 44°C over the next 5 days. Institutions should suspend outdoor activities between 12:00 PM and 4:00 PM. Ensure adequate water supply and hydration stations.',
        severity: 'warning',
        source: 'IMD',
        targetInstitutionId: null,
        targetRegions: { states: ['Telangana'], districts: [], cities: [] },
        targetScope: 'state',
        issuedBy: superAdmin._id,
        active: true,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'All-Clear: Cyclone Warning Lifted',
        description: 'The cyclone warning for coastal Andhra Pradesh and Telangana has been officially lifted by IMD. Normal operations may resume. Conduct damage inspections before reopening facilities.',
        severity: 'info',
        source: 'IMD',
        targetInstitutionId: null,
        targetRegions: { states: ['Telangana', 'Andhra Pradesh'], districts: [], cities: [] },
        targetScope: 'state',
        issuedBy: superAdmin._id,
        active: false,
        expiresAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // already expired
    }
];

const drillsData = (institutions, users) => {
    const instAdmin1 = users.find(u => u.email === 'ravi.kumar@hps.edu.in');
    const instAdmin2 = users.find(u => u.email === 'priya.sharma@sgc.edu.in');

    return [
        {
            title: 'Annual Fire Evacuation Drill',
            description: 'Full-campus fire evacuation drill involving all students, faculty, and staff. Tests alarm systems, evacuation routes, and warden response time.',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            status: 'Scheduled',
            institutionId: institutions[0]._id,
            createdBy: instAdmin1._id
        },
        {
            title: 'Earthquake DROP-COVER-HOLD ON Drill',
            description: 'Classroom-level earthquake response drill practising the DROP-COVER-HOLD ON procedure. Includes post-shaking evacuation to assembly point.',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            status: 'Completed',
            institutionId: institutions[0]._id,
            createdBy: instAdmin1._id
        },
        {
            title: 'Medical Emergency Response Drill',
            description: 'Simulated cardiac arrest drill to test first-aid readiness, AED usage, and 108 ambulance coordination timelines.',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
            status: 'Scheduled',
            institutionId: institutions[1]._id,
            createdBy: instAdmin2._id
        },
        {
            title: 'Flood Evacuation Tabletop Exercise',
            description: 'Discussion-based exercise to review flood response plan, inter-department communication, and alternative routes if ground floor is flooded.',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
            status: 'Completed',
            institutionId: institutions[1]._id,
            createdBy: instAdmin2._id
        },
        {
            title: 'Campus Security Lockdown Drill',
            description: 'Full campus lockdown simulation testing classroom secure-in-place procedures, communication with security personnel, and external authority coordination.',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            status: 'Cancelled',
            institutionId: institutions[2]._id,
            createdBy: null
        }
    ];
};

const quizzesData = (superAdmin) => [
    {
        title: 'Basic Fire Safety',
        description: 'Essential knowledge for handling fire emergencies — suitable for all staff and students.',
        createdBy: superAdmin._id,
        questions: [
            {
                questionText: 'What is the first thing you should do when you hear a fire alarm?',
                options: ['Ignore it and wait', 'Evacuate immediately via the nearest exit', 'Run to the roof', 'Hide under a desk'],
                correctOptionIndex: 1
            },
            {
                questionText: 'Which fire extinguisher type is correct for electrical fires?',
                options: ['Water', 'Foam', 'CO2 (Carbon Dioxide)', 'Wet Chemical'],
                correctOptionIndex: 2
            },
            {
                questionText: "What does the 'PASS' technique stand for?",
                options: ['Pull, Aim, Squeeze, Sweep', 'Push, Aim, Shoot, Stop', 'Pull, Alarm, Shout, Sprint', 'Pass, Ask, Speak, Solve'],
                correctOptionIndex: 0
            },
            {
                questionText: "Should you use an elevator during a fire evacuation?",
                options: ['Yes, it is faster', 'Only if ground floor is flooded', 'No, always use stairways', 'Only with firefighter permission'],
                correctOptionIndex: 2
            }
        ]
    },
    {
        title: 'Earthquake Preparedness',
        description: 'Test your knowledge on earthquake safety and the DROP-COVER-HOLD ON protocol.',
        createdBy: superAdmin._id,
        questions: [
            {
                questionText: 'What is the correct earthquake response action?',
                options: ['Run outside immediately', 'Stand in a doorway', 'DROP, COVER, and HOLD ON', 'Call emergency services first'],
                correctOptionIndex: 2
            },
            {
                questionText: 'After an earthquake, what should you check for first?',
                options: ['Social media updates', 'Gas leaks and structural damage', 'Your phone battery', 'The cafeteria'],
                correctOptionIndex: 1
            },
            {
                questionText: 'Where is the safest place during an earthquake indoors?',
                options: ['Next to a window', 'Under a sturdy table or desk', 'In a crowded hallway', 'On the top floor'],
                correctOptionIndex: 1
            }
        ]
    },
    {
        title: 'Flood Safety & Preparedness',
        description: 'Assess your readiness for flood emergencies and proper evacuation procedures.',
        createdBy: superAdmin._id,
        questions: [
            {
                questionText: 'What should you do if floodwater starts entering your building?',
                options: ['Stay on the ground floor', 'Move to higher floors immediately', 'Go to the basement', 'Open windows for ventilation'],
                correctOptionIndex: 1
            },
            {
                questionText: 'Is it safe to walk through floodwater that looks shallow?',
                options: ['Yes, if it is below knee level', 'Yes, with rubber boots', 'No — moving water can knock you down', 'Only in daylight'],
                correctOptionIndex: 2
            },
            {
                questionText: 'What is the NDMA flood helpline number in India?',
                options: ['101', '108', '1078', '100'],
                correctOptionIndex: 2
            }
        ]
    },
    {
        title: 'General Emergency First Aid',
        description: 'A quick check on basic first aid knowledge relevant to institutional emergency scenarios.',
        createdBy: superAdmin._id,
        questions: [
            {
                questionText: 'What is the ambulance emergency number in India?',
                options: ['100', '101', '108', '112'],
                correctOptionIndex: 2
            },
            {
                questionText: 'When should you start CPR?',
                options: ['When the person is sleeping', 'When the person is unresponsive and not breathing normally', 'When the person has a headache', 'Only after getting permission'],
                correctOptionIndex: 1
            },
            {
                questionText: 'What should you NOT do when finding a suspicious package?',
                options: ['Alert security', 'Evacuate the area', 'Touch or move it', 'Call the police'],
                correctOptionIndex: 2
            }
        ]
    }
];

// ─── MAIN SEED ────────────────────────────────────────────────────────────────

const seed = async () => {
    try {
        await connectDB();

        console.log('\n🗑️  Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Institution.deleteMany({}),
            DisasterSOP.deleteMany({}),
            Alert.deleteMany({}),
            Drill.deleteMany({}),
            Quiz.deleteMany({})
        ]);

        // 1. Institutions
        console.log('🏫 Seeding Institutions...');
        const institutions = await Institution.insertMany(institutionsData);

        // 2. Users
        console.log('👥 Seeding Users...');
        // Create users one-by-one so the pre-save bcrypt hook fires per document
        const userPayloads = usersData(institutions);
        const users = [];
        for (const payload of userPayloads) {
            const u = await User.create(payload);
            users.push(u);
        }

        const superAdmin = users.find(u => u.role === 'super_admin');

        // 3. SOPs
        console.log('📋 Seeding Disaster SOPs...');
        await DisasterSOP.insertMany(sopsData(institutions));

        // 4. Alerts
        console.log('🚨 Seeding Alerts...');
        await Alert.insertMany(alertsData(superAdmin));

        // 5. Drills
        console.log('🔔 Seeding Drills...');
        await Drill.insertMany(drillsData(institutions, users));

        // 6. Quizzes
        console.log('📝 Seeding Quizzes...');
        await Quiz.insertMany(quizzesData(superAdmin));

        // ── Summary ────────────────────────────────────────────────────────────
        console.log('\n════════════════════════════════════════════');
        console.log('✅  SEED COMPLETE — IDRS DATABASE READY');
        console.log('════════════════════════════════════════════');
        console.log(`  Institutions : ${institutions.length}`);
        console.log(`  Users        : ${users.length}`);
        console.log(`  SOPs         : ${sopsData(institutions).length}`);
        console.log(`  Alerts       : ${alertsData(superAdmin).length}`);
        console.log(`  Drills       : ${drillsData(institutions, users).length}`);
        console.log(`  Quizzes      : ${quizzesData(superAdmin).length}`);
        console.log('────────────────────────────────────────────');
        console.log('  LOGIN CREDENTIALS');
        console.log('────────────────────────────────────────────');
        console.log('  Super Admin  : admin@idrs.in        / admin@123');
        console.log('  Inst Admin 1 : ravi.kumar@hps.edu.in / admin@123');
        console.log('  Inst Admin 2 : priya.sharma@sgc.edu.in / admin@123');
        console.log('  User 1       : ananya.reddy@hps.edu.in / user@123');
        console.log('  User 2       : m.aslam@sgc.edu.in    / user@123');
        console.log('  User 3       : divya.nair@wei.edu.in  / user@123');
        console.log('════════════════════════════════════════════\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    }
};

seed();
