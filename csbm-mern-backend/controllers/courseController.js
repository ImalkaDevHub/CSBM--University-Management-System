const Course = require('../models/Course');

const courseController = {
    // 1. CRUD endpoints

    // POST /api/courses -> create course (ADMIN only)
    addCourse: async (req, res) => {
        try {
            const course = new Course(req.body);
            const savedCourse = await course.save();
            res.status(201).json(savedCourse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to add course', details: error.message });
        }
    },

    // GET /api/courses -> get all courses (public)
    listCourses: async (req, res) => {
        try {
            const courses = await Course.find();
            const mapped = courses.map(c => {
                const doc = c.toJSON ? c.toJSON() : (c.toObject ? c.toObject() : c);
                return {
                    ...doc,
                    id: doc._id || doc.id,
                    name: doc.name || doc.title,
                    title: doc.title || doc.name,
                    courseFee: doc.courseFee ?? doc.fees ?? doc.price,
                    fees: doc.fees ?? doc.courseFee ?? doc.price,
                    streamReq: doc.streamReq || doc.eligibility?.requiredStream || 'Any',
                    minALPasses: doc.minALPasses != null ? doc.minALPasses : (doc.eligibility?.minimumPasses ?? 2),
                    intakeDate: doc.intakeDate || doc.nextIntakeDate,
                    intakeStatus: doc.intakeStatus || 'OPEN'
                };
            });
            res.status(200).json(mapped);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
        }
    },

    // GET /api/courses/:id -> get single course (public)
    getCourseById: async (req, res) => {
        try {
            const course = await Course.findById(req.params.id);
            if (!course) return res.status(404).json({ error: 'Course not found' });
            const doc = course.toJSON ? course.toJSON() : (course.toObject ? course.toObject() : course);
            const mapped = {
                ...doc,
                id: doc._id || doc.id,
                name: doc.name || doc.title,
                title: doc.title || doc.name,
                courseFee: doc.courseFee ?? doc.fees ?? doc.price,
                fees: doc.fees ?? doc.courseFee ?? doc.price,
                streamReq: doc.streamReq || doc.eligibility?.requiredStream || 'Any',
                minALPasses: doc.minALPasses != null ? doc.minALPasses : (doc.eligibility?.minimumPasses ?? 2),
                intakeDate: doc.intakeDate || doc.nextIntakeDate,
                intakeStatus: doc.intakeStatus || 'OPEN'
            };
            res.status(200).json(mapped);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch course', details: error.message });
        }
    },

    // PUT /api/courses/:id -> update course (ADMIN only)
    updateCourse: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedCourse = await Course.findByIdAndUpdate(
                id,
                req.body,
                { new: true }
            );

            if (!updatedCourse) {
                return res.status(404).json({ error: 'Course not found' });
            }

            res.status(200).json(updatedCourse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update course', details: error.message });
        }
    },

    // DELETE /api/courses/:id -> delete course (ADMIN only)
    deleteCourse: async (req, res) => {
        try {
            const deletedCourse = await Course.findByIdAndDelete(req.params.id);
            if (!deletedCourse) return res.status(404).json({ error: 'Course not found' });
            res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete course', details: error.message });
        }
    },

    // 2. INTAKE MANAGEMENT
    // PUT /api/courses/:id/intake -> update intakeStatus + nextIntakeDate (ADMIN only)
    updateIntake: async (req, res) => {
        try {
            const { intakeStatus, nextIntakeDate } = req.body;
            const updatedCourse = await Course.findByIdAndUpdate(
                req.params.id,
                { intakeStatus, nextIntakeDate },
                { new: true }
            );

            if (!updatedCourse) return res.status(404).json({ error: 'Course not found' });
            res.status(200).json(updatedCourse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update intake details', details: error.message });
        }
    },

    // 3. VERSION CONTROL
    // PUT /api/courses/:id/curriculum -> update modules[] and curriculum (ADMIN only)
    updateCurriculum: async (req, res) => {
        try {
            const { modules, description } = req.body;
            const course = await Course.findById(req.params.id);
            
            if (!course) return res.status(404).json({ error: 'Course not found' });

            // Record changes in history
            const changes = {};
            if (modules) changes.modules = modules;
            if (description) changes.description = description;

            course.history.push({
                updatedAt: new Date(),
                changes
            });

            if (modules) course.modules = modules;
            if (description) course.description = description;

            const updatedCourse = await course.save();
            res.status(200).json(updatedCourse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update curriculum', details: error.message });
        }
    },

    // GET /api/courses/:id/history -> get update history with timestamps
    getCourseHistory: async (req, res) => {
        try {
            const course = await Course.findById(req.params.id);
            if (!course) return res.status(404).json({ error: 'Course not found' });
            res.status(200).json(course.history || []);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch history', details: error.message });
        }
    },

    // 4. ELIGIBILITY CHECK
    // POST /api/courses/check-eligibility
    // accepts { courseId, stream, passes } OR { courseId, edLevel, results, age }
    checkEligibility: async (req, res) => {
        try {
            const { courseId, stream, passes, edLevel, results, age } = req.body;
            const course = await Course.findById(courseId);
            
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            const courseName = course.name || course.title;
            const fee = course.courseFee ?? course.fees ?? course.price ?? 0;

            // Scenario A: Automated Stream & Passes check (Course Catalog UI)
            if (stream !== undefined || passes !== undefined) {
                const numPasses = parseInt(passes) || 0;
                const reqPasses = course.eligibility?.minimumPasses ?? course.minALPasses ?? 2;
                const reqStream = course.eligibility?.requiredStream || course.streamReq || 'Any';

                const streamMatch = reqStream === 'Any' || !stream || stream.toLowerCase() === reqStream.toLowerCase();
                const passesMatch = numPasses >= reqPasses;

                if (streamMatch && passesMatch) {
                    return res.status(200).json({
                        eligible: true,
                        reason: `Congratulations! You meet the entry requirements for ${courseName} (${reqPasses} passes in ${reqStream} stream).`,
                        message: `Congratulations! You meet the entry requirements for ${courseName}.`,
                        courseFee: fee,
                        courseDetails: {
                            fees: fee,
                            duration: course.duration || '3 Years',
                            code: course.code
                        }
                    });
                } else {
                    let reason = 'Requirements not met. ';
                    if (!passesMatch) reason += `Requires at least ${reqPasses} passes (you have ${numPasses}). `;
                    if (!streamMatch) reason += `Requires ${reqStream} stream (you selected ${stream}).`;

                    return res.status(200).json({
                        eligible: false,
                        reason: reason.trim(),
                        message: reason.trim(),
                        courseFee: fee,
                        courseDetails: {
                            fees: fee,
                            duration: course.duration || '3 Years',
                            code: course.code
                        }
                    });
                }
            }

            // Scenario B: edLevel, results, age check
            const studentGPA = parseFloat(results);
            const studentAge = parseInt(age);
            
            const levelWeights = { 'O/L': 1, 'A/L': 2, 'Diploma': 3, 'Degree': 4, 'Master': 5 };
            const studentLevelWeight = levelWeights[edLevel] || 0;
            const requiredLevelWeight = levelWeights[course.requiredEducationLevel] || 2; // Default A/L

            let isEligible = true;
            let failureReason = '';

            // Check Age
            if (studentAge && studentAge < course.minAge) {
                isEligible = false;
                failureReason = `Minimum age required is ${course.minAge}.`;
            }

            // Check Education Level
            if (edLevel && studentLevelWeight < requiredLevelWeight) {
                isEligible = false;
                failureReason = `Minimum education level required is ${course.requiredEducationLevel}.`;
            }

            // Check GPA (if numeric)
            if (!isNaN(studentGPA) && studentGPA < course.minGPA) {
                isEligible = false;
                failureReason = `Minimum GPA/Result score required is ${course.minGPA}.`;
            }

            const finalMsg = isEligible
                ? `You meet all the entry requirements for ${courseName}!`
                : `Based on your profile, you do not meet the minimum requirements. ${failureReason}`;

            res.status(200).json({
                eligible: isEligible,
                reason: finalMsg,
                message: finalMsg,
                courseFee: fee,
                courseDetails: {
                    fees: fee,
                    duration: course.duration || '3 Years',
                    code: course.code
                }
            });
        } catch (error) {
            console.error('Eligibility Error:', error);
            res.status(500).json({ error: 'Server error while checking eligibility' });
        }
    },

    // 5. ENROLL
    // POST /api/courses/:id/enroll
    enrollCourse: async (req, res) => {
        try {
            const course = await Course.findById(req.params.id);
            if (!course) return res.status(404).json({ error: 'Course not found' });

            // Create a mock enrollment ID for now (in reality, save to Enrollment model)
            const enrollmentId = 'ENR' + Math.floor(Math.random() * 1000000);

            res.status(200).json({
                success: true,
                enrollmentId
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to enroll', details: error.message });
        }
    }
};

module.exports = courseController;