const User = require('../models/User');

const userController = {
    // POST /api/users/register
    registerUser: async (req, res) => {
        try {
            const { email } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already in use' });
            }

            // Create new user (Role defaults to STUDENT)
            const newUser = new User(req.body);
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        } catch (error) {
            res.status(500).json({ error: 'Registration failed', details: error.message });
        }
    },

    // GET /api/users/all
    listUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch users', details: error.message });
        }
    },
    
    // GET /api/users/staff
    getStaff: async (req, res) => {
        try {
            const staffRoles = ['super_admin', 'registration_staff', 'marketing_coordinator', 'finance_staff'];
            const staff = await User.find({ role: { $in: staffRoles } }).select('-password');
            res.status(200).json(staff);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch staff', details: error.message });
        }
    },

    // POST /api/users/staff
    createStaff: async (req, res) => {
        try {
            const { fullName, email, password, role } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already in use' });
            }

            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                fullName,
                email,
                password: hashedPassword,
                role
            });
            await newUser.save();
            res.status(201).json({ message: 'Staff user created successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create staff', details: error.message });
        }
    },

    // DELETE /api/users/staff/:id
    deleteStaff: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Staff user deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete staff', details: error.message });
        }
    }
};

module.exports = userController;
