const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { googleLogin, facebooklogin } = require('../controllers/authController')
router.post("/googlelogin", googleLogin);

router.post("/facebooklogin", facebooklogin);

module.exports = router;
