const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const SliderImage = require('../models/SliderImage');
const { verifyAdminToken } = require('../middleware/auth');

// Get all active slider images (public)
router.get('/', async (req, res) => {
  try {
    const sliderImages = await SliderImage.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: sliderImages
    });
  } catch (error) {
    console.error('Error fetching slider images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching slider images'
    });
  }
});

// Get all slider images (admin only)
router.get('/all', verifyAdminToken, async (req, res) => {
  try {
    const sliderImages = await SliderImage.find()
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: sliderImages
    });
  } catch (error) {
    console.error('Error fetching slider images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching slider images'
    });
  }
});

// Create new slider image (admin only)
router.post('/', verifyAdminToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('image').notEmpty().withMessage('Image URL is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('link').optional().isString().withMessage('Link must be a string'),
  body('order').optional().isInt({ min: 1 }).withMessage('Order must be a positive integer')
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

    const sliderImage = new SliderImage(req.body);
    await sliderImage.save();

    res.status(201).json({
      success: true,
      message: 'Slider image created successfully',
      data: sliderImage
    });
  } catch (error) {
    console.error('Error creating slider image:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating slider image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update slider image (admin only)
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const sliderImage = await SliderImage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sliderImage) {
      return res.status(404).json({
        success: false,
        message: 'Slider image not found'
      });
    }

    res.json({
      success: true,
      message: 'Slider image updated successfully',
      data: sliderImage
    });
  } catch (error) {
    console.error('Error updating slider image:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating slider image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Delete slider image (admin only)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const sliderImage = await SliderImage.findByIdAndDelete(req.params.id);

    if (!sliderImage) {
      return res.status(404).json({
        success: false,
        message: 'Slider image not found'
      });
    }

    res.json({
      success: true,
      message: 'Slider image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slider image:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting slider image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
