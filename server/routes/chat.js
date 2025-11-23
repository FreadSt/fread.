const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ userId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/mark-as-read/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { senderRole } = req.body;

    const roleToMark = senderRole === "user" ? "admin" : "user";

    const result = await Message.updateMany(
      {
        userId,
        isRead: false,
        senderRole: roleToMark
      },
      {
        $set: { isRead: true, readAt: new Date() }
      }
    );

    res.status(200).json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/admin/tickets', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 });

    const ticketsMap = new Map();

    messages.forEach((msg) => {
      const userIdStr = msg.userId.toString();

      if (!ticketsMap.has(userIdStr)) {
        ticketsMap.set(userIdStr, {
          userId: userIdStr,
          userName: msg.senderName,
          userEmail: msg.senderEmail,
          messages: [],
          lastMessage: '',
          lastMessageTime: new Date(0),
          unreadCount: 0,
        });
      }

      const ticket = ticketsMap.get(userIdStr);
      ticket.messages.push(msg);

      if (new Date(msg.timestamp) > ticket.lastMessageTime) {
        ticket.lastMessage = msg.message;
        ticket.lastMessageTime = new Date(msg.timestamp);
      }

      if (msg.senderRole === 'user' && !msg.isRead) {
        ticket.unreadCount++;
      }
    });

    const tickets = Array.from(ticketsMap.values()).sort(
      (a, b) =>
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
    );

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: error.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const {
      senderId,
      senderName,
      senderEmail,
      senderRole,
      message,
      userId,
    } = req.body;

    const newMessage = new Message({
      senderId,
      senderName,
      senderEmail,
      senderRole: senderRole || 'user',
      message,
      userId,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
