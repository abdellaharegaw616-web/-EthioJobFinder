import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Telegram',
      url: 'https://t.me/ethiojobfinder',
      color: 'hover:text-[#229ED9] hover:border-[#229ED9]/50 hover:bg-[#229ED9]/10',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      )
    },
    {
      name: 'Twitter (X)',
      url: 'https://twitter.com/ethiojobfinder',
      color: 'hover:text-white hover:border-white/50 hover:bg-white/10',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/ethiojobfinder',
      color: 'hover:text-[#E4405F] hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/ethiojobfinder',
      color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/ethiojobfinder',
      color: 'hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#121316] dark:bg-black text-gray-300 py-16 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 5 Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 tracking-wide">About</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/our-story" className="hover:text-white transition duration-150 inline-block">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/help#how-it-works" className="hover:text-white transition duration-150 inline-block">
                  how it works
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition duration-150 inline-block">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-white transition duration-150 inline-block">
                  accessibility
                </Link>
              </li>
              <li>
                <Link to="/pricing#advertising" className="hover:text-white transition duration-150 inline-block">
                  advertising
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Terms */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 tracking-wide">Terms</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition duration-150 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition duration-150 inline-block">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/terms#copyright" className="hover:text-white transition duration-150 inline-block">
                  Copyright Policy
                </Link>
              </li>
              <li>
                <Link to="/terms#code-of-conduct" className="hover:text-white transition duration-150 inline-block">
                  Code of Conduct
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: contact me */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 tracking-wide">contact me</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a 
                  href="mailto:aserhailu2020@gmail.com" 
                  className="flex items-center gap-1.5 hover:text-orange-400 transition duration-150 break-all"
                  title="Send email to aserhailu2020@gmail.com"
                >
                  <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>aserhailu2020@gmail.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+251953101912" 
                  className="flex items-center gap-1.5 hover:text-orange-400 transition duration-150"
                  title="Call +251953101912"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>+251953101912</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=AASTU+Addis+Ababa+Ethiopia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-1.5 text-xs leading-relaxed text-gray-400 hover:text-white transition duration-150 pt-1"
                  title="Open location in Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span>AASTU, Tulu Dimtu, Addis Ababa, Ethiopia</span>
                </a>
              </li>
            </ul>

            {/* Quick mini-social links under contact me */}
            <div className="flex items-center gap-2 pt-4">
              {socialLinks.slice(0, 4).map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className={`w-8 h-8 rounded-full bg-gray-800/80 border border-gray-700/60 flex items-center justify-center text-gray-300 transition-all duration-200 ${s.color}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Job seekers */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 tracking-wide">Job seekers</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link to="/jobs" className="hover:text-white transition duration-150 inline-block">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition duration-150 inline-block">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/resume-builder" className="hover:text-white transition duration-150 inline-block">
                  post CV
                </Link>
              </li>
              <li>
                <Link to="/job-alerts" className="hover:text-white transition duration-150 inline-block">
                  Job Alerts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: work with us */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 tracking-wide">work with us</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a 
                  href="mailto:aserhailu2020@gmail.com?subject=Contact%20Admin%20-%20EthioJobFinder" 
                  className="hover:text-white transition duration-150 inline-block"
                >
                  Contact Admin
                </a>
              </li>
              <li>
                <Link to="/register?type=employer" className="hover:text-white transition duration-150 inline-block">
                  Become partner
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition duration-150 inline-block">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/terms#code-of-conduct" className="hover:text-white transition duration-150 inline-block">
                  Code of Conduct
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Connect Strip */}
        <div className="border-t border-gray-800/80 pt-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-gray-400">
              Connect With Us:
            </span>
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 flex items-center gap-2 text-xs font-medium text-gray-300 transition-all duration-200 ${s.color}`}
                >
                  {s.icon}
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link to="/help" className="hover:text-white transition">Help Center</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          </div>
        </div>

        {/* Legal & Trademark Notice */}
        <div className="border-t border-gray-800/60 pt-6 text-center text-xs text-gray-400 space-y-1.5">
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
