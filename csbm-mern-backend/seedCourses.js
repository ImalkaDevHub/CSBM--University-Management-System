const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const Course = require('./models/Course');

const runSeed = async () => {
    console.log('Connecting to database...');
    await connectDB();

    const courses = [
        {
            code: 'CIT-102',
            name: 'Diploma in Software Engineering',
            courseFee: 175000,
            intakeDate: new Date('2026-06-01'),
            applicationDeadline: new Date('2026-05-20'),
            intakeStatus: 'OPEN'
        },
        {
            code: 'CIT-201',
            name: 'BSc in Computer Science',
            courseFee: 450000,
            intakeDate: new Date('2026-09-01'),
            applicationDeadline: new Date('2026-08-15'),
            intakeStatus: 'OPEN'
        },
        {
            code: 'CIT-301',
            name: 'HND in Cybersecurity',
            courseFee: 320000,
            intakeDate: new Date('2026-07-01'),
            applicationDeadline: new Date('2026-06-25'),
            intakeStatus: 'OPEN'
        },
        {
            code: 'BUS-101',
            name: 'Diploma in Business Management',
            courseFee: 120000,
            intakeDate: new Date('2026-05-01'),
            applicationDeadline: new Date('2026-04-20'),
            intakeStatus: 'OPEN'
        },
        {
            code: 'BUS-201',
            name: 'BSc in Accounting & Finance',
            courseFee: 380000,
            intakeDate: new Date('2026-09-01'),
            applicationDeadline: new Date('2026-08-15'),
            intakeStatus: 'OPEN'
        },
        {
            code: 'BUS-301',
            name: 'MBA in Strategic Management',
            courseFee: 650000,
            intakeDate: new Date('2026-10-01'),
            applicationDeadline: new Date('2026-09-30'),
            intakeStatus: 'UPCOMING'
        },
        {
            code: 'BENG-202',
            name: 'HND in Civil Engineering',
            courseFee: 420000,
            intakeDate: new Date('2026-06-01'),
            applicationDeadline: new Date('2026-05-25'),
            intakeStatus: 'OPEN'
        },
        {
            code: 'BENG-301',
            name: 'BSc in Electrical Engineering',
            courseFee: 780000,
            intakeDate: new Date('2026-09-01'),
            applicationDeadline: new Date('2026-08-15'),
            intakeStatus: 'OPEN'
        }
    ];

    try {
        console.log('Seeding courses...');
        for (const c of courses) {
            await Course.findOneAndUpdate({ code: c.code }, c, { upsert: true, new: true, setDefaultsOnInsert: true });
            console.log(`Upserted course: ${c.code}`);
        }
        console.log('Seed completed successfully!');
    } catch (err) {
        console.error('Error seeding courses:', err);
    } finally {
        process.exit(0);
    }
};

runSeed();
