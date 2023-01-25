const { User } = require('../models/User');

// @desc Register new user
// @route Post /api/users
// @Access Public
const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation

    let user = await User.findOne({ email: email });
    if (user) {
      res.status(400).json({ message: 'User already exist' });
    }

    const username = lastName.concat(Date.now());

    user = new User({
      firstName,
      lastName,
      email,
      username,
      password,
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.registerUser = registerUser;
