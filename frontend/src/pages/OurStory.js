import { Heart, Target, Users, Globe, Award, TrendingUp } from 'lucide-react';

const OurStory = () => {
  const milestones = [
    { year: '2020', title: 'The Beginning', desc: 'EthioJobFinder started with a simple mission: connect Ethiopian talent with opportunity.' },
    { year: '2021', title: 'First 1,000 Jobs', desc: 'We reached our first milestone of 1,000 successful job placements across Addis Ababa.' },
    { year: '2022', title: 'Going Nationwide', desc: 'Expanded our reach to all major cities in Ethiopia, bringing opportunity to every region.' },
    { year: '2023', title: 'AI Integration', desc: 'Launched our AI-powered resume builder and job matching system.' },
    { year: '2024', title: '100K Milestone', desc: 'Celebrated 100,000 successful job placements and 15,000+ registered employers.' },
    { year: '2025', title: 'The Future', desc: 'Continuing to innovate and empower the Ethiopian workforce with technology.' }
  ];

  const values = [
    { icon: Heart, title: 'Passion for People', desc: 'We believe everyone deserves meaningful work that fulfills them.' },
    { icon: Target, title: 'Excellence', desc: 'We strive for the highest quality in everything we do.' },
    { icon: Users, title: 'Community First', desc: 'Ethiopian job seekers and employers are at the heart of our platform.' },
    { icon: Globe, title: 'Accessibility', desc: 'Making job opportunities accessible to everyone, everywhere in Ethiopia.' },
    { icon: Award, title: 'Integrity', desc: 'We verify every employer and maintain the highest ethical standards.' },
    { icon: TrendingUp, title: 'Innovation', desc: 'Constantly improving our platform with cutting-edge technology.' }
  ];

  const team = [
    { name: 'Helina Tadesse', role: 'Founder & CEO', image: 'bg-green-700' },
    { name: 'Mulugeta Eshetu', role: 'Head of Operations', image: 'bg-gradient-to-br from-blue-400 to-indigo-500' },
    { name: 'Abraham Bekele', role: 'CTO', image: 'bg-gradient-to-br from-green-400 to-teal-500' },
    { name: 'Saron Girma', role: 'Head of Marketing', image: 'bg-green-700' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our{' '}
            <span className="text-green-700">
              Story
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Building bridges between Ethiopian talent and opportunity. 
            From a small idea to Ethiopia's leading job platform.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                EthioJobFinder was born from a simple observation: talented Ethiopians were struggling to find 
                meaningful work, while employers couldn't find the right talent. We set out to bridge this gap.
              </p>
              <p className="text-gray-600 mb-4">
                Today, we're Ethiopia's fastest-growing job platform, connecting thousands of job seekers 
                with employers every day. But we're more than just a job board – we're a career partner.
              </p>
              <p className="text-gray-600">
                Our AI-powered tools help candidates showcase their skills, while our verified employer 
                network ensures every opportunity is legitimate and worthwhile.
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-700">100K+</p>
                  <p className="text-gray-600">Jobs Filled</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-500">15K+</p>
                  <p className="text-gray-600">Employers</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-500">300K+</p>
                  <p className="text-gray-600">Job Seekers</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-500">50+</p>
                  <p className="text-gray-600">Sectors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-2xl font-bold text-green-700">{milestone.year}</span>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-green-700 rounded-full mt-2" />
                <div className="flex-grow pb-8 border-l-2 border-gray-200 pl-6 -ml-2.5">
                  <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Values</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            These principles guide everything we do at EthioJobFinder
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-green-700" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Passionate Ethiopians dedicated to empowering our workforce
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className={`w-32 h-32 ${member.image} rounded-full mx-auto mb-4`} />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Story</h2>
          <p className="text-gray-600 mb-8">
            Whether you're looking for your next career move or searching for talent, 
            we're here to help you succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/jobs"
              className="px-8 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition"
            >
              Find Work
            </a>
            <a 
              href="/pricing"
              className="px-8 py-3 border-2 border-gray-800 rounded-full font-medium hover:bg-gray-800 hover:text-white transition"
            >
              Start Hiring
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStory;
