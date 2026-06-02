const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access Denied"
            });
        }

        // Support both raw tokens and Bearer tokens
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;