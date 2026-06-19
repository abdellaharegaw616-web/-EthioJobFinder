import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();

  const posts = {
    1: {
      title: 'How to Write a Resume That Gets You Hired in Ethiopia',
      excerpt: 'Learn the secrets to crafting a standout resume that Ethiopian employers love. From formatting tips to highlighting your skills effectively.',
      author: 'Helina Tadesse',
      date: 'Jan 15, 2026',
      readTime: '5 min read',
      category: 'Career Tips',
      image: 'bg-green-700',
      content: `
        <h2>Understanding the Ethiopian Job Market</h2>
        <p>The Ethiopian job market is competitive, and your resume is often the first impression you make on potential employers. A well-crafted resume can significantly increase your chances of landing interviews.</p>
        
        <h2>Key Resume Components</h2>
        <p>Your resume should include a clear objective, relevant work experience, education, skills, and references. Tailor each section to match the job requirements.</p>
        
        <h2>Formatting Tips</h2>
        <p>Use a clean, professional layout with consistent formatting. Keep it to 1-2 pages maximum. Use bullet points for easy readability.</p>
        
        <h2>Highlighting Your Skills</h2>
        <p>Focus on skills that are relevant to the position you're applying for. Include both technical and soft skills that demonstrate your value to potential employers.</p>
      `
    },
    2: {
      title: 'Top 10 In-Demand Skills for 2026',
      excerpt: 'Discover which skills are driving the Ethiopian job market and how you can acquire them to boost your career prospects.',
      author: 'Mulugeta Eshetu',
      date: 'Jan 12, 2026',
      readTime: '7 min read',
      category: 'Industry Insights',
      image: 'bg-green-700',
      content: `
        <h2>Digital Skills</h2>
        <p>Digital literacy is no longer optional. Skills in data analysis, digital marketing, and basic programming are highly sought after.</p>
        
        <h2>Language Skills</h2>
        <p>Proficiency in English and other international languages continues to be valuable for multinational companies operating in Ethiopia.</p>
        
        <h2>Project Management</h2>
        <p>Organizations need professionals who can manage projects efficiently, from planning to execution and monitoring.</p>
        
        <h2>Customer Service</h2>
        <p>Excellent customer service skills are essential across all industries, from hospitality to banking and telecommunications.</p>
      `
    },
    3: {
      title: 'Remote Work: A Guide for Ethiopian Professionals',
      excerpt: 'Everything you need to know about finding and succeeding in remote positions from Ethiopia, including tools and best practices.',
      author: 'Abraham Bekele',
      date: 'Jan 10, 2026',
      readTime: '6 min read',
      category: 'Remote Work',
      image: 'bg-green-600',
      content: `
        <h2>Finding Remote Opportunities</h2>
        <p>Many international companies now hire remote workers from Ethiopia. Platforms like EthioJobFinder list remote positions specifically for Ethiopian professionals.</p>
        
        <h2>Essential Tools</h2>
        <p>Familiarize yourself with collaboration tools like Slack, Zoom, Trello, and Google Workspace. These are standard in remote work environments.</p>
        
        <h2>Time Management</h2>
        <p>Working remotely requires strong time management skills. Set clear boundaries between work and personal time to maintain productivity.</p>
        
        <h2>Communication</h2>
        <p>Clear communication becomes even more critical in remote settings. Be proactive in updating your team and asking questions when needed.</p>
      `
    },
    4: {
      title: 'Employer Guide: How to Attract Top Talent',
      excerpt: 'Strategies for Ethiopian companies to stand out and attract the best candidates in a competitive job market.',
      author: 'Sage Training',
      date: 'Jan 8, 2026',
      readTime: '4 min read',
      category: 'Hiring',
      image: 'bg-gradient-to-br from-purple-400 to-blue-500',
      content: `
        <h2>Build Your Employer Brand</h2>
        <p>Showcase your company culture and values. Candidates want to work for organizations that align with their personal beliefs and career goals.</p>
        
        <h2>Competitive Compensation</h2>
        <p>Research market rates and offer competitive packages. Consider benefits beyond salary, such as professional development opportunities.</p>
        
        <h2>Streamlined Hiring Process</h2>
        <p>A lengthy hiring process can deter top talent. Keep your process efficient and provide timely feedback to candidates.</p>
        
        <h2>Invest in Onboarding</h2>
        <p>A strong onboarding program helps new hires integrate quickly and feel valued from day one.</p>
      `
    },
    5: {
      title: 'Interview Preparation: Common Questions & Answers',
      excerpt: 'Prepare for your next job interview with our comprehensive guide to commonly asked questions in Ethiopian workplaces.',
      author: 'Mary Joy Team',
      date: 'Jan 5, 2026',
      readTime: '8 min read',
      category: 'Career Tips',
      image: 'bg-gradient-to-br from-yellow-400 to-blue-500',
      content: `
        <h2>Tell Me About Yourself</h2>
        <p>Prepare a concise summary of your professional background, focusing on relevant experience and achievements.</p>
        
        <h2>Why Do You Want to Work Here?</h2>
        <p>Research the company beforehand and connect your goals with the company's mission and values.</p>
        
        <h2>What Are Your Strengths and Weaknesses?</h2>
        <p>Be honest but strategic. Choose strengths relevant to the job and weaknesses you're actively working to improve.</p>
        
        <h2>Where Do You See Yourself in 5 Years?</h2>
        <p>Show ambition while being realistic. Connect your career goals with opportunities for growth within the company.</p>
      `
    },
    6: {
      title: 'Tech Industry Boom in Addis Ababa',
      excerpt: 'An in-depth look at the growing tech ecosystem in Ethiopia\'s capital and opportunities for developers and designers.',
      author: 'Tech Ethiopia',
      date: 'Jan 3, 2026',
      readTime: '10 min read',
      category: 'Industry Insights',
      image: 'bg-gradient-to-br from-indigo-400 to-purple-500',
      content: `
        <h2>The Growing Ecosystem</h2>
        <p>Addis Ababa has seen significant growth in its tech sector, with startups and established companies alike expanding their operations.</p>
        
        <h2>Key Sectors</h2>
        <p>Fintech, e-commerce, and software development are leading the charge. Mobile solutions tailored to Ethiopian needs are particularly successful.</p>
        
        <h2>Opportunities for Developers</h2>
        <p>Full-stack developers, mobile app developers, and data scientists are in high demand. Remote work opportunities with international companies are also increasing.</p>
        
        <h2>Education and Training</h2>
        <p>Universities and bootcamps are expanding their tech programs. Continuous learning is essential to stay competitive in this rapidly evolving field.</p>
      `
    }
  };

  const post = posts[id];

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link to="/blog" className="text-green-700 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className={`h-64 ${post.image} relative`}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-4xl mx-auto px-4 h-full flex items-center">
          <div>
            <Link to="/blog" className="inline-flex items-center gap-2 text-white mb-4 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
