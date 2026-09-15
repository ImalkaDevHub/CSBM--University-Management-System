/**
 * CSBM Course Seed Script
 * Run with: node seedCourses.js
 * Seeds the MongoDB database with a rich set of courses.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const DEFAULT_URI = 'mongodb://localhost:27017/csbm-db';
const MONGO_URI = process.env.MONGO_URI || DEFAULT_URI;

const courses = [
  // ─── IT & Computing ───────────────────────────────────────────────────────
  {
    name: 'BSc (Hons) in Software Engineering',
    code: 'SE-401',
    intakeDate: new Date('2026-06-01'),
    applicationDeadline: new Date('2026-05-15'),
    courseFee: 185000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Maths', minimumPasses: 3 },
  },
  {
    name: 'Diploma in Information Technology',
    code: 'DIT-201',
    intakeDate: new Date('2026-07-01'),
    applicationDeadline: new Date('2026-06-20'),
    courseFee: 95000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Any', minimumPasses: 2 },
  },
  {
    name: 'BSc (Hons) in Cybersecurity',
    code: 'CYB-401',
    intakeDate: new Date('2026-09-01'),
    applicationDeadline: new Date('2026-08-10'),
    courseFee: 210000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Maths', minimumPasses: 3 },
  },
  {
    name: 'Higher National Diploma in Computing',
    code: 'HND-301',
    intakeDate: new Date('2026-08-01'),
    applicationDeadline: new Date('2026-07-15'),
    courseFee: 130000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Any', minimumPasses: 2 },
  },
  {
    name: 'Certificate in Web Development & UI/UX',
    code: 'WEB-101',
    intakeDate: new Date('2026-10-01'),
    applicationDeadline: new Date('2026-09-01'),
    courseFee: 65000,
    intakeStatus: 'UPCOMING',
    eligibility: { requiredStream: 'Any', minimumPasses: 0 },
  },
  {
    name: 'BSc (Hons) in Artificial Intelligence & Data Science',
    code: 'AI-401',
    intakeDate: new Date('2026-06-15'),
    applicationDeadline: new Date('2026-05-30'),
    courseFee: 225000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Maths', minimumPasses: 3 },
  },

  // ─── Business & Management ─────────────────────────────────────────────────
  {
    name: 'BSc (Hons) in Business Management',
    code: 'BM-401',
    intakeDate: new Date('2026-06-01'),
    applicationDeadline: new Date('2026-05-18'),
    courseFee: 165000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Commerce', minimumPasses: 3 },
  },
  {
    name: 'Diploma in Accounting & Finance',
    code: 'ACF-201',
    intakeDate: new Date('2026-07-15'),
    applicationDeadline: new Date('2026-06-30'),
    courseFee: 88000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Commerce', minimumPasses: 2 },
  },
  {
    name: 'Postgraduate Diploma in Marketing Management',
    code: 'MKT-501',
    intakeDate: new Date('2026-08-01'),
    applicationDeadline: new Date('2026-07-10'),
    courseFee: 145000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Any', minimumPasses: 3 },
  },
  {
    name: 'Certificate in Human Resource Management',
    code: 'HRM-101',
    intakeDate: new Date('2026-09-15'),
    applicationDeadline: new Date('2026-09-01'),
    courseFee: 55000,
    intakeStatus: 'UPCOMING',
    eligibility: { requiredStream: 'Any', minimumPasses: 2 },
  },
  {
    name: 'MBA — Master of Business Administration',
    code: 'MBA-601',
    intakeDate: new Date('2027-01-15'),
    applicationDeadline: new Date('2026-12-01'),
    courseFee: 380000,
    intakeStatus: 'UPCOMING',
    eligibility: { requiredStream: 'Any', minimumPasses: 3 },
  },

  // ─── Engineering ───────────────────────────────────────────────────────────
  {
    name: 'BEng (Hons) in Electrical & Electronic Engineering',
    code: 'EEE-401',
    intakeDate: new Date('2026-06-01'),
    applicationDeadline: new Date('2026-05-15'),
    courseFee: 195000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Maths', minimumPasses: 3 },
  },
  {
    name: 'BEng (Hons) in Civil Engineering',
    code: 'CE-401',
    intakeDate: new Date('2026-07-01'),
    applicationDeadline: new Date('2026-06-10'),
    courseFee: 188000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Maths', minimumPasses: 3 },
  },
  {
    name: 'Diploma in Mechanical Engineering Technology',
    code: 'MET-201',
    intakeDate: new Date('2026-08-01'),
    applicationDeadline: new Date('2026-07-20'),
    courseFee: 112000,
    intakeStatus: 'OPEN',
    eligibility: { requiredStream: 'Technology', minimumPasses: 2 },
  },
  {
    name: 'BEng (Hons) in Mechatronics Engineering',
    code: 'MCH-401',
    intakeDate: new Date('2027-01-01'),
    applicationDeadline: new Date('2026-12-15'),
    courseFee: 205000,
    intakeStatus: 'UPCOMING',
    eligibility: { requiredStream: 'Maths', minimumPasses: 3 },
  },
];

async function seed() {
  let connectedUri = MONGO_URI;
  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.warn(`⚠️ Failed to connect to ${MONGO_URI}: ${err.message}. Falling back to ${DEFAULT_URI}...`);
    connectedUri = DEFAULT_URI;
    await mongoose.connect(DEFAULT_URI);
  }
  console.log('✅ Connected to MongoDB:', connectedUri);

  try {
    const existing = await Course.countDocuments();
    if (existing > 0) {
      console.log(`ℹ️  Found ${existing} existing courses. Clearing them first...`);
      await Course.deleteMany({});
      console.log('🗑️  Existing courses cleared.');
    }

    const preparedCourses = courses.map(c => ({
      ...c,
      title: c.name,
      fees: c.courseFee,
      nextIntakeDate: c.intakeDate,
      streamReq: c.eligibility?.requiredStream || 'Any',
      minALPasses: c.eligibility?.minimumPasses ?? 2,
      duration: c.name.includes('Diploma') ? '1 Year' : c.name.includes('Certificate') ? '6 Months' : c.name.includes('MBA') ? '1.5 Years' : '3 Years',
      description: `${c.name} program at CSBM Campus offering rigorous academic preparation and industry readiness.`
    }));

    const inserted = await Course.insertMany(preparedCourses);
    console.log(`🎓 Successfully seeded ${inserted.length} courses:\n`);
    inserted.forEach(c => console.log(`   [${c.code}] ${c.name} — LKR ${(c.courseFee || c.fees).toLocaleString()} (${c.intakeStatus})`));

    await mongoose.disconnect();
    console.log('\n✅ Done. Database connection closed.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
