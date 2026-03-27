const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./models/User');
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
    const admin = await User.findOne({ role: 'ADMIN' });
    if (!admin) {
        console.error('No admin found');
        process.exit(1);
    }
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'csbm_super_secret_key_12345');
    
    // Attempt the fetch using Node's fetch
    const payload = {
        "topic": "Intro",
        "category": "Technical",
        "speaker": "Dr. Manusha Bandara",
        "speakerTitle": "Senior Lecturer",
        "date": "2026-03-28",
        "time": "10:00",
        "status": "Upcoming",
        "venue": "Main Auditorium",
        "capacity": "40",
        "price": "0",
        "description": "",
        "title": "Intro",
        "location": "Main Auditorium",
        "maxCapacity": "40"
    };

    try {
        const res = await fetch('http://127.0.0.1:5000/api/workshops', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text);
    } catch (err) {
        console.error('Fetch error:', err);
    }
    process.exit(0);
}

run();
