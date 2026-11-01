const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const Report = require('../models/Report');

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
      workArrangement,
      experienceLevel,
      educationRequired,
      skills,
      minSalary,
      maxSalary,
      postedDate,
      sortBy = 'newest',
      includeExpired = 'false'
    } = req.query;

    // Base query: active jobs
    const query = { status: 'active' };
    const andConditions = [];
    
    // Category filter
    if (category) query.category = category;
    if (type) query.type = type;
    if (workArrangement) query.workArrangement = workArrangement;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    
    // Education filter
    if (educationRequired) {
      query.educationRequired = { $regex: educationRequired, $options: 'i' };
    }

    // Skills filter
    if (skills) {
      const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillsList.length > 0) {
        query.skillsRequired = { $in: skillsList.map(s => new RegExp(s, 'i')) };
      }
    }
    
    // Location filter (supports Ethiopian cities & regions)
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
    
    // Salary range filter (in ETB)
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

    // Expired positions filter (exclude expired unless explicitly requested)
    if (includeExpired !== 'true') {
      andConditions.push({
        $or: [
          { deadline: { $exists: false } },
          { deadline: null },
          { deadline: { $gte: new Date() } }
        ]
      });
    }

    // Comprehensive text search (title, description, company, skills, location)
    if (search) {
      const escaped = search.trim();
      const regexSearch = { $regex: escaped, $options: 'i' };
      andConditions.push({
        $or: [
          { title: regexSearch },
          { description: regexSearch },
          { company: regexSearch },
          { skillsRequired: regexSearch },
          { location: regexSearch }
        ]
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // Sorting logic
    let sortOptions = { createdAt: -1 };
    switch (sortBy) {
      case 'closingSoon':
        sortOptions = { deadline: 1, createdAt: -1 };
        break;
      case 'salaryHigh':
        sortOptions = { 'salary.max': -1, 'salary.min': -1, createdAt: -1 };
        break;
      case 'views':
        sortOptions = { views: -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    // Pagination
    const limitNum = Math.max(1, parseInt(limit));
    const pageNum = Math.max(1, parseInt(page));
    const skip = (pageNum - 1) * limitNum;

    // Execute query with populate including employer verification status
    const jobs = await Job.find(query)
      .populate('postedBy', 'name companyName companyDescription companyWebsite isVerified')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
      filters: {
        category: category || '',
        type: type || '',
        workArrangement: workArrangement || '',
        location: location || '',
        experienceLevel: experienceLevel || '',
        sortBy: sortBy || 'newest',
        minSalary: minSalary || '',
        maxSalary: maxSalary || '',
        search: search || '',
        includeExpired: includeExpired === 'true'
      }
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
      .populate('postedBy', 'name companyName companyDescription companyWebsite isVerified');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment views safely
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

    // Validate deadline if provided and not draft
    if (req.body.deadline && req.body.status !== 'draft') {
      const deadlineDate = new Date(req.body.deadline);
      if (isNaN(deadlineDate.getTime()) || deadlineDate < new Date()) {
        return res.status(400).json({ message: 'Application deadline must be a future date' });
      }
    }

    // Default company name from employer profile if not explicitly specified
    if (!req.body.company && req.user.companyName) {
      req.body.company = req.user.companyName;
    }

    const job = await Job.create(req.body);
    await job.populate('postedBy', 'name companyName isVerified');

    // Notify subscribers with matching active JobAlerts (non-blocking)
    try {
      if (job.status !== 'draft') {
        const JobAlert = require('../models/JobAlert');
        const { createNotification } = require('./notificationController');

        const activeAlerts = await JobAlert.find({
          isActive: true,
          user: { $ne: req.user.id }
        });

        for (const alert of activeAlerts) {
          const matchCategory = !alert.category || alert.category === 'All Categories' || alert.category === job.category;
          const matchLocation = !alert.location || alert.location === 'All Ethiopia' || job.location.toLowerCase().includes(alert.location.toLowerCase());
          const matchType = !alert.jobType || alert.jobType === 'all' || alert.jobType === job.type;

          let matchKeyword = true;
          if (alert.keywords) {
            const kw = alert.keywords.toLowerCase();
            const textToSearch = `${job.title} ${job.description} ${(job.requirements || []).join(' ')} ${(job.skillsRequired || []).join(' ')}`.toLowerCase();
            matchKeyword = textToSearch.includes(kw);
          }

          if (matchCategory && matchLocation && matchType && matchKeyword) {
            await createNotification(
              alert.user,
              'job_alert',
              'New Job Match Alert',
              `"${job.title}" at ${job.company} matches your saved alert "${alert.title}"`,
              { jobId: job._id }
            );
            alert.lastNotifiedAt = new Date();
            await alert.save();
          }
        }
      }
    } catch (alertErr) {
      console.log('Job alert dispatch error (non-critical):', alertErr.message);
    }

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

    // Validate deadline if changed
    if (req.body.deadline && req.body.status !== 'closed' && req.body.status !== 'draft') {
      const deadlineDate = new Date(req.body.deadline);
      if (isNaN(deadlineDate.getTime()) || deadlineDate < new Date()) {
        return res.status(400).json({ message: 'Application deadline must be a future date' });
      }
    }

    // Remove fields that shouldn't be updated
    delete req.body._id;
    delete req.body.postedBy;
    delete req.body.createdAt;

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('postedBy', 'name companyName isVerified');

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Quick update job status (active, closed, draft)
// @route   PATCH /api/jobs/:id/status
// @access  Private (Job Owner/Admin)
exports.updateJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'closed', 'draft'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be active, closed, or draft.' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    job.status = status;
    await job.save();

    res.json({ success: true, message: `Job marked as ${status}`, job });
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

// @desc    Get employer's jobs with accurate live applicant counts
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });

    const jobIds = jobs.map(j => j._id);
    const appCounts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$job', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    appCounts.forEach(item => {
      countMap[item._id.toString()] = item.count;
    });

    const jobsWithCounts = jobs.map(job => {
      const jobObj = job.toObject();
      jobObj.applicationsCount = countMap[job._id.toString()] || 0;
      return jobObj;
    });

    res.json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Report a job for scam, fraud, or policy violation
// @route   POST /api/jobs/:id/report
// @access  Private
exports.reportJob = async (req, res) => {
  try {
    const { reason, details } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Please select a reason for reporting this vacancy' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already reported this job
    const existingReport = await Report.findOne({
      job: req.params.id,
      reportedBy: req.user.id
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already submitted a report for this vacancy.' });
    }

    const report = await Report.create({
      job: req.params.id,
      reportedBy: req.user.id,
      reason,
      details: details ? details.trim() : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for helping keep EthioJob Finder safe. Your report has been submitted to platform administrators for investigation.',
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Internal algorithm to compute match compatibility between seeker profile and vacancy
const calculateJobMatch = (user, job) => {
  let score = 0;
  const matchedSkills = [];
  const matchReasons = [];

  const userSkills = (user?.skills || []).map(s => String(s).toLowerCase().trim()).filter(Boolean);
  const jobSkills = [
    ...(job?.skillsRequired || []),
    ...(job?.requirements || [])
  ].map(s => String(s).toLowerCase().trim()).filter(Boolean);

  // 1. Skill Overlap (up to 50 points)
  if (userSkills.length > 0 && jobSkills.length > 0) {
    userSkills.forEach(us => {
      const found = jobSkills.some(js => js.includes(us) || us.includes(js));
      if (found) {
        matchedSkills.push(us);
      }
    });

    const uniqueMatched = [...new Set(matchedSkills)];
    const skillRatio = Math.min(1, uniqueMatched.length / Math.max(1, Math.min(jobSkills.length, 4)));
    const skillPoints = Math.round(skillRatio * 50);
    score += skillPoints;

    if (uniqueMatched.length > 0) {
      matchReasons.push(`Matches ${uniqueMatched.length} of your skills (${uniqueMatched.slice(0, 3).join(', ')})`);
    }
  } else if (userSkills.length === 0) {
    score += 20; // baseline neutral score if user hasn't added skills yet
  }

  // 2. Location Alignment (up to 25 points)
  const userLoc = (user?.location || '').toLowerCase().trim();
  const jobLoc = (job?.location || '').toLowerCase().trim();
  const isRemote = job?.workArrangement === 'remote' || job?.type === 'remote' || jobLoc.includes('remote');

  if (isRemote) {
    score += 25;
    matchReasons.push('Remote friendly arrangement');
  } else if (userLoc && jobLoc && (jobLoc.includes(userLoc) || userLoc.includes(jobLoc))) {
    score += 25;
    matchReasons.push(`Location aligned with ${job.location}`);
  } else if (!userLoc) {
    score += 15;
  } else {
    score += 5;
  }

  // 3. Title & Headline Relevance (up to 15 points)
  const headline = (user?.professionalHeadline || '').toLowerCase().trim();
  const jobTitle = (job?.title || '').toLowerCase().trim();
  let titleRelevance = false;

  if (headline && jobTitle) {
    const headlineWords = headline.split(/[\s,/-]+/).filter(w => w.length > 2);
    titleRelevance = headlineWords.some(w => jobTitle.includes(w));
  }

  // Also check if candidate core skills are highlighted directly in the job title
  if (!titleRelevance && userSkills.length > 0 && jobTitle) {
    titleRelevance = userSkills.some(sk => jobTitle.includes(sk));
  }

  if (titleRelevance) {
    score += 15;
    matchReasons.push('Aligns with your professional headline or target role');
  }

  // 4. Experience Level Alignment (up to 10 points)
  let userExpCount = (user?.experience || []).length;
  let inferredLevel = 'entry';
  if (userExpCount >= 5) inferredLevel = 'senior';
  else if (userExpCount >= 2) inferredLevel = 'mid';

  if (job?.experienceLevel === inferredLevel) {
    score += 10;
    matchReasons.push(`Matches your ${job.experienceLevel}-level profile`);
  } else {
    score += 5;
  }

  const finalScore = Math.min(99, Math.max(35, score));

  return {
    matchScore: finalScore,
    matchedSkills: [...new Set(matchedSkills)],
    matchReasons
  };
};

exports.calculateJobMatch = calculateJobMatch;

// @desc    Get personalized job recommendations for authenticated seeker
// @route   GET /api/jobs/recommendations
// @access  Private (Job Seeker / Authenticated)
exports.getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('skills location professionalHeadline experience');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch active vacancies
    const jobs = await Job.find({
      $or: [
        { status: 'active' },
        { status: { $exists: false } }
      ]
    })
    .populate('postedBy', 'name companyName companyLogo isVerified')
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(80);

    // Filter out expired jobs and compute scores
    const now = new Date();
    const scoredJobs = jobs
      .filter(job => !job.deadline || new Date(job.deadline) >= now)
      .map(job => {
        const jobObj = job.toObject();
        const match = calculateJobMatch(user, jobObj);
        return {
          ...jobObj,
          matchScore: match.matchScore,
          matchedSkills: match.matchedSkills,
          matchReasons: match.matchReasons
        };
      })
      .sort((a, b) => {
        // Boost featured jobs slightly, then rank by matchScore descending
        const scoreA = a.matchScore + (a.isFeatured ? 5 : 0);
        const scoreB = b.matchScore + (b.isFeatured ? 5 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 20);

    res.json({
      success: true,
      count: scoredJobs.length,
      profileSummary: {
        skillsCount: (user.skills || []).length,
        hasSkills: (user.skills || []).length > 0,
        location: user.location || 'All Ethiopia'
      },
      data: scoredJobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


