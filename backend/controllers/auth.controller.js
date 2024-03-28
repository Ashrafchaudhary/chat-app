const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const generateTokenAndSetCookie = require("../utils/generateToken");

module.exports.signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } =
            req.body;

        if (password !== confirmPassword)
            throw new Error("Password do not match");

        const user = await User.findOne({ username });

        if (user) throw new Error("Username already in use");

        const hashedPassword = bcrypt.hashSync(password, 12);

        const boyProfilePic = `https://avatar.iran.liars.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liars.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) throw new Error("Invalid credentials");

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) throw new Error("Invalid credentials");

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

module.exports.logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
