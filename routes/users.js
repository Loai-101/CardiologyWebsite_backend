const express = require('express');
const User = require('../models/User');
const { verifyAdminToken } = require('../middleware/auth');

const router = express.Router();

// Get all registered users (Admin only)
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Get users with pagination
    const users = await User.find({ role: 'user' })
      .select('-password') // Exclude password field
      .sort({ signupTime: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);


    // Get total count
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Get statistics
    const stats = await User.aggregate([
      { $match: { role: 'user' } },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          maleUsers: {
            $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] }
          },
          femaleUsers: {
            $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] }
          },
          newThisWeek: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$signupTime',
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const statistics = stats[0] || {
      totalUsers: 0,
      maleUsers: 0,
      femaleUsers: 0,
      newThisWeek: 0
    };

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page < Math.ceil(totalUsers / limit),
          hasPrev: page > 1
        },
        statistics
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// Get user statistics (Admin only)
router.get('/stats', verifyAdminToken, async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: 'user' } },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          maleUsers: {
            $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] }
          },
          femaleUsers: {
            $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] }
          },
          otherGender: {
            $sum: { $cond: [{ $in: ['$gender', ['other', 'prefer-not-to-say']] }, 1, 0] }
          },
          newThisWeek: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$signupTime',
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ]
                },
                1,
                0
              ]
            }
          },
          newThisMonth: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$signupTime',
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const statistics = stats[0] || {
      totalUsers: 0,
      maleUsers: 0,
      femaleUsers: 0,
      otherGender: 0,
      newThisWeek: 0,
      newThisMonth: 0
    };

    res.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// Update user status (Admin only)
router.patch('/:userId/status', verifyAdminToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['registered', 'pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User status updated successfully',
      user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user status'
    });
  }
});

// Delete user (Admin only)
router.delete('/:userId', verifyAdminToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user'
    });
  }
});

module.exports = router;
