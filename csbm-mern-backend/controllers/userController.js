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
    }
};

module.exports = userController;
