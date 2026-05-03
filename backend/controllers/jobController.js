const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Get all jobs with filtering and pagination
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      type, 
      location,
      experienceLevel,
      minSalary,
      maxSalary,
      postedDate
    } = req.query;

    // Build query
    const query = { status: 'active' };
    
    // Category filter
    if (category) query.category = category;
    if (type) query.type = type;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    
    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Posted date filter
    if (postedDate) {
      const cutoffDate = new Date();
      switch (postedDate) {
        case '24h':
          cutoffDate.setHours(cutoffDate.getHours() - 24);
          break;
        case 'week':
          cutoffDate.setDate(cutoffDate.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(cutoffDate.getMonth() - 1);
          break;
      }
      query.createdAt = { $gte: cutoffDate };
    }
    
    // Salary filter
    if (minSalary || maxSalary) {
      if (minSalary && maxSalary) {
        query['salary.min'] = { $lte: parseInt(maxSalary) };
        query['salary.max'] = { $gte: parseInt(minSalary) };
      } else if (minSalary) {
        query['salary.max'] = { $gte: parseInt(minSalary) };
      } else if (maxSalary) {
        query['salary.min'] = { $lte: parseInt(maxSalary) };
      }
    }

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with populate
    const jobs = await Job.find(query)
      .populate('postedBy', 'name companyName companyDescription companyWebsite')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name companyName companyDescription companyWebsite');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment views
    job.views = (job.views || 0) + 1;
    await job.save();

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer/Admin)
exports.createJob = async (req, res) => {
  try {
    req.body.postedBy = req.user.id;
    const job = await Job.create(req.body);
    await job.populate('postedBy', 'name companyName');
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Job Owner/Admin)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    // Remove fields that shouldn't be updated
    delete req.body._id;
    delete req.body.postedBy;
    delete req.body.createdAt;

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('postedBy', 'name companyName');

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Job Owner/Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
