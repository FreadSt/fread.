const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: String,
    senderEmail: String,
    senderRole: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    message: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      default: 'general',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

messageSchema.index({ room: 1 });
messageSchema.index({ isRead: 1 });


module.exports = mongoose.model('Message', messageSchema);
