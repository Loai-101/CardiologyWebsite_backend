const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Offer = require('../models/Offer');
const { verifyAdminToken } = require('../middleware/auth');

// Get all active offers (public)
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(12);
    
    res.json({
      success: true,
      data: offers
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers'
    });
  }
});

// Get all offers (admin only)
router.get('/all', verifyAdminToken, async (req, res) => {
  try {
    const offers = await Offer.find()
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: offers
    });
  } catch (error) {
    console.error('Error fetching all offers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers'
    });
  }
});

// Create new offer (admin only)
router.post('/', verifyAdminToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('image').notEmpty().withMessage('Image is required'),
  body('category').isIn(['consultation', 'treatment', 'package', 'checkup', 'other']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const offer = new Offer(req.body);
    await offer.save();

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating offer'
    });
  }
});

// Update offer (admin only)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating offer'
    });
  }
});

// Delete offer (admin only)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting offer'
    });
  }
});

module.exports = router;