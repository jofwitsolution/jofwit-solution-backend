const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxLength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
      maxlength: 255,
    },
    googleId: {
      type: String,
      required: false,
      unique: false,
    },
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    profile: {
      firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
      },
      lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
      },
      phone: {
        type: String,
        default: '',
      },
      address: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: '',
      },
      imageUrl: {
        type: String,
        default: '',
      },
    },
    role: { type: String, required: true, default: 'user' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports.User = User;
