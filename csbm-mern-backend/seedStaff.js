const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
    { fullName: 'Super Admin', email: 'admin@csbm.lk', password: 'admin1234', role: 'super_admin' },
    { fullName: 'Registration Staff', email: 'reg@csbm.lk', password: 'reg1234', role: 'registration_staff' },
    { fullName: 'Marketing Coordinator', email: 'marketing@csbm.lk', password: 'mark1234', role: 'marketing_coordinator' },
    { fullName: 'Finance Staff', email: 'finance@csbm.lk', password: 'fin1234', role: 'finance_staff' }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/csbm');
        console.log('Connected to MongoDB');

        for (const u of users) {
            const existing = await User.findOne({ email: u.email });
            if (!existing) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(u.password, salt);
                
                await User.create({
                    ...u,
                    password: hashedPassword
                });
                console.log(`Created user: ${u.email}`);
            } else {
                console.log(`User already exists: ${u.email} - Updating role and password`);
                const salt = await bcrypt.genSalt(10);
                existing.password = await bcrypt.hash(u.password, salt);
                existing.role = u.role;
                await existing.save();
            }
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
