/**
 * CSBM Workshops + Notifications Seed Script
 * Run with: node seedWorkshopsAndNotifications.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Workshop = require('./models/Workshop');
const Notification = require('./models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

const workshops = [
  {
    title: 'Introduction to Machine Learning',
    topic: 'Introduction to Machine Learning',
    speaker: 'Dr. Nimal Perera',
    date: new Date('2026-04-20'),
    time: '09:00 AM - 12:00 PM',
    location: 'Main Auditorium',
    description: 'A hands-on walkthrough of core ML concepts including supervised learning, regression, and classification using Python & scikit-learn.',
    maxCapacity: 80,
    capacity: 80,
    status: 'active',
  },
  {
    title: 'Cybersecurity Essentials for Modern Business',
    topic: 'Cybersecurity Essentials for Modern Business',
    speaker: 'Ms. Dumindra Silva',
    date: new Date('2026-05-03'),
    time: '01:00 PM - 04:00 PM',
    location: 'Lecture Hall B',
    description: 'Understanding threats, vulnerabilities, and best practices for protecting business IT infrastructure. Covers firewalls, penetration testing, and compliance.',
    maxCapacity: 60,
    capacity: 60,
    status: 'active',
  },
  {
    title: 'Entrepreneurship & Startup Culture in Sri Lanka',
    topic: 'Entrepreneurship & Startup Culture in Sri Lanka',
    speaker: 'Mr. Kasun Jayawardena',
    date: new Date('2026-05-15'),
    time: '10:00 AM - 01:00 PM',
    location: 'Innovation Hub',
    description: 'Learn from a seasoned entrepreneur about launching a startup, securing funding, building MVPs, and scaling in the local tech ecosystem.',
    maxCapacity: 50,
    capacity: 50,
    status: 'active',
  },
  {
    title: 'Full‑Stack Web Development with React & Node.js',
    topic: 'Full-Stack Web Development with React & Node.js',
    speaker: 'Eng. Priya Rathnayake',
    date: new Date('2026-06-07'),
    time: '09:00 AM - 05:00 PM',
    location: 'Computer Lab 1',
    description: 'A full-day intensive workshop building a complete MERN stack application from scratch. Participants will deploy a live project by end of day.',
    maxCapacity: 30,
    capacity: 30,
    status: 'active',
  },
  {
    title: 'Financial Literacy & Investment Basics',
    topic: 'Financial Literacy & Investment Basics',
    speaker: 'Mr. Ashan Fernando',
    date: new Date('2026-06-20'),
    time: '02:00 PM - 05:00 PM',
    location: 'Seminar Room 3',
    description: 'Covers personal finance, stock market fundamentals, cryptocurrency risks, and building a disciplined investment portfolio from a student perspective.',
    maxCapacity: 70,
    capacity: 70,
    status: 'active',
  },
  {
    title: 'UI/UX Design Thinking Workshop',
    topic: 'UI/UX Design Thinking Workshop',
    speaker: 'Ms. Tharuka Mendis',
    date: new Date('2026-07-12'),
    time: '10:00 AM - 02:00 PM',
    location: 'Design Studio',
    description: 'A practical design sprint covering user research, wireframing, prototyping in Figma, and usability testing methodologies used in top tech companies.',
    maxCapacity: 40,
    capacity: 40,
    status: 'active',
  },
  {
    title: 'Cloud Computing & DevOps Fundamentals',
    topic: 'Cloud Computing & DevOps Fundamentals',
    speaker: 'Mr. Roshan Dissanayake',
    date: new Date('2026-07-25'),
    time: '09:00 AM - 01:00 PM',
    location: 'Main Auditorium',
    description: 'Introduction to AWS, Azure, and GCP cloud services. Includes a live demo of CI/CD pipelines, Docker containers, and Kubernetes orchestration.',
    maxCapacity: 90,
    capacity: 90,
    status: 'active',
  },
  {
    title: 'Data Analytics with Power BI',
    topic: 'Data Analytics with Power BI',
    speaker: 'Dr. Samadhi Wickramasinghe',
    date: new Date('2026-08-10'),
    time: '01:00 PM - 05:00 PM',
    location: 'Computer Lab 2',
    description: 'Transform raw data into stunning dashboards. This workshop uses real datasets to teach data cleaning, DAX formulas, and publishing interactive reports.',
    maxCapacity: 35,
    capacity: 35,
    status: 'active',
  },
  {
    title: 'Leadership & Team Management in Tech',
    topic: 'Leadership & Team Management in Tech',
    speaker: 'Ms. Nadee Jayasinghe',
    date: new Date('2026-08-22'),
    time: '10:00 AM - 12:00 PM',
    location: 'Seminar Room 1',
    description: 'Explores leadership styles, agile team management, conflict resolution, and building high-performance engineering teams in fast-paced tech environments.',
    maxCapacity: 60,
    capacity: 60,
    status: 'active',
  },
  {
    title: 'Sustainable Engineering & Green Technology',
    topic: 'Sustainable Engineering & Green Technology',
    speaker: 'Prof. Lakmal Bandara',
    date: new Date('2026-09-05'),
    time: '09:00 AM - 12:00 PM',
    location: 'Engineering Block A',
    description: 'Explores solar, wind, and hydro energy systems, sustainable structural design principles, and the role of engineers in combating climate change.',
    maxCapacity: 75,
    capacity: 75,
    status: 'active',
  },
];

const notifications = [
  {
    type: 'general-notice',
    subject: 'Welcome to CSBM Campus Portal!',
    message: 'Dear Student,\n\nWelcome to the CSBM Campus Management Portal. You can now track your application status, browse upcoming workshops, and manage your academic journey all from one place.\n\nIf you have any questions, please contact the admissions office.',
    isRead: false,
    status: 'sent',
    createdBy: 'admin',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    type: 'approval',
    subject: 'Your Application Has Been Reviewed',
    message: 'Dear Student,\n\nThank you for submitting your application to CSBM. Our admissions team has reviewed your documents and we will notify you of the decision within 3-5 working days.\n\nBest regards,\nAdmissions Office',
    isRead: false,
    status: 'sent',
    createdBy: 'admin',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    type: 'workshop-reminder',
    subject: 'Upcoming Workshop: Introduction to Machine Learning',
    message: 'Dear Student,\n\nThis is a reminder that the <strong>Introduction to Machine Learning</strong> workshop is scheduled for <strong>April 20, 2026 at 9:00 AM</strong> in the Main Auditorium.\n\nPlease arrive 15 minutes early. Bring your laptop and ensure Python is installed.\n\nSee you there!',
    isRead: false,
    status: 'sent',
    createdBy: 'admin',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    type: 'general-notice',
    subject: 'New Courses Added to the 2026 Catalog',
    message: 'Dear Student,\n\nWe are excited to announce that 15 new programs have been added to the CSBM Academic Catalog for 2026, including:\n\n• BSc in Artificial Intelligence & Data Science\n• BEng in Mechatronics Engineering\n• MBA — Master of Business Administration\n\nVisit the Course Catalog to explore all available programs and check your eligibility.',
    isRead: false,
    status: 'sent',
    createdBy: 'admin',
    createdAt: new Date(),
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB:', MONGO_URI);

    // ─── Workshops ─────────────────────────────────────────────────────────
    const existingWorkshops = await Workshop.countDocuments();
    if (existingWorkshops > 0) {
      await Workshop.deleteMany({});
      console.log(`🗑️  Cleared ${existingWorkshops} existing workshops.`);
    }
    const insertedWorkshops = await Workshop.insertMany(workshops);
    console.log(`\n🎓 Seeded ${insertedWorkshops.length} workshops:`);
    insertedWorkshops.forEach(w => console.log(`   [${w.date.toDateString()}] ${w.title} — ${w.speaker}`));

    // ─── Notifications ─────────────────────────────────────────────────────
    const existingNotifications = await Notification.countDocuments();
    if (existingNotifications > 0) {
      await Notification.deleteMany({});
      console.log(`\n🗑️  Cleared ${existingNotifications} existing notifications.`);
    }
    const insertedNotifs = await Notification.insertMany(notifications);
    console.log(`\n🔔 Seeded ${insertedNotifs.length} notifications:`);
    insertedNotifs.forEach(n => console.log(`   [${n.type}] ${n.subject}`));

    await mongoose.disconnect();
    console.log('\n✅ Done. Database connection closed.');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
