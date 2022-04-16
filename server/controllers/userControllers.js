
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
// @desc    Register user
// @route   POST /users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, password2 } = req.body;
        //Simple Validation Checks
        if (!firstName || !lastName || !email || !password || !password2) {
            return res.status(400).json({ msg: "Please fill in all fields." });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ msg: "Password must be at least 6 characters." });
        }
        if (password !== password2) {
            return res.status(400).json({ msg: "Passwords do not match." });
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({ msg: "An account with this email already exists." });
        }
        //encrypt password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        //Create new user
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordHash,
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// @desc    Login user
// @route   POST /users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validation
        if (!email || !password) {
            return res.status(400).json({ msg: "Please fill in all fields." });
        }
        //find user in database
        const user = await User.findOne({ email: email });
        if (!user) {
            return res
                .status(400)
                .json({ msg: "No account with this email has been registered." });
        }
        console.log('user', user)
        console.log('user.password', user.password)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect Password" });
        }
        //JSON webtoken
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
            },
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
// @desc    Delete user
// @route   DELETE /users/delete
// @access  Private
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        if (!deletedUser) {
            res.status(400).json({ msg: "No user exist or already deleted" });
        }
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// @desc    Edit user
// @route   POST /users/edit
// @access  Private
const editUserDetails = async (req, res) => {
    try {
        let { firstName, lastName, prevEmail, email, bio, skills } = req.body;
        console.log('profile edit ----------', req.body)
        //User ID
        const id = (await User.findOne({ email: prevEmail }))._id;
        //Email Validation
        if (email === undefined || email === "undefined" || prevEmail === email) {
            email = prevEmail;
        } else {
            const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if (!regex.test(email)) {
                return res.status(400).json({ msg: "Please enter a valid email." });
            }
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ msg: "An account with this email already exists." });
            }
        }
        //Bio Validation
        if (bio) {
            if (bio.length > 2000) {
                return res
                    .status(400)
                    .json({ msg: "Bio cannot exceed 2000 characters." });
            }
            await User.findByIdAndUpdate(id, { $set: { bio: bio } });
        }
        //All Updates after validation
        await User.findByIdAndUpdate(id, { $set: { email: email } });
        if (skills !== undefined) {
            await User.findByIdAndUpdate(id, { $set: { skills: skills } });
        }
        if (firstName !== undefined) {
            await User.findByIdAndUpdate(id, { $set: { firstName: firstName } });
        }
        if (lastName !== undefined) {
            await User.findByIdAndUpdate(id, { $set: { lastName: lastName } });
        }
        if (req.file !== undefined) {
            await User.findByIdAndUpdate(id, { $set: { image: req.file.buffer } });
            const user = await User.findById(id);
        }
        const updatedUser = await User.findById(id);
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// @desc    Token validation
// @route   POST /users/isTokenValid
// @access  Private
const isTokenValid = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.json(false);
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.json(false);
        }
        const user = await User.findById(verified.id);
        if (!user) {
            return res.json(false);
        }
        return res.json(true);
    } catch (err) {
        res.json(false);
    }
};
// @desc    Get User
// @route   GET /users
// @access  Private
const getUser = async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
        return res.status(500).json({ error: err.message });
    }
    res.json(user);
};
// @desc    Get all tutors
// @route   GET /users/tutors
// @access  Private
const getAllTutors = async (req, res) => {
    try {
        const tutors = await User.find({ tutor: true });
        res.json(tutors);
    } catch (err) {
        return res.json(false);
    }
};
// @desc    Check user with ID
// @route   GET /users/:id
// @access  Public
const getUserByID = async (req, res) => {
    try {
        const user = await User.findById(req.params.userid);
        if (!user) {
            return res.json(false);
        }
        res.json(user);
    } catch (err) {
        return res.json(false);
    }
};
// @desc    Feedback
// @route   GET /users/feedback
// @access  Public
const feedback = async (req, res) => {
    try {
        const { tutorId, data } = req.body;
        const feedback = new Feedback({
            tutorId: tutorId,
            data: data
        });
        await feedback.save();
        res.status(200).json(feedback);
    } catch (err) {
        return res.status(400).json(err)
    }
};
module.exports = {
    registerUser, loginUser, deleteUser, editUserDetails, isTokenValid, getUser, getAllTutors, getUserByID, feedback
}
