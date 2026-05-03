const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');

dotenv.config();

const sampleJobs = [
  {
    title: 'Senior Software Engineer',
    description: 'We are looking for an experienced Software Engineer to join our team. You will be responsible for developing high-quality applications and collaborating with cross-functional teams.',
    company: 'TechCorp Ethiopia',
    location: 'Addis Ababa',
    type: 'full-time',
    category: 'IT & Software',
    salary: { min: 50000, max: 80000, currency: 'ETB', negotiable: true },
    requirements: ['5+ years of experience', 'Bachelor\'s degree in Computer Science', 'Proficiency in JavaScript and Node.js'],
    responsibilities: ['Develop and maintain web applications', 'Collaborate with product team', 'Code reviews and mentoring'],
    benefits: ['Health insurance', 'Flexible working hours', 'Annual bonus'],
    experienceLevel: 'senior',
    educationRequired: 'Bachelor\'s Degree',
    skillsRequired: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
    status: 'active'
  },
  {
    title: 'Marketing Manager',
    description: 'Lead our marketing team to develop and execute marketing strategies that drive growth and brand awareness.',
    company: 'GrowthMarketing PLC',
    location: 'Addis Ababa',
    type: 'full-time',
    category: 'Marketing',
    salary: { min: 35000, max: 55000, currency: 'ETB', negotiable: true },
    requirements: ['3+ years in marketing', 'Strong analytical skills', 'Experience with digital marketing'],
    responsibilities: ['Develop marketing strategies', 'Manage marketing budget', 'Lead marketing campaigns'],
    benefits: ['Transportation allowance', 'Performance bonus', 'Training opportunities'],
    experienceLevel: 'mid',
    educationRequired: 'Bachelor\'s Degree in Marketing or related',
    skillsRequired: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
    status: 'active'
  },
  {
    title: 'Customer Support Representative',
    description: 'Join our customer support team to provide excellent service to our clients and resolve their inquiries.',
    company: 'ServiceFirst',
    location: 'Dire Dawa',
    type: 'full-time',
    category: 'Business',
    salary: { min: 15000, max: 25000, currency: 'ETB', negotiable: false },
    requirements: ['Excellent communication skills', 'High school diploma or higher', 'Customer service experience preferred'],
    responsibilities: ['Handle customer inquiries', 'Resolve complaints', 'Maintain customer records'],
    benefits: ['Health insurance', 'Paid training', 'Career growth opportunities'],
    experienceLevel: 'entry',
    educationRequired: 'High School Diploma',
    skillsRequired: ['Communication', 'Problem Solving', 'Patience', 'Computer Skills'],
    status: 'active'
  },
  {
    title: 'Remote Frontend Developer',
    description: 'Work remotely as a Frontend Developer building modern, responsive web applications.',
    company: 'GlobalTech Solutions',
    location: 'Remote',
    type: 'remote',
    category: 'IT & Software',
    salary: { min: 40000, max: 70000, currency: 'ETB', negotiable: true },
    requirements: ['3+ years frontend experience', 'Strong HTML/CSS/JavaScript skills', 'Experience with React'],
    responsibilities: ['Build user interfaces', 'Optimize web applications', 'Collaborate with backend team'],
    benefits: ['Work from home', 'Flexible hours', 'Equipment allowance'],
    experienceLevel: 'mid',
    educationRequired: 'Bachelor\'s Degree or equivalent experience',
    skillsRequired: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    status: 'active'
  },
  {
    title: 'Sales Representative',
    description: 'Drive sales growth by identifying new opportunities and maintaining relationships with clients.',
    company: 'SalesPro Ethiopia',
    location: 'Addis Ababa',
    type: 'full-time',
    category: 'Sales',
    salary: { min: 20000, max: 40000, currency: 'ETB', negotiable: true },
    requirements: ['2+ years sales experience', 'Strong negotiation skills', 'Target-driven mindset'],
    responsibilities: ['Generate leads', 'Close sales deals', 'Maintain client relationships'],
    benefits: ['Commission on sales', 'Car allowance', 'Mobile phone'],
    experienceLevel: 'mid',
    educationRequired: 'Bachelor\'s Degree preferred',
    skillsRequired: ['Sales', 'Negotiation', 'CRM', 'Communication'],
    status: 'active'
  },
  {
    title: 'Human Resources Officer',
    description: 'Support HR operations including recruitment, employee relations, and policy implementation.',
    company: 'HR Solutions Ltd',
    location: 'Addis Ababa',
    type: 'full-time',
    category: 'Business',
    salary: { min: 25000, max: 40000, currency: 'ETB', negotiable: true },
    requirements: ['2+ years HR experience', 'Knowledge of labor laws', 'Strong interpersonal skills'],
    responsibilities: ['Recruitment and onboarding', 'Employee records management', 'HR policy implementation'],
    benefits: ['Health insurance', 'Professional development', 'Work-life balance'],
    experienceLevel: 'mid',
    educationRequired: 'Bachelor\'s Degree in HR or related',
    skillsRequired: ['Recruitment', 'Employee Relations', 'HR Policies', 'Communication'],
    status: 'active'
  },
  {
    title: 'Junior Accountant',
    description: 'Entry-level accounting position for recent graduates. Learn and grow with our finance team.',
    company: 'FinAccount Services',
    location: 'Bahir Dar',
    type: 'full-time',
    category: 'Finance',
    salary: { min: 18000, max: 28000, currency: 'ETB', negotiable: false },
    requirements: ['Bachelor\'s in Accounting or Finance', 'Knowledge of accounting software', 'Attention to detail'],
    responsibilities: ['Process invoices', 'Reconcile accounts', 'Assist with financial reports'],
    benefits: ['Training and mentorship', 'Health insurance', 'Career advancement'],
    experienceLevel: 'entry',
    educationRequired: 'Bachelor\'s Degree in Accounting',
    skillsRequired: ['Accounting', 'Excel', 'QuickBooks', 'Attention to Detail'],
    status: 'active'
  },
  {
    title: 'Product Manager',
    description: 'Lead product development from conception to launch, working with engineering, design, and marketing teams.',
    company: 'InnovateTech',
    location: 'Addis Ababa',
    type: 'full-time',
    category: 'Business',
    salary: { min: 45000, max: 75000, currency: 'ETB', negotiable: true },
    requirements: ['4+ years product management', 'Technical background preferred', 'Strong leadership skills'],
    responsibilities: ['Define product roadmap', 'Coordinate cross-functional teams', 'Analyze market trends'],
    benefits: ['Stock options', 'Flexible schedule', 'Professional development budget'],
    experienceLevel: 'senior',
    educationRequired: 'Bachelor\'s Degree',
    skillsRequired: ['Product Strategy', 'Agile', 'Data Analysis', 'Leadership'],
    status: 'active'
  }
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Create a dummy user for posting jobs
    let dummyUser = await User.findOne({ email: 'admin@ethiojobfinder.com' });
    
    if (!dummyUser) {
      dummyUser = await User.create({
        name: 'EthioJobFinder Admin',
        email: 'admin@ethiojobfinder.com',
        password: 'admin123456',
        role: 'employer',
        companyName: 'EthioJobFinder'
      });
      console.log('Created dummy employer user');
    }

    // Add postedBy to each job and insert
    const jobsWithPoster = sampleJobs.map(job => ({
      ...job,
      postedBy: dummyUser._id
    }));

    await Job.insertMany(jobsWithPoster);
    console.log(`Successfully seeded ${jobsWithPoster.length} jobs`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding jobs:', error.message);
    process.exit(1);
  }
};

seedJobs();
