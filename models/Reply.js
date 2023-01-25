const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
