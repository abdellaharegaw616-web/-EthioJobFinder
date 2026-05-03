// Mock Database for development without MongoDB
const bcrypt = require('bcryptjs');

class MockDB {
  constructor() {
    this.users = [];
    this.jobs = [];
    this.applications = [];
    this.idCounters = {
      users: 1,
      jobs: 1,
      applications: 1
    };
    this.seedData();
  }

  seedData() {
    // Seed admin user
    this.users.push({
      _id: '1',
      name: 'Admin User',
      email: 'admin@ethiojobs.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'admin',
      createdAt: new Date()
    });

    // Seed employer
    this.users.push({
      _id: '2',
      name: 'TechCorp Ethiopia',
      email: 'employer@techcorp.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'employer',
      company: 'TechCorp Ethiopia',
      phone: '+251911234567',
      createdAt: new Date()
    });

    // Seed job seeker
    this.users.push({
      _id: '3',
      name: 'Abebe Kebede',
      email: 'jobseeker@example.com',
      password: bcrypt.hashSync('password123', 10),
      role: 'jobseeker',
      phone: '+251922345678',
      createdAt: new Date()
    });

    // Seed sample jobs
    this.jobs.push({
      _id: '1',
      title: 'Senior Software Developer',
      company: 'TechCorp Ethiopia',
      location: 'Addis Ababa',
      type: 'full-time',
      category: 'Technology',
      description: 'We are looking for an experienced software developer to join our team. You will be working on cutting-edge web and mobile applications.',
      requirements: ['5+ years experience', 'Bachelor degree in CS', 'Node.js, React experience'],
      salary: '40,000 - 60,000 ETB',
      postedBy: '2',
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    this.jobs.push({
      _id: '2',
      title: 'Marketing Manager',
      company: 'Habesha Beverages',
      location: 'Addis Ababa',
      type: 'full-time',
      category: 'Marketing',
      description: 'Lead our marketing team and develop strategies to expand our market presence across Ethiopia.',
      requirements: ['3+ years in marketing', 'MBA preferred', 'Excellent communication skills'],
      salary: '35,000 - 50,000 ETB',
      postedBy: '2',
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    this.jobs.push({
      _id: '3',
      title: 'Customer Service Representative',
      company: 'Ethio Telecom',
      location: 'Addis Ababa',
      type: 'full-time',
      category: 'Customer Service',
      description: 'Handle customer inquiries and provide excellent service to our subscribers.',
      requirements: ['High school diploma', 'Good communication skills', 'Amharic and English fluency'],
      salary: '15,000 - 20,000 ETB',
      postedBy: '2',
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    this.jobs.push({
      _id: '4',
      title: 'Junior Web Developer',
      company: 'Addis Software',
      location: 'Addis Ababa',
      type: 'contract',
      category: 'Technology',
      description: 'Entry-level position for fresh graduates. Training will be provided.',
      requirements: ['Computer Science degree', 'Basic knowledge of HTML/CSS/JS', 'Willingness to learn'],
      salary: '20,000 - 25,000 ETB',
      postedBy: '2',
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    this.jobs.push({
      _id: '5',
      title: 'Accountant',
      company: 'Dashen Bank',
      location: 'Bahir Dar',
      type: 'full-time',
      category: 'Finance',
      description: 'Manage financial records and ensure compliance with banking regulations.',
      requirements: ['Accounting degree', 'CPA certification preferred', '2+ years experience'],
      salary: '25,000 - 35,000 ETB',
      postedBy: '2',
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Seed sample application
    this.applications.push({
      _id: '1',
      job: '1',
      applicant: '3',
      coverLetter: 'I am very interested in this position and believe my skills match your requirements.',
      resume: 'resume_abebe.pdf',
      status: 'pending',
      appliedAt: new Date()
    });

    this.idCounters.users = 4;
    this.idCounters.jobs = 6;
    this.idCounters.applications = 2;
  }

  // User operations
  async findUser(query) {
    if (query.email) {
      return this.users.find(u => u.email === query.email) || null;
    }
    if (query._id) {
      return this.users.find(u => u._id === query._id) || null;
    }
    return null;
  }

  async findUsers(query = {}) {
    if (query.role) {
      return this.users.filter(u => u.role === query.role);
    }
    return this.users;
  }

  async createUser(userData) {
    const newUser = {
      _id: String(this.idCounters.users++),
      ...userData,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Job operations
  async findJobs(query = {}) {
    let jobs = this.jobs;
    if (query.status) {
      jobs = jobs.filter(j => j.status === query.status);
    }
    if (query.postedBy) {
      jobs = jobs.filter(j => j.postedBy === query.postedBy);
    }
    return jobs;
  }

  async findJobById(id) {
    return this.jobs.find(j => j._id === id) || null;
  }

  async createJob(jobData) {
    const newJob = {
      _id: String(this.idCounters.jobs++),
      ...jobData,
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
    this.jobs.push(newJob);
    return newJob;
  }

  async updateJob(id, updates) {
    const index = this.jobs.findIndex(j => j._id === id);
    if (index === -1) return null;
    this.jobs[index] = { ...this.jobs[index], ...updates };
    return this.jobs[index];
  }

  async deleteJob(id) {
    const index = this.jobs.findIndex(j => j._id === id);
    if (index === -1) return null;
    const deleted = this.jobs[index];
    this.jobs.splice(index, 1);
    return deleted;
  }

  // Application operations
  async findApplications(query = {}) {
    let apps = this.applications;
    if (query.job) {
      apps = apps.filter(a => a.job === query.job);
    }
    if (query.applicant) {
      apps = apps.filter(a => a.applicant === query.applicant);
    }
    return apps;
  }

  async findApplicationById(id) {
    return this.applications.find(a => a._id === id) || null;
  }

  async createApplication(appData) {
    const newApp = {
      _id: String(this.idCounters.applications++),
      ...appData,
      status: 'pending',
      appliedAt: new Date()
    };
    this.applications.push(newApp);
    return newApp;
  }

  async updateApplication(id, updates) {
    const index = this.applications.findIndex(a => a._id === id);
    if (index === -1) return null;
    this.applications[index] = { ...this.applications[index], ...updates };
    return this.applications[index];
  }
}

module.exports = new MockDB();
