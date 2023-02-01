const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const {
  validateUserLogin,
  validateUserSignup,
} = require('../validations/userValidation');

// @desc Signup user with name, email and password
// @route Post /api/auth/signup
// @Access Public
const signupUser = async (req, res, next) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    // Validation
    const { error } = validateUserSignup({
      firstName,
      lastName,
      email,
      password,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    email = email.toLowerCase();
    // check if a user with the same email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exist' });
    }

    const username = lastName.concat(Date.now());

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const user = new User({
      email,
      username,
      password: hashedPassword,
      profile: {
        firstName,
        lastName,
      },
    });

    await user.save();

    // generate a JSON Web Token
    const token = generateToken(
      user._id,
      user.firstName,
      user.lastName,
      user.role
    );

    res
      .cookie('token', token, {
        // expires: new Date(Date.now() + 900000), // expires after 900000milliseconds=15mins
        httpOnly: true,
        sameSite: true,
        secure: true,
      })
      .json({
        token: token,
      });
  } catch (error) {
    next(error);
  }
};

// @desc Login user with email and password
// @route Post /api/auth/login
// @Access Public
const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    // Validation
    const { error } = validateUserLogin({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    email = email.toLowerCase();
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // check if the password is correct
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).send({ message: 'Invalid email or password' });
    }

    // generate a JSON Web Token
    const token = generateToken(
      user._id,
      user.firstName,
      user.lastName,
      user.role
    );

    res
      .cookie('token', token, {
        // expires: new Date(Date.now() + 900000), // expires after 900000milliseconds=15mins
        httpOnly: true,
        sameSite: true,
        secure: true,
      })
      .json({
        token: token,
      });
  } catch (error) {
    next(error);
  }
};

// @desc Signup/Login user with google
// @route Get /api/auth/callback
// @Access Public
const googleAuthentication = (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(
      user._id,
      user.firstName,
      user.lastName,
      user.role
    );

    // expires: new Date(Date.now() + 900000), // expires after 900000milliseconds=15mins
    // secure: true,
    // httpOnly: true,
    const cookieOptions = {
      sameSite: 'None',
      secure: true,
    };

    res.cookie('token', token, {
      sameSite: 'Lax',
      secure: true,
      domain: 'https://jofwitsolution.vercel.app/',
    });
    res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    next(error);
  }
};

module.exports.signupUser = signupUser;
module.exports.loginUser = loginUser;
module.exports.googleAuthentication = googleAuthentication;
