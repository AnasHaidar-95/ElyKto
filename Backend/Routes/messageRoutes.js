const express = require("express");
const router = express.Router();
const {sendMessage,getMessages} = require("../Controllers/messageController");

router.post("/send", sendMessage);
router.get("/", getMessages);

module.exports = router;
