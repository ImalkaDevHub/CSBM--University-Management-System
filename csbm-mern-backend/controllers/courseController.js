const Course = require('../models/Course');

const courseController = {
    // POST /api/courses
    addCourse: async (req, res) => {
        try {
            const course = new Course(req.body);
            const savedCourse = await course.save();
            res.status(201).json(savedCourse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to add course', details: error.message });
        }
    },

    // GET /api/courses
    listCourses: async (req, res) => {
        try {
            const courses = await Course.find();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
        }
    },

    // PUT /api/courses/:id
    updateCourse: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedCourse = await Course.findByIdAndUpdate(
                id,
                req.body,
                { new: true } // Return the updated document
            );

            if (!updatedCourse) {
                return res.status(404).json({ error: 'Course not found' });
            }

            res.status(200).json(updatedCourse);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update course', details: error.message });
        }
    },

    // POST /api/courses/check-eligibility
    // Added: Automated Eligibility Checker Algorithm
    checkEligibility: async (req, res) => {
        try {
            // 1. Get the data the student selected in React
            const { courseId, stream, passes } = req.body;

            // Basic validation to ensure the frontend sent all required data
            if (!courseId || !stream || !passes) {
                return res.status(400).json({ error: 'Missing required fields: courseId, stream, or passes' });
            }

            // 2. Find the selected course in the database
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            // 3. The Algorithm: Assume eligible until proven otherwise
            let isEligible = true;
            let reason = "Congratulations! You meet the academic requirements for this program.";

            // Rule A: Check the Stream
            if (course.eligibility.requiredStream !== 'Any' && course.eligibility.requiredStream !== stream) {
                isEligible = false;
                reason = `Not Eligible: This program strictly requires the ${course.eligibility.requiredStream} stream.`;
            }
            // Rule B: Check the Number of Passes
            else if (parseInt(passes) < course.eligibility.minimumPasses) {
                isEligible = false;
                reason = `Not Eligible: You need a minimum of ${course.eligibility.minimumPasses} A/L passes. You have ${passes}.`;
            }

            // 4. Send the final verdict back to the frontend
            res.status(200).json({
                eligible: isEligible,
                reason: reason,
                courseFee: course.courseFee
            });

        } catch (error) {
            res.status(500).json({ error: 'Server error while checking eligibility', details: error.message });
        }
    }
};

module.exports = courseController;