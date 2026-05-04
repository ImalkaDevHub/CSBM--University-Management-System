const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ status: "error", message: "Authentication required." });
        }

        const userRole = (req.user.role || '').toLowerCase();
        
        // super_admin bypasses ALL checks automatically
        if (userRole === 'super_admin' || userRole === 'admin') {
            return next();
        }

        const allowedRoles = roles.map(r => r.toLowerCase());

        // Check if user's role is in the allowed roles list
        if (allowedRoles.length && !allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                status: "error", 
                message: "Access denied. Insufficient permissions." 
            });
        }

        next();
    };
};

module.exports = authorize;
