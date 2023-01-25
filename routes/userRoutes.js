const { registerUser } = require('../controllers/userController');
const express = require('express');
const router = express.Router();

/* Register */
router.post('/', registerUser);

module.exports = router;
