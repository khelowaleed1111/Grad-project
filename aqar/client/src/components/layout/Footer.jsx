import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1b1c1c] text-white pt-16 pb-8 overflow-hidden">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="material-symbols-outlined filled text-[32px] text-[#91d78a]" style={{ fontVariationSettings: "'FILL' 1" }}>real_estate_agent</span>
              <span className="font-['Playfair_Display'] text-2xl font-bold">Aqar</span>
            </Link>
            <p className="text-[#c0c9bb] text-sm leading-relaxed max-w-xs">
              Egypt's most trusted real estate platform. We simplify your journey to finding, buying, or renting the perfect property through verified listings and smart tools.
            </p>
            <div className="flex items-center gap-4">
              {['facebook', 'instagram', 'twitter', 'linkedin'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-10 h-10 rounded-full border border-[#c0c9bb]/20 flex items-center justify-center hover:bg-[#1b5e20] hover:border-[#1b5e20] transition-all"
                >
                  <i className={`fa-brands fa-${social} text-sm`}></i>
                  {/* Fallback to text if font-awesome is missing */}
                  <span className="sr-only">{social}</span>
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold text-lg mb-6">Explore</h4>
            <ul className="space-y-4">
              {[
                { label: 'Browse Properties', to: '/search' },
                { label: 'New Developments', to: '/search?type=new' },
                { label: 'Popular Areas', to: '/#popular' },
                { label: 'List Your Property', to: '/dashboard/listings/new' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[#c0c9bb] hover:text-[#91d78a] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { label: 'About Aqar', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[#c0c9bb] hover:text-[#91d78a] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[#c0c9bb]">
                <span className="material-symbols-outlined text-[20px] text-[#91d78a]">location_on</span>
                <span className="text-sm">Cairo, Egypt</span>
              </li>
              <li className="flex items-start gap-3 text-[#c0c9bb]">
                <span className="material-symbols-outlined text-[20px] text-[#91d78a]">phone_iphone</span>
                <span className="text-sm">01125474066</span>
              </li>
              <li className="flex items-start gap-3 text-[#c0c9bb]">
                <span className="material-symbols-outlined text-[20px] text-[#91d78a]">mail</span>
                <span className="text-sm">khelowaleed@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#c0c9bb]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#c0c9bb] text-xs">
            © {currentYear} Aqar Real Estate Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/sitemap" className="text-[#c0c9bb] hover:text-white text-xs transition-colors">Sitemap</Link>
            <Link to="/cookies" className="text-[#c0c9bb] hover:text-white text-xs transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
