const User = require("../models/user.model");

module.exports.getUsers = async (req, res) => {
    try {
        const loggedInUserID = req.user._id;

        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserID },
        }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
