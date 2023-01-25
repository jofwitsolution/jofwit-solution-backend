const jwt = require('jsonwebtoken');
const { passport } = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),

  function (req, res) {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);

    res.cookie('token', token, {
      expires: new Date(Date.now() + 900000), // expires after 900000milliseconds=15mins
      httpOnly: true,
      sameSite: true,
      secure: true,
    });
    res.redirect(process.env.CLIENT_URL);
  }
);

module.exports = router;
