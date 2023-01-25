const { Post } = require('../models/Post');

// @desc Create new Post
// @route Post /api/posts
// @Access Private/Admin
const createPost = async (req, res, next) => {
  try {
    const { userId, title, content, categories } = req.body;

    // Validation

    const post = new Post({
      userId: userId,
      title: title,
      content: content,
      categories: categories,
      likes: {},
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports.createPost = createPost;
