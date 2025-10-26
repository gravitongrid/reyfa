const express = require('express');
const SiteData = require('../models/SiteData');
const auth = require('../middleware/auth');

const router = express.Router();

// Get gallery items
router.get('/', async (req, res) => {
  try {
    const galleryData = await SiteData.findOne({ section: 'gallery' });
    res.json(galleryData ? galleryData.data : []);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add gallery item
router.post('/', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const galleryItem = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };

    let galleryData = await SiteData.findOne({ section: 'gallery' });
    
    if (!galleryData) {
      galleryData = new SiteData({
        section: 'gallery',
        data: [galleryItem]
      });
    } else {
      galleryData.data.push(galleryItem);
    }

    await galleryData.save();

    res.status(201).json({
      message: 'Gallery item added successfully',
      item: galleryItem
    });
  } catch (error) {
    console.error('Add gallery item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update gallery item
router.put('/:id', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const galleryData = await SiteData.findOne({ section: 'gallery' });
    
    if (!galleryData) {
      return res.status(404).json({ message: 'Gallery not found' });
    }

    const itemIndex = galleryData.data.findIndex(item => item.id === req.params.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    galleryData.data[itemIndex] = {
      ...galleryData.data[itemIndex],
      ...req.body,
      updatedAt: new Date()
    };

    await galleryData.save();

    res.json({
      message: 'Gallery item updated successfully',
      item: galleryData.data[itemIndex]
    });
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete gallery item
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const galleryData = await SiteData.findOne({ section: 'gallery' });
    
    if (!galleryData) {
      return res.status(404).json({ message: 'Gallery not found' });
    }

    galleryData.data = galleryData.data.filter(item => item.id !== req.params.id);
    await galleryData.save();

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;