const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Offer = require('../models/Offer');
const SliderImage = require('../models/SliderImage');
const { verifyAdminToken } = require('../middleware/auth');

// Get all active offers (public)
router.get('/offers', async (req, res) => {
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
router.get('/offers/all', verifyAdminToken, async (req, res) => {
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
router.post('/offers', verifyAdminToken, [
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
router.put('/offers/:id', verifyAdminToken, async (req, res) => {
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
router.delete('/offers/:id', verifyAdminToken, async (req, res) => {
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

// Get all slider images (public)
router.get('/slider', async (req, res) => {
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
router.get('/slider/all', verifyAdminToken, async (req, res) => {
  try {
    const sliderImages = await SliderImage.find()
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: sliderImages
    });
  } catch (error) {
    console.error('Error fetching all slider images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching slider images'
    });
  }
});

// Create new slider image (admin only)
router.post('/slider', verifyAdminToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('image').notEmpty().withMessage('Image URL is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('link').optional().isString().withMessage('Link must be a string'),
  body('order').optional().isInt({ min: 1 }).withMessage('Order must be a positive integer')
], async (req, res) => {
  try {
    console.log('📸 Creating slider image with data:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Slider validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const sliderImage = new SliderImage(req.body);
    await sliderImage.save();
    
    console.log('✅ Slider image created successfully:', sliderImage._id);

    res.status(201).json({
      success: true,
      message: 'Slider image created successfully',
      data: sliderImage
    });
  } catch (error) {
    console.error('❌ Error creating slider image:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    res.status(500).json({
      success: false,
      message: 'Error creating slider image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update slider image (admin only)
router.put('/slider/:id', verifyAdminToken, async (req, res) => {
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
      message: 'Error updating slider image'
    });
  }
});

// Delete slider image (admin only)
router.delete('/slider/:id', verifyAdminToken, async (req, res) => {
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
      message: 'Error deleting slider image'
    });
  }
});

module.exports = router;
