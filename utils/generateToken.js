const jwt = require('jsonwebtoken');

const generateToken = (id, firstName, lastName, role) => {
  return jwt.sign({ id, firstName, lastName, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports.generateToken = generateToken;
