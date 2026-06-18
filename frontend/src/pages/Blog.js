import { Calendar, Clock, ArrowRight, User } from 'lucide-react';

const Blog = () => {

  const posts = [
    {
      id: 1,
      title: 'How to Write a Resume That Gets You Hired in Ethiopia',
      excerpt: 'Learn the secrets to crafting a standout resume that Ethiopian employers love. From formatting tips to highlighting your skills effectively.',
      author: 'Helina Tadesse',
      date: 'Jan 15, 2026',
      readTime: '5 min read',
      category: 'Career Tips',
      image: 'bg-gradient-to-br from-green-400 to-yellow-500'
    },
    {
      id: 2,
      title: 'Top 10 In-Demand Skills for 2026',
      excerpt: 'Discover which skills are driving the Ethiopian job market and how you can acquire them to boost your career prospects.',
      author: 'Mulugeta Eshetu',
      date: 'Jan 12, 2026',
      readTime: '7 min read',
      category: 'Industry Insights',
      image: 'bg-gradient-to-br from-green-400 to-yellow-500'
    },
    {
      id: 3,
      title: 'Remote Work: A Guide for Ethiopian Professionals',
      excerpt: 'Everything you need to know about finding and succeeding in remote positions from Ethiopia, including tools and best practices.',
      author: 'Abraham Bekele',
      date: 'Jan 10, 2026',
      readTime: '6 min read',
      category: 'Remote Work',
      image: 'bg-gradient-to-br from-green-400 to-amber-500'
    },
    {
      id: 4,
      title: 'Employer Guide: How to Attract Top Talent',
      excerpt: 'Strategies for Ethiopian companies to stand out and attract the best candidates in a competitive job market.',
      author: 'Sage Training',
      date: 'Jan 8, 2026',
      readTime: '4 min read',
      category: 'Hiring',
      image: 'bg-gradient-to-br from-purple-400 to-blue-500'
    },
    {
      id: 5,
      title: 'Interview Preparation: Common Questions & Answers',
      excerpt: 'Prepare for your next job interview with our comprehensive guide to commonly asked questions in Ethiopian workplaces.',
      author: 'Mary Joy Team',
      date: 'Jan 5, 2026',
      readTime: '8 min read',
      category: 'Career Tips',
      image: 'bg-gradient-to-br from-yellow-400 to-blue-500'
    },
    {
      id: 6,
      title: 'Tech Industry Boom in Addis Ababa',
      excerpt: 'An in-depth look at the growing tech ecosystem in Ethiopia\'s capital and opportunities for developers and designers.',
      author: 'Tech Ethiopia',
      date: 'Jan 3, 2026',
      readTime: '10 min read',
      category: 'Industry Insights',
      image: 'bg-gradient-to-br from-indigo-400 to-purple-500'
    }
  ];

  const categories = ['All', 'Career Tips', 'Industry Insights', 'Remote Work', 'Hiring'];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EthioJobFinder{' '}
            <span className="bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Career advice, industry insights, and tips to help you succeed in the Ethiopian job market.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                className="px-6 py-2 rounded-full border hover:bg-gray-50 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className={`h-48 ${post.image}`} />
                <div className="p-6">
                  <span className="text-sm text-pink-500 font-medium">{post.category}</span>
                  <h3 className="text-xl font-bold mt-2 mb-3">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
                  </div>
                  <button className="flex items-center gap-2 text-pink-500 font-medium hover:gap-3 transition">
                    Read More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8">Get the latest career tips and job market insights delivered to your inbox.</p>
          <form className="flex flex-wrap justify-center gap-3">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full text-gray-900 w-80"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full font-medium hover:shadow-lg transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Blog;
