const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Require the secret key. If not in env, we use a fallback for development.
const JWT_SECRET = process.env.JWT_SECRET || 'csbm_super_secret_key_12345';

const authMiddleware = {
    // 1. Verify if user is logged in (has valid token)
    verifyToken: async (req, res, next) => {
        // Get token from header (usually format: "Bearer <token>")
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: "error", message: "Access Denied. No token provided." });
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verify and decode the payload
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log('=== AUTH DEBUG ===');
            console.log('Decoded Token:', decoded);

            // Try all possible ID field locations
            const userId = 
                decoded._id || 
                decoded.id || 
                decoded.userId ||
                (decoded.user && decoded.user.id);

            if (!userId) {
                console.error('ERROR: No User ID in token');
                return res.status(401).json({ status: "error", message: "Invalid token structure." });
            }

            // Fetch full user from DB
            const user = await User.findById(userId).select('-password');
            if (!user) {
                console.error('ERROR: User not found in DB:', userId);
                return res.status(401).json({ status: "error", message: "User no longer exists." });
            }

            // Attach user to req
            req.user = user;
            // Explicitly set _id for compatibility
            req.user._id = user._id;

            console.log('User authenticated:', req.user._id);
            next();
        } catch (error) {
            console.error('Auth verify error:', error.message);
            return res.status(401).json({ status: "error", message: "Invalid or expired token." });
        }
    },

    // 2. Verify if logged in user is specifically an ADMIN
    requireAdmin: (req, res, next) => {
        // This middleware should run AFTER verifyToken, so req.user should exist
        if (!req.user) {
            return res.status(401).json({ status: "error", message: "Authentication required." });
        }

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ status: "error", message: "Forbidden. Admin access required." });
        }

        // Action permitted, move to the next handler
        next();
    }
};

module.exports = authMiddleware;
