const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingVerifications = await User.countDocuments({ role: 'employer', isVerified: false });
    const activeJobs = await Job.countDocuments({ status: 'active' });

    // Recent signups
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      pendingVerifications,
      activeJobs,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const { role, isVerified, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .select('-password');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending employer verifications
// @route   GET /api/admin/pending-verifications
// @access  Private (Admin)
exports.getPendingVerifications = async (req, res) => {
  try {
    const employers = await User.find({
      role: 'employer',
      isVerified: false
    }).sort({ createdAt: -1 });

    res.json(employers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify employer
// @route   PUT /api/admin/verify-employer/:id
// @access  Private (Admin)
exports.verifyEmployer = async (req, res) => {
  try {
    const { isVerified, notes } = req.body;

    const employer = await User.findByIdAndUpdate(
      req.params.id,
      {
        isVerified,
        verificationNotes: notes,
        verifiedBy: req.user.id,
        verifiedAt: new Date()
      },
      { new: true }
    );

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.json(employer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ban/unban user
// @route   PUT /api/admin/ban-user/:id
// @access  Private (Admin)
exports.toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? 'unbanned' : 'banned'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's jobs
    await Job.deleteMany({ postedBy: req.params.id });

    // Delete user's applications
    await Application.deleteMany({ applicant: req.params.id });

    // Delete user
    await user.deleteOne();

    res.json({ message: 'User and associated data deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs (admin view)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name email companyName')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete any job
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
