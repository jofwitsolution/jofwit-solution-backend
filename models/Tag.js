const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    shorthand: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
