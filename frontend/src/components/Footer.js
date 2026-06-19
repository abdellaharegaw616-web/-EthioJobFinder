import { Link } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-6 h-6 text-green-700" />
                <Briefcase className="w-6 h-6 text-green-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-green-700 leading-tight">Ethio</span>
                <span className="text-lg font-bold text-green-700 leading-tight">JobFinder</span>
              </div>
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
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-700 transition"
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
              <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/our-story" className="hover:text-white transition">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
              <li><Link to="/forgot-password" className="hover:text-white transition">Reset Password</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-wrap justify-between items-center text-sm">
          <p>© 2026 EthioJobFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
