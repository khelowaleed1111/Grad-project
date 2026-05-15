import React from 'react';
import Button from '../components/ui/Button';

export default function About() {
  return (
    <div className="min-h-screen bg-[#fbf9f8] pt-24 pb-16">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#fcab28] mb-2">Our Story</p>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1b1c1c] mb-6">
              Redefining Real Estate in Egypt
            </h1>
            <p className="text-lg text-[#41493e] leading-relaxed mb-6">
              Aqar is more than just a property portal. We are a technology-driven ecosystem designed to bring transparency, efficiency, and premium service to the Egyptian real estate market.
            </p>
            <p className="text-[#41493e] leading-relaxed mb-8">
              Founded with the vision of simplifying property transactions, Aqar connects verified buyers, sellers, and renters through a seamless digital experience. Whether you're searching for a modern apartment in New Cairo or a luxury villa on the North Coast, we provide the platform to find it.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-3xl font-bold text-[#1b5e20] mb-1">10k+</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#717a6d]">Verified Listings</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#1b5e20] mb-1">50k+</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-[#717a6d]">Happy Users</p>
              </div>
            </div>

            <Button to="/search" size="lg" iconRight="arrow_forward">
              Explore Listings
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-ambient-3 border border-[#c0c9bb]">
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000" 
                alt="Luxury Property" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-ambient-2 border border-[#c0c9bb] max-w-xs hidden md:block">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#1b5e20]">verified</span>
                </div>
                <h4 className="font-bold text-[#1b1c1c]">Trust & Quality</h4>
              </div>
              <p className="text-sm text-[#41493e]">
                Every listing on Aqar undergoes a strict verification process to ensure accuracy and safety.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-[#c0c9bb] shadow-sm hover:shadow-ambient-1 transition-all">
            <span className="material-symbols-outlined text-4xl text-[#fcab28] mb-4">visibility</span>
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-3">Our Vision</h3>
            <p className="text-sm text-[#41493e] leading-relaxed">
              To be the most trusted and preferred digital destination for real estate in Egypt and the region.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#c0c9bb] shadow-sm hover:shadow-ambient-1 transition-all">
            <span className="material-symbols-outlined text-4xl text-[#1b5e20] mb-4">rocket_launch</span>
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-sm text-[#41493e] leading-relaxed">
              To empower property seekers and owners with smart tools, verified data, and a seamless transaction experience.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#c0c9bb] shadow-sm hover:shadow-ambient-1 transition-all">
            <span className="material-symbols-outlined text-4xl text-[#00450d] mb-4">groups</span>
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-3">Our Community</h3>
            <p className="text-sm text-[#41493e] leading-relaxed">
              We foster a community of professionals and seekers built on trust, transparency, and mutual success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
