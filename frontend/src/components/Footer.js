import { Link } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Telegram',
      letter: 'T',
      url: 'https://t.me/ethiojobfinder',
      hoverClass: 'hover:bg-[#229ED9] hover:border-[#229ED9] hover:text-white',
    },
    {
      name: 'LinkedIn',
      letter: 'L',
      url: 'https://linkedin.com/company/ethiojobfinder',
      hoverClass: 'hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white',
    },
    {
      name: 'Instagram',
      letter: 'I',
      url: 'https://instagram.com/ethiojobfinder',
      hoverClass: 'hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white',
    },
    {
      name: 'Twitter (X)',
      letter: 'X',
      url: 'https://twitter.com/ethiojobfinder',
      hoverClass: 'hover:bg-white hover:border-white hover:text-black',
    },
  ];

  return (
    <footer className="bg-black text-gray-400 py-12 mt-auto border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Brand + 3 Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-10">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="flex items-center gap-1 text-orange-500">
                <MapPin className="w-5 h-5 transition-transform group-hover:scale-110" />
                <Briefcase className="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-orange-500 leading-tight">Ethio</span>
                <span className="text-base font-bold text-orange-500 leading-tight">JobFinder</span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Connecting Ethiopian talent with opportunities. Find your dream job or hire the best candidates.
            </p>

            {/* Social Circular Badges (T, L, I, X) */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  aria-label={social.name}
                  className={`w-9 h-9 rounded-full bg-[#1b2735] border border-gray-700/60 flex items-center justify-center text-gray-300 font-semibold text-xs transition-all duration-200 shadow-sm ${social.hoverClass}`}
                >
                  {social.letter}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/jobs" className="hover:text-white transition duration-150 inline-block">
                  Find Work
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition duration-150 inline-block">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition duration-150 inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-white transition duration-150 inline-block">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/help" className="hover:text-white transition duration-150 inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="hover:text-white transition duration-150 inline-block">
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/terms" className="hover:text-white transition duration-150 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition duration-150 inline-block">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Border & Copyright */}
        <div className="border-t border-gray-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 EthioJobFinder. All rights reserved.</p>
          <div className="flex items-center gap-6 text-gray-400">
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/help" className="hover:text-white transition">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
