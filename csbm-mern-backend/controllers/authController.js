const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'csbm_super_secret_key_12345';

const authController = {
    // POST /api/auth/login
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log(`[AUTH] Login attempt for: ${email}`);

            const user = await User.findOne({ email });
            
            if (!user) {
                console.log(`[AUTH] User not found: ${email}`);
                return res.status(401).json({ status: "error", message: "Invalid credentials" });
            }

            console.log('--- DB USER DEBUG ---');
            console.log('Email from DB:', user.email);
            console.log('Pass from DB:', user.password);
            console.log('---------------------');

            console.log('--- EXTREME LOGIN DEBUG ---');
            console.log(`Input Email:  >${email}<`);
            console.log(`DB Email:     >${user.email}<`);
            console.log(`Input Pass:   >${password}<`);
            console.log(`DB Pass:      >${user.password}<`);
            
            // Check if password matches
            let isMatch = false;
            try {
                isMatch = await bcrypt.compare(password, user.password);
                console.log(`Bcrypt Match Result: ${isMatch}`);
            } catch (e) {
                console.log('Bcrypt Error:', e.message);
                isMatch = false;
            }

            if (!isMatch && user.password === password) {
                isMatch = true;
                console.log('--- SUCCESS: Logged in with legacy plain text match ---');
            }

            if (!isMatch) {
                console.log(`[AUTH] Password mismatch for: ${email}`);
                return res.status(401).json({ status: "error", message: "Invalid credentials" });
            }

            // Sign JWT
            const token = jwt.sign(
                { id: user._id, role: user.role || 'STUDENT' },
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
            const { email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    status: "error",
                    message: "Email is already in use"
                });
            }

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({ 
                ...req.body, 
                password: hashedPassword,
                role: 'STUDENT' 
            });
            const savedUser = await user.save();

            res.status(200).json({
                status: "success",
                message: "User registered successfully",
                userId: savedUser._id || savedUser.id,
                role: savedUser.role
            });
        } catch (error) {
            console.error('Register Error:', error);
            
            // Handle Mongoose Validation Errors (Required fields, etc)
            if (error.name === 'ValidationError') {
                return res.status(400).json({ 
                    status: "error", 
                    message: Object.values(error.errors).map(e => e.message).join(', ')
                });
            }

            res.status(500).json({ 
                status: "error", 
                message: "Registration failed", 
                details: error.message 
            });
        }
    },
    // TEMP: Debug route to see all users (DELETE BEFORE PRODUCTION)
    debugUsers: async (req, res) => {
        try {
            const users = await User.find({}, 'email fullName role password');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = authController;
