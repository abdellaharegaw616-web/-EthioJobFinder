const JobAlert = require('../models/JobAlert');
const Job = require('../models/Job');

// @desc    Get current user's job alerts
// @route   GET /api/job-alerts
// @access  Private
exports.getMyAlerts = async (req, res) => {
  try {
    const alerts = await JobAlert.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job alert
// @route   POST /api/job-alerts
// @access  Private
exports.createAlert = async (req, res) => {
  try {
    const {
      title,
      keywords,
      location,
      category,
      jobType,
      minSalary,
      frequency,
      emailNotification
    } = req.body;

    if (!title || !keywords) {
      return res.status(400).json({ message: 'Title and keywords are required to create an alert' });
    }

    const alert = await JobAlert.create({
      user: req.user.id,
      title,
      keywords,
      location: location || 'All Ethiopia',
      category: category || 'All Categories',
      jobType: jobType || 'all',
      minSalary: Number(minSalary) || 0,
      frequency: frequency || 'instant',
      emailNotification: emailNotification !== undefined ? emailNotification : true
    });

    res.status(201).json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job alert (or toggle active status)
// @route   PUT /api/job-alerts/:id
// @access  Private
exports.updateAlert = async (req, res) => {
  try {
    const alert = await JobAlert.findOne({ _id: req.params.id, user: req.user.id });

    if (!alert) {
      return res.status(404).json({ message: 'Job alert not found' });
    }

    const allowedUpdates = [
      'title',
      'keywords',
      'location',
      'category',
      'jobType',
      'minSalary',
      'frequency',
      'emailNotification',
      'isActive'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        alert[field] = req.body[field];
      }
    });

    await alert.save();

    res.json({
      success: true,
      data: alert
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job alert
// @route   DELETE /api/job-alerts/:id
// @access  Private
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await JobAlert.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!alert) {
      return res.status(404).json({ message: 'Job alert not found' });
    }

    res.json({
      success: true,
      message: 'Job alert deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get matching jobs for an alert (live preview)
// @route   GET /api/job-alerts/:id/matches
// @access  Private
exports.getAlertMatches = async (req, res) => {
  try {
    const alert = await JobAlert.findOne({ _id: req.params.id, user: req.user.id });
    if (!alert) {
      return res.status(404).json({ message: 'Job alert not found' });
    }

    const query = {
      $or: [
        { status: 'active' },
        { status: { $exists: false } }
      ]
    };

    if (alert.keywords) {
      query.$text = { $search: alert.keywords };
    }

    if (alert.category && alert.category !== 'All Categories') {
      query.category = alert.category;
    }

    if (alert.location && alert.location !== 'All Ethiopia') {
      query.location = { $regex: alert.location, $options: 'i' };
    }

    if (alert.jobType && alert.jobType !== 'all') {
      query.type = alert.jobType;
    }

    if (alert.minSalary && alert.minSalary > 0) {
      query['salary.min'] = { $gte: alert.minSalary };
    }

    const matches = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('postedBy', 'name companyName isVerified');

    res.json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
