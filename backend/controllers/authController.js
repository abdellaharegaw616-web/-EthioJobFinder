const jwt = require('jsonwebtoken');
const User = require('../models/User');
const emailService = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  console.log('Register controller called, next type:', typeof next);
  try {
    const { name, email, password, role, phone, location, companyName, companyDescription, companyWebsite } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'jobseeker',
      phone,
      location,
      companyName: role === 'employer' ? companyName : undefined,
      companyDescription: role === 'employer' ? companyDescription : undefined,
      companyWebsite: role === 'employer' ? companyWebsite : undefined
    });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.name, user.role);
    } catch (emailErr) {
      console.log('Welcome email failed (non-critical):', emailErr.message);
    }

    // Generate and send email verification token
    const crypto = require('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    
    try {
      await emailService.sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (emailErr) {
      console.log('Verification email failed (non-critical):', emailErr.message);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && await user.comparePassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const updateFields = { ...req.body };
    delete updateFields.password;
    delete updateFields._id;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved jobs
// @route   GET /api/auth/saved-jobs
// @access  Private
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedJobs',
      populate: { path: 'postedBy', select: 'name companyName isVerified' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      count: user.savedJobs ? user.savedJobs.length : 0,
      savedJobs: user.savedJobs || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save a job to user profile
// @route   POST /api/auth/saved-jobs/:id
// @access  Private
exports.saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.savedJobs) {
      user.savedJobs = [];
    }

    if (!user.savedJobs.some(id => id.toString() === jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Job saved successfully',
      savedJobs: user.savedJobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove saved job from user profile
// @route   DELETE /api/auth/saved-jobs/:id
// @access  Private
exports.unsaveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.savedJobs) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Job removed from saved jobs',
      savedJobs: user.savedJobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/auth/notification-preferences
// @access  Private
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { emailAlerts, applicationUpdates, jobRecommendations } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notificationPreferences = {
      emailAlerts: emailAlerts !== undefined ? emailAlerts : (user.notificationPreferences?.emailAlerts ?? true),
      applicationUpdates: applicationUpdates !== undefined ? applicationUpdates : (user.notificationPreferences?.applicationUpdates ?? true),
      jobRecommendations: jobRecommendations !== undefined ? jobRecommendations : (user.notificationPreferences?.jobRecommendations ?? true)
    };

    await user.save();

    res.json({
      success: true,
      notificationPreferences: user.notificationPreferences
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public company profile
// @route   GET /api/auth/company/:id
// @access  Public
exports.getCompanyProfile = async (req, res) => {
  try {
    const employer = await User.findById(req.params.id)
      .select('name companyName companyDescription companyWebsite companyLogo companyCity companyIndustry companySize isVerified location createdAt role');

    if (!employer) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(employer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request employer verification
// @route   POST /api/auth/request-verification
// @access  Private (Employer)
exports.requestVerification = async (req, res) => {
  try {
    const { tinNumber, businessRegistrationUrl, companyDocument, notes } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.verificationStatus = 'pending';
    user.verificationRequestedAt = new Date();
    user.verificationNotes = notes || (tinNumber ? `TIN: ${tinNumber}` : 'Verification requested');
    if (tinNumber) {
      user.taxIdNumber = tinNumber;
    }
    if (businessRegistrationUrl || companyDocument) {
      user.verificationDocument = businessRegistrationUrl || companyDocument;
      user.businessLicenseUrl = businessRegistrationUrl || companyDocument;
    }
    await user.save();

    res.json({
      success: true,
      message: 'Verification request submitted. Our team will review your business credentials within 24-48 hours.',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

