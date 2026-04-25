const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ status: "error", message: "Authentication required." });
        }

        // super_admin bypasses ALL checks automatically
        if (req.user.role === 'super_admin') {
            return next();
        }

        // Check if user's role is in the allowed roles list
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ status: "error", message: "Access denied" });
        }

        next();
    };
};

module.exports = authorize;
