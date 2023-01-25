const { createPost } = require('../controllers/postController');
const express = require('express');
const router = express.Router();

/* Create */
router.post('/', createPost);

module.exports = router;
