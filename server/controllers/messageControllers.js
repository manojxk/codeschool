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
const { all } = require("../routes/users");
//New Connection
const newConnection = async function (req, res) {
    try {
        const student = await User.findById(req.body.currentUserId);
        const tutor = await User.findById(req.body.tutorId);
        const newConversation = new Conversation({
            messages: [],
            users: [student, tutor],
        });
        const conversation = await newConversation.save();
        const connectionModel = await new Connection({
            userId: req.body.tutorId,
            conversation: conversation,
        });
        const connection = await connectionModel.save();
        const tutorConnectionModel = await new Connection({
            userId: req.body.currentUserId,
            conversation: conversation,
        });
        const tutorConnection = await tutorConnectionModel.save();
        student.connections = [...student.connections, connection._id];
        tutor.connections = [...tutor.connections, tutorConnection._id];
        await tutor.save();
        await student.save();
        res.status(200).json(conversation._id);
    } catch (err) {
        res.status(400).json(err);
    }
};
//Find Connection
const findConnection = async function (req, res, next) {
    try {
        const connection = await Connection.findById(req.query.connectionid);
        res.status(200).json(connection);
    } catch (err) {
        res.status(400).json(err);
    }
};
//Find Existing Conversation
const findExisting = async function (req, res, next) {
    try {
        const userID = req.body.userID;
        const tutorID = req.body.tutorID;
        const existingConv = await Conversation.findOne({
            $or: [{ users: [userID, tutorID] }, { users: [tutorID, userID] }],
        });
        if (existingConv === null) {
            return res.json(false);
        }
        if (existingConv) {
            res.json(existingConv._id);
        }
    } catch (err) {
        res.json(false);
    }
};
//Load All Connections for One User
const loadAllConnections = async function (req, res, next) {
    try {
        const user = await User.findById(req.body.userID);
        let connections = [];
        if (user.connections.length === 0) {
            return res.json(false);
        }
        for (let i = 0; i < user.connections.length; i++) {
            const connection = await Connection.findById(user.connections[i]);
            const otherUser = await User.findById(connection.userId);
            const existingConv = await Conversation.findById(connection.conversation);
            const conversationLength = existingConv.messages.length;
            var lastMessage;
            if (conversationLength > 0) {
                lastMessage = await Message.findById(
                    existingConv.messages[conversationLength - 1]
                );
            } else {
                lastMessage = "";
            }
            connections.push({
                first: otherUser.firstName,
                last: otherUser.lastName,
                image: otherUser.image,
                conversation: connection.conversation,
                lastMessage: lastMessage,
            });
            if (i === user.connections.length - 1) {
                return res.json(connections);
            }
        }
    } catch (err) {
        res.json(false);
    }
};
//Get All Messages for one Conversation
const getAllMessages = async function (req, res, next) {
    try {
        const conversation = await Conversation.findById(req.params.id);
        const allMessages = [];
        if (!conversation.messages.length) {
            res.json([]);
        }
        for (let i = 0; i < conversation.messages.length; i++) {
            const message = await Message.findById(conversation.messages[i]);
            allMessages.push(message);
            if (i === conversation.messages.length - 1) {
                res.json(allMessages);
            }
        }
    } catch (err) {
        res.status(400).json(err);
    }
};
//Send Message
const sendMessage = async function (req, res, next) {
    try {
        //Create and Save Message
        const message = await new Message(req.body);
        await message.save();
        //Add Message to Conversation
        const conversation = await Conversation.findById(req.params.id);
        conversation.messages = [...conversation.messages, message._id];
        await conversation.save();
        res.status(200).json(conversation);
    } catch (err) {
        res.status(400).json(err);
    }
};
module.exports = {
    newConnection, findConnection, findExisting, loadAllConnections, getAllMessages, sendMessage
};
