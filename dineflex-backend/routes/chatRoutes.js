const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chatController");

router.post("/message", chatController.chatMessage);

module.exports = router;