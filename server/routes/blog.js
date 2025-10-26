const express = require('express');
const BlogPost = require('../models/BlogPost');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all blog posts (public)
router.get('/', async (req, res) => {
  try {
    const { status, category, limit = 10, page = 1 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const posts = await BlogPost.find(filter)
      .populate('authorId', 'username email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await BlogPost.countDocuments(filter);

    res.json({
      posts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog post
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('authorId', 'username email');

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog post
router.post('/', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all') && 
        !req.user.permissions.includes('blog:create')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      title,
      content,
      excerpt,
      category,
      tags,
      image,
      status = 'draft'
    } = req.body;

    const post = new BlogPost({
      title,
      content,
      excerpt,
      author: req.user.username,
      authorId: req.user.userId,
      category,
      tags: tags || [],
      image,
      status
    });

    await post.save();
    await post.populate('authorId', 'username email');

    res.status(201).json({
      message: 'Blog post created successfully',
      post
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog post
router.put('/:id', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all') && 
        !req.user.permissions.includes('blog:edit')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Update fields
    const updateFields = [
      'title', 'content', 'excerpt', 'category', 
      'tags', 'image', 'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field];
      }
    });

    await post.save();
    await post.populate('authorId', 'username email');

    res.json({
      message: 'Blog post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog post
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all') && 
        !req.user.permissions.includes('blog:delete')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog tags
router.get('/meta/tags', async (req, res) => {
  try {
    const tags = await BlogPost.distinct('tags');
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;