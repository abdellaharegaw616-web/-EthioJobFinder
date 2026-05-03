const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const emailService = require('../services/emailService');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Job Seeker)
exports.apply = async (req, res) => {
  try {
    const { job, coverLetter, resume, answers } = req.body;

    // Check if job exists and is active
    const jobExists = await Job.findById(job);
    if (!jobExists || jobExists.status !== 'active') {
      return res.status(400).json({ message: 'Job not found or no longer active' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: job,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = await Application.create({
      job,
      applicant: req.user.id,
      coverLetter,
      resume,
      answers
    });

    // Increment job applications count
    jobExists.applicationsCount = (jobExists.applicationsCount || 0) + 1;
    await jobExists.save();

    // Populate and return
    await application.populate('job');

    // Send email notifications
    try {
      const applicant = await User.findById(req.user.id);
      const employer = await User.findById(jobExists.postedBy);
      
      // Notify applicant
      await emailService.sendApplicationConfirmation(
        applicant.email,
        applicant.name,
        jobExists.title,
        jobExists.company
      );
      
      // Notify employer
      if (employer) {
        await emailService.sendNewApplicationNotification(
          employer.email,
          applicant.name,
          jobExists.title
        );
      }
    } catch (emailErr) {
      console.log('Email notification failed (non-critical):', emailErr.message);
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location type salary')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applications for employer's jobs
// @route   GET /api/applications/received
// @access  Private (Employer)
exports.getReceivedApplications = async (req, res) => {
  try {
    // Get all jobs posted by employer
    const jobs = await Job.find({ postedBy: req.user.id }).select('_id');
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company location')
      .populate('applicant', 'name email phone skills resume')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company location type postedBy')
      .populate('applicant', 'name email phone skills resume experience education');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is authorized
    if (
      application.applicant._id.toString() !== req.user.id &&
      application.job.postedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    // Mark as viewed by employer if employer is viewing
    if (application.job.postedBy.toString() === req.user.id && !application.viewedByEmployer) {
      application.viewedByEmployer = true;
      application.viewedAt = new Date();
      await application.save();
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer/Admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id).populate('job').populate('applicant');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if employer owns the job
    if (application.job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status || application.status;
    application.notes = notes || application.notes;
    await application.save();

    // Send status update email to applicant
    try {
      await emailService.sendApplicationStatusUpdate(
        application.applicant.email,
        application.applicant.name,
        application.job.title,
        status,
        notes
      );
    } catch (emailErr) {
      console.log('Status email failed (non-critical):', emailErr.message);
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Job Seeker)
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if applicant owns the application
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    // Decrement job applications count
    const job = await Job.findById(application.job);
    if (job && job.applicationsCount > 0) {
      job.applicationsCount -= 1;
      await job.save();
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
