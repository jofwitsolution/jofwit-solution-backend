const jwt = require('jsonwebtoken');
const passport = require('../passport/passport');
const {
  googleAuthentication,
  signupUser,
  loginUser,
} = require('../controllers/authController');
const express = require('express');
const router = express.Router();

// email and password authentication
router.post('/signup', signupUser);
router.post('/login', loginUser);

// google authentication
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// google authentication
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleAuthentication
);

module.exports = router;
