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
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
        }
    },

    // GET /api/courses/:id -> get single course (public)
    getCourseById: async (req, res) => {
        try {
            const course = await Course.findById(req.params.id);
            if (!course) return res.status(404).json({ error: 'Course not found' });
            res.status(200).json(course);
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
    // POST /api/courses/:id/check-eligibility
    // accepts { answers: [boolean] }
    checkEligibility: async (req, res) => {
        try {
            const { answers } = req.body;
            const course = await Course.findById(req.params.id);
            
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            // Simple logic: if any answer is false, they might not be eligible.
            let isEligible = true;
            if (answers && Array.isArray(answers)) {
                isEligible = answers.every(ans => ans === true);
            }

            if (isEligible) {
                res.status(200).json({
                    eligible: true,
                    message: "You are Eligible! You can enroll in this course."
                });
            } else {
                res.status(200).json({
                    eligible: false,
                    message: "You may not qualify. Review the requirements."
                });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error while checking eligibility', details: error.message });
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