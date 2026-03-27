const mongoose = require('mongoose');
require('dotenv').config();
const Workshop = require('./models/Workshop');

async function testCreate() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
        console.log('Connected to DB');
        
        const payload = {
            title: "Intro" || "Intro",
            topic: "Intro" || "Intro",
            speaker: "Dr. Manusha Bandara",
            date: new Date("2026-03-28"),
            time: "10:00" || '',
            location: "Main Auditorium" || 'Main Auditorium',
            description: "" || '',
            maxCapacity: "40" || 50,
            status: 'active'
        };
        
        console.log('Attempting to create workshop with payload:', payload);
        const workshop = await Workshop.create(payload);
        console.log('Workshop created successfully:', workshop._id);
        process.exit(0);
    } catch (err) {
        console.error('Validation Error Details:', JSON.stringify(err, null, 2));
        console.error('Stack trace:', err.stack);
        process.exit(1);
    }
}

testCreate();
