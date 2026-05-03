const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { uploadResume, uploadProfile, uploadLogo } = require('../services/cloudinaryService');
const User = require('../models/User');

// @desc    Upload resume
// @route   POST /api/upload/resume
// @access  Private
router.post('/resume', auth, uploadResume.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Add resume to user's resumes array
    const user = await User.findById(req.user.id);
    const resumeData = {
      name: req.body.name || req.file.originalname,
      url: req.file.path,
      publicId: req.file.filename,
      uploadedAt: new Date()
    };

    if (!user.resumes) {
      user.resumes = [];
    }
    user.resumes.push(resumeData);
    await user.save();

    res.json({
      success: true,
      resume: resumeData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload profile picture
// @route   POST /api/upload/profile
// @access  Private
router.post('/profile', auth, uploadProfile.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Update user's profile picture
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.path },
      { new: true }
    );

    res.json({
      success: true,
      profilePicture: req.file.path
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload company logo
// @route   POST /api/upload/logo
// @access  Private (Employer)
router.post('/logo', auth, uploadLogo.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No logo uploaded' });
    }

    // Update user's company logo
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { companyLogo: req.file.path },
      { new: true }
    );

    res.json({
      success: true,
      companyLogo: req.file.path
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
