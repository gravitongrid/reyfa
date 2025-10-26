const express = require('express');
const Consultation = require('../models/Consultation');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all consultations (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all') && 
        !req.user.permissions.includes('consultation:view')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, limit = 20, page = 1 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const consultations = await Consultation.find(filter)
      .populate('assignedTo', 'username email')
      .populate('followUps.createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Consultation.countDocuments(filter);

    res.json({
      consultations,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: total
      }
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create consultation (public)
router.post('/', async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      company,
      serviceType,
      preferredDate,
      preferredTime,
      message
    } = req.body;

    const consultation = new Consultation({
      clientName,
      clientEmail,
      clientPhone,
      company,
      serviceType,
      preferredDate,
      preferredTime,
      message
    });

    await consultation.save();

    res.status(201).json({
      message: 'Consultation request submitted successfully',
      consultation
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update consultation status
router.put('/:id/status', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all') && 
        !req.user.permissions.includes('consultation:approve')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, notes } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    consultation.status = status;
    if (notes) consultation.notes = notes;
    if (status === 'approved') consultation.assignedTo = req.user.userId;

    await consultation.save();
    await consultation.populate('assignedTo', 'username email');

    res.json({
      message: 'Consultation status updated successfully',
      consultation
    });
  } catch (error) {
    console.error('Update consultation status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add follow-up
router.post('/:id/followups', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all') && 
        !req.user.permissions.includes('followup:create')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { message, type, scheduledDate } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    const followUp = {
      message,
      type,
      scheduledDate,
      createdBy: req.user.userId
    };

    consultation.followUps.push(followUp);
    await consultation.save();
    await consultation.populate('followUps.createdBy', 'username');

    res.json({
      message: 'Follow-up added successfully',
      consultation
    });
  } catch (error) {
    console.error('Add follow-up error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update follow-up status
router.put('/:id/followups/:followupId', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all') && 
        !req.user.permissions.includes('followup:manage')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { completed } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    const followUp = consultation.followUps.id(req.params.followupId);
    if (!followUp) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }

    followUp.completed = completed;
    await consultation.save();

    res.json({
      message: 'Follow-up updated successfully',
      consultation
    });
  } catch (error) {
    console.error('Update follow-up error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get consultation statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all') && 
        !req.user.permissions.includes('consultation:view')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const stats = await Consultation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Consultation.countDocuments();
    const thisMonth = await Consultation.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    res.json({
      total,
      thisMonth,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get consultation stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;