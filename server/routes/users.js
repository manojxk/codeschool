const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  registerUser, loginUser, deleteUser, editUserDetails, isTokenValid, getUser, getAllTutors, getUserByID, feedback
} = require('../controllers/userControllers')

router.post("/register", registerUser);

router.post("/login", loginUser);

router.delete("/delete", auth, deleteUser);

router.post("/edit", auth, upload.single("image"), editUserDetails);

router.post("/isTokenValid", isTokenValid);

router.get("/", auth, getUser);

router.get("/tutors", auth, getAllTutors);

router.get("/:userid", getUserByID);

router.post("/feedback", feedback);

module.exports = router;
