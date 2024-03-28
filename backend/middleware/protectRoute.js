const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) throw new Error("No Token found");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) throw new Error("Unauthorized - Invalid token");

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) throw new Error("No User found");

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = protectRoute;
