const express = require('express');
const SiteData = require('../models/SiteData');
const auth = require('../middleware/auth');

const router = express.Router();

// Get portfolio items
router.get('/', async (req, res) => {
  try {
    const portfolioData = await SiteData.findOne({ section: 'portfolio' });
    res.json(portfolioData ? portfolioData.data : []);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add portfolio item
router.post('/', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const portfolioItem = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };

    let portfolioData = await SiteData.findOne({ section: 'portfolio' });
    
    if (!portfolioData) {
      portfolioData = new SiteData({
        section: 'portfolio',
        data: [portfolioItem]
      });
    } else {
      portfolioData.data.push(portfolioItem);
    }

    await portfolioData.save();

    res.status(201).json({
      message: 'Portfolio item added successfully',
      item: portfolioItem
    });
  } catch (error) {
    console.error('Add portfolio item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update portfolio item
router.put('/:id', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const portfolioData = await SiteData.findOne({ section: 'portfolio' });
    
    if (!portfolioData) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const itemIndex = portfolioData.data.findIndex(item => item.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    portfolioData.data[itemIndex] = {
      ...portfolioData.data[itemIndex],
      ...req.body,
      updatedAt: new Date()
    };

    await portfolioData.save();

    res.json({
      message: 'Portfolio item updated successfully',
      item: portfolioData.data[itemIndex]
    });
  } catch (error) {
    console.error('Update portfolio item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete portfolio item
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const portfolioData = await SiteData.findOne({ section: 'portfolio' });
    
    if (!portfolioData) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    portfolioData.data = portfolioData.data.filter(item => item.id !== req.params.id);
    await portfolioData.save();

    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Delete portfolio item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;