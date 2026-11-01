const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Report = require('../models/Report');
const AuditLog = require('../models/AuditLog');
const { createNotification } = require('./notificationController');

// Internal helper for recording administrative audit trails
const recordAudit = async (adminId, action, targetType, targetId, targetName, reason, details = {}, req = null) => {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : null;
    await AuditLog.create({
      admin: adminId,
      action,
      targetType,
      targetId,
      targetName,
      reason: reason || 'Administrative action',
      details,
      ipAddress
    });
  } catch (err) {
    console.error('Audit log recording failed (non-critical):', err.message);
  }
};

// @desc    Get admin dashboard stats and platform telemetry
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingVerifications = await User.countDocuments({ role: 'employer', isVerified: false });
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    // Role distributions
    const jobseekersCount = await User.countDocuments({ role: 'jobseeker' });
    const employersCount = await User.countDocuments({ role: 'employer' });
    const adminsCount = await User.countDocuments({ role: 'admin' });
    const bannedUsersCount = await User.countDocuments({ isActive: false });

    // Ethiopian city distribution (Top 6)
    const cityDistribution = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    // Vacancy category distribution
    const categoryDistribution = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // Recent user signups
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt isVerified isActive');

    // Recent administrative audit logs
    const recentAuditLogs = await AuditLog.find()
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      totalUsers,
      totalJobs,
      totalApplications,
      pendingVerifications,
      activeJobs,
      totalReports,
      pendingReports,
      jobseekersCount,
      employersCount,
      adminsCount,
      bannedUsersCount,
      cityDistribution,
      categoryDistribution,
      recentUsers,
      recentAuditLogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users with advanced search, status, and role filters
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const { role, isVerified, status, search, limit = 50, page = 1 } = req.query;
    let query = {};

    if (role && role !== 'all') query.role = role;
    if (isVerified !== undefined && isVerified !== '') query.isVerified = isVerified === 'true';
    if (status === 'banned') query.isActive = false;
    if (status === 'active') query.isActive = true;

    if (search) {
      const escaped = search.trim();
      query.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { email: { $regex: escaped, $options: 'i' } },
        { companyName: { $regex: escaped, $options: 'i' } }
      ];
    }

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip)
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

// @desc    Verify or reject employer credentials
// @route   PUT /api/admin/verify-employer/:id
// @access  Private (Admin)
exports.verifyEmployer = async (req, res) => {
  try {
    const { isVerified, notes } = req.body;

    const employer = await User.findByIdAndUpdate(
      req.params.id,
      {
        isVerified,
        verificationStatus: isVerified ? 'verified' : 'rejected',
        verificationNotes: notes,
        verifiedBy: req.user.id,
        verifiedAt: new Date()
      },
      { new: true }
    );

    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // In-app notification to employer regarding verification result
    try {
      await createNotification(
        employer._id,
        'verification_status',
        isVerified ? 'Company Verified!' : 'Verification Request Update',
        isVerified
          ? 'Congratulations! Your company account has been verified. You now enjoy a verified badge and boosted vacancy trust.'
          : `Your verification request was reviewed. Status: Rejected.${notes ? ` Note: ${notes}` : ''}`,
        { isVerified, notes }
      );
    } catch (notifErr) {
      console.log('Verification notification error (non-critical):', notifErr.message);
    }

    // Record audit trail
    await recordAudit(
      req.user.id,
      isVerified ? 'employer_verified' : 'employer_rejected',
      'User',
      employer._id,
      employer.companyName || employer.name,
      notes || (isVerified ? 'Approved business credentials' : 'Rejected verification request'),
      { isVerified, notes },
      req
    );

    res.json(employer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ban or unban user account with audit reason
// @route   PUT /api/admin/ban-user/:id
// @access  Private (Admin)
exports.toggleUserBan = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const previousState = user.isActive;
    user.isActive = !user.isActive;
    await user.save();

    const action = user.isActive ? 'user_unbanned' : 'user_banned';

    // Record audit trail
    await recordAudit(
      req.user.id,
      action,
      'User',
      user._id,
      `${user.name} (${user.email})`,
      reason || (user.isActive ? 'Account restored by administrator' : 'Account suspended for policy violations'),
      { previousState, newState: user.isActive },
      req
    );

    res.json({
      message: `User ${user.isActive ? 'unbanned' : 'banned'}`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Permanently delete user and associated content
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const { reason } = req.body || {};
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's jobs and applications
    const deletedJobs = await Job.deleteMany({ postedBy: req.params.id });
    const deletedApps = await Application.deleteMany({ applicant: req.params.id });

    // Record audit trail before final deletion
    await recordAudit(
      req.user.id,
      'user_deleted',
      'User',
      user._id,
      `${user.name} (${user.email})`,
      reason || 'Permanent account purge requested by administrator',
      { deletedJobsCount: deletedJobs.deletedCount, deletedAppsCount: deletedApps.deletedCount },
      req
    );

    await user.deleteOne();

    res.json({ message: 'User and associated data deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all jobs (with search, category, status, and city filters)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
exports.getAllJobs = async (req, res) => {
  try {
    const { search, category, status, location, isFeatured } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (category && category !== 'All Categories') filter.category = category;
    if (location && location !== 'All Ethiopia') filter.location = { $regex: location, $options: 'i' };
    if (isFeatured !== undefined && isFeatured !== '') filter.isFeatured = isFeatured === 'true';

    if (search) {
      const escaped = search.trim();
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { company: { $regex: escaped, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(filter)
      .populate('postedBy', 'name email companyName isVerified')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle featured status for a vacancy
// @route   PUT /api/admin/jobs/:id/feature
// @access  Private (Admin)
exports.toggleFeatureJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.isFeatured = !job.isFeatured;
    await job.save();

    await recordAudit(
      req.user.id,
      'job_featured_toggled',
      'Job',
      job._id,
      `${job.title} (${job.company})`,
      job.isFeatured ? 'Featured vacancy on homepage' : 'Removed from featured vacancies',
      { isFeatured: job.isFeatured },
      req
    );

    res.json({
      success: true,
      message: `Job ${job.isFeatured ? 'featured' : 'unfeatured'}`,
      job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete any job with audit tracking
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
exports.deleteJob = async (req, res) => {
  try {
    const { reason } = req.body || {};
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await recordAudit(
      req.user.id,
      'job_deleted',
      'Job',
      job._id,
      `${job.title} (${job.company})`,
      reason || 'Vacancy deleted by administrator',
      { postedBy: job.postedBy },
      req
    );

    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports with status filtering
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.getReports = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate({
        path: 'job',
        select: 'title company location status deadline postedBy',
        populate: { path: 'postedBy', select: 'name email companyName' }
      })
      .populate('reportedBy', 'name email role')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status and admin investigation notes
// @route   PUT /api/admin/reports/:id
// @access  Private (Admin)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const previousStatus = report.status;
    report.status = status || report.status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;
    if (status === 'resolved' || status === 'dismissed') {
      report.resolvedBy = req.user.id;
      report.resolvedAt = new Date();
    }

    await report.save();

    // In-app notification to the reporting user
    try {
      if (status === 'resolved' || status === 'dismissed') {
        await createNotification(
          report.reportedBy,
          'system',
          status === 'resolved' ? 'Vacancy Report Resolved' : 'Vacancy Report Reviewed',
          status === 'resolved'
            ? 'Thank you for keeping EthioJob Finder safe. The vacancy you reported was investigated and appropriate action was taken.'
            : 'Your vacancy report has been reviewed by our trust & safety moderation team.',
          { reportId: report._id, status }
        );
      }
    } catch (reportNotifErr) {
      console.log('Report resolution notification error (non-critical):', reportNotifErr.message);
    }

    // Record audit trail
    let auditAction = 'report_investigating';
    if (status === 'resolved') auditAction = 'report_resolved';
    if (status === 'dismissed') auditAction = 'report_dismissed';

    await recordAudit(
      req.user.id,
      auditAction,
      'Report',
      report._id,
      `Report on Job ${report.job}`,
      adminNotes || `Report status updated to ${status}`,
      { previousStatus, newStatus: report.status },
      req
    );

    res.json({ success: true, message: 'Report updated', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get administrative audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
exports.getAuditLogs = async (req, res) => {
  try {
    const { action, targetType, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (action && action !== 'all') filter.action = action;
    if (targetType && targetType !== 'all') filter.targetType = targetType;

    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const skip = (pageNum - 1) * limitNum;

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .populate('admin', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    res.json({
      success: true,
      count: logs.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: logs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
