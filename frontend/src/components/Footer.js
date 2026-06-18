import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-green-700">
                EthioJobFinder
              </span>
            </Link>
            <p className="text-sm mb-4">
              Connecting Ethiopian talent with opportunities. Find your dream job or hire the best candidates.
            </p>
            <div className="flex gap-3">
              {[
                { name: 'telegram', url: 'https://t.me/ethiojobfinder', icon: 'T' },
                { name: 'linkedin', url: 'https://linkedin.com/company/ethiojobfinder', icon: 'L' },
                { name: 'instagram', url: 'https://instagram.com/ethiojobfinder', icon: 'I' },
                { name: 'twitter', url: 'https://twitter.com/ethiojobfinder', icon: 'X' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-500 transition"
                >
                  <span className="text-xs">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition">Find Work</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link to="/our-story" className="hover:text-white transition">Our Story</Link></li>
              <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/post-job" className="hover:text-white transition">Post a Job</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Recruit Talent</Link></li>
              <li><Link to="/help" className="hover:text-white transition">Employer FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <p className="text-sm mb-2">+125979567153</p>
            <a href="mailto:abdellaj636@gmail.com" className="text-sm underline hover:text-white block mb-2">
              abdellaj636@gmail.com
            </a>
            <p className="text-sm">Addis Ababa, Ethiopia</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-wrap justify-between items-center text-sm">
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/help" className="hover:text-white">Help Center</Link>
          </div>
          <p>© 2026 EthioJobFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
