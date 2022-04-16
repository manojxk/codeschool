const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
//Model Imports
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Connection = require("../models/Connection");
const { all } = require("./users");
const { newConnection, findConnection, findExisting, loadAllConnections, getAllMessages, sendMessage } = require('../controllers/messageControllers')
//New Connection
router.post("/newConnection", newConnection);
//Find Connection
router.get("/", findConnection);
//Find Existing Conversation
router.post("/findExisting", findExisting);
//Load All Connections for One User
router.post("/loadAllConnections", loadAllConnections);
//Get All Messages for one Conversation
router.get("/:id", getAllMessages);
//Send Message
router.post("/:id", sendMessage);
module.exports = router;
