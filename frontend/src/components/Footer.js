import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1e2022] dark:bg-black text-gray-300 py-14 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 5 Column Grid matching Screenshot 5 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <h3 className="text-white text-base font-bold mb-4">About</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/our-story" className="hover:text-white transition">About us</Link></li>
              <li><Link to="/help" className="hover:text-white transition">how it works</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/help" className="hover:text-white transition">accessibility</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">advertising</Link></li>
            </ul>
          </div>

          {/* Column 2: Terms */}
          <div>
            <h3 className="text-white text-base font-bold mb-4">Terms</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms and Conditions</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Copyright Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Code of Conduct</Link></li>
            </ul>
          </div>

          {/* Column 3: contact me */}
          <div>
            <h3 className="text-white text-base font-bold mb-4">contact me</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="mailto:aserhailu2020@gmail.com" className="hover:text-orange-400 transition break-all">
                  aserhailu2020@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+251953101912" className="hover:text-orange-400 transition">
                  +251953101912
                </a>
              </li>
              <li className="text-xs leading-relaxed text-gray-400 pt-1">
                AASTU, Tulu Dimtu, Addis Ababa, Ethiopia
              </li>
            </ul>
          </div>

          {/* Column 4: Job seekers */}
          <div>
            <h3 className="text-white text-base font-bold mb-4">Job seekers</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/jobs" className="hover:text-white transition">Find Jobs</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Register</Link></li>
              <li><Link to="/resume-builder" className="hover:text-white transition">post CV</Link></li>
              <li><Link to="/job-alerts" className="hover:text-white transition">Job Alerts</Link></li>
            </ul>
          </div>

          {/* Column 5: work with us */}
          <div>
            <h3 className="text-white text-base font-bold mb-4">work with us</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/help" className="hover:text-white transition">Contact Admin</Link></li>
              <li><Link to="/register?type=employer" className="hover:text-white transition">Become partner</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition">Explore</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Code of Conduct</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright matching Screenshot 5 */}
        <div className="border-t border-gray-800/80 pt-8 text-center text-xs text-gray-500 space-y-2">
          <p>
            EthioJobFinder ® is a registered Trademark of EthioJobFinder Technology Limited
          </p>
          <p>
            Copyright © 2026 EthioJobFinder Technology Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
