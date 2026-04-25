const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'csbm_super_secret_key_12345';

const authController = {
    // POST /api/auth/login
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (user) {
                // Check if password matches (either plain text or hashed)
                const isMatch = user.password === password || await bcrypt.compare(password, user.password).catch(() => false);
                
                if (isMatch) {
                    // Sign JWT Template
                    const token = jwt.sign(
                        { id: user._id, role: user.role || 'STUDENT' },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    return res.status(200).json({
                        status: "success",
                        token: token,
                        user: {
                            id: user._id,
                            name: user.fullName,
                            email: user.email,
                            role: user.role || 'STUDENT'
                        }
                    });
                }
            }

            res.status(401).json({ status: "error", message: "Invalid credentials" });
        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ status: "error", message: "Login failed", details: error.message });
        }
    },

    // POST /api/auth/google
    googleLogin: async (req, res) => {
        try {
            const { email, name, photoURL, uid } = req.body;

            // Find or create user
            let user = await User.findOne({ email });

            if (!user) {
                // Create new user if they don't exist
                user = new User({
                    email,
                    fullName: name,
                    role: 'STUDENT',
                    firebaseUid: uid, // storing uid as firebaseUid
                    avatar: photoURL,
                    mobileNumber: '',
                    // For social logins, password can be a random string or empty if model allows
                    password: `google_${uid.substring(0, 8)}` 
                });
                await user.save();
            }

            // Sign JWT
            const token = jwt.sign(
                { id: user._id, role: user.role || 'STUDENT', email: user.email },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(200).json({
                status: "success",
                token: token,
                user: {
                    id: user._id,
                    name: user.fullName,
                    email: user.email,
                    role: user.role || 'STUDENT'
                }
            });
        } catch (error) {
            console.error('Backend Google Login Error:', error);
            res.status(500).json({ status: "error", message: "Google verification failed", details: error.message });
        }
    },

    // GET /api/auth/create-admin
    createAdminUser: async (req, res) => {
        try {
            const existingAdmin = await User.findOne({ email: "admin@csbm.lk" });

            if (existingAdmin) {
                return res.status(200).json({
                    status: "exists",
                    message: "Admin user already exists"
                });
            }

            const admin = new User({
                email: "admin@csbm.lk",
                password: "admin123", // Reminder: In production encrypt this
                fullName: "System Administrator",
                role: "ADMIN"
            });

            await admin.save();

            res.status(200).json({
                status: "created",
                message: "Admin user created successfully",
                email: "admin@csbm.lk"
            });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Failed to create admin", details: error.message });
        }
    },

    // POST /api/auth/register
    registerUser: async (req, res) => {
        try {
            const { email } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    status: "error",
                    message: "Email is already in use"
                });
            }

            const user = new User({ ...req.body, role: 'STUDENT' });
            const savedUser = await user.save();

            res.status(200).json({
                status: "success",
                message: "User registered successfully",
                userId: savedUser._id || savedUser.id,
                role: savedUser.role
            });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Registration failed", details: error.message });
        }
    }
};

module.exports = authController;
