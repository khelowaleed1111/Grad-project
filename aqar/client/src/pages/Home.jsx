import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../api/propertiesApi';
import PropertyCard from '../components/property/PropertyCard';
import Spinner from '../components/ui/Spinner';

const HERO_BG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600';

const STATS = [
  { icon: 'apartment', value: '10K+', label: 'Properties Listed' },
  { icon: 'location_city', value: '15+', label: 'Cities Covered' },
  { icon: 'people', value: '50K+', label: 'Registered Users' },
  { icon: 'verified', value: '100%', label: 'Verified Listings' },
];

const TYPES = [
  { icon: 'home', label: 'Residential', value: 'residential', desc: 'Apartments, Villas & More' },
  { icon: 'store', label: 'Commercial', value: 'commercial', desc: 'Offices, Shops & Retail' },
  { icon: 'landscape', label: 'Land', value: 'land', desc: 'Investment Plots' },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ keyword: '', status: 'sale', city: '' });

  const { data: featuredData, isLoading: featLoading } = useQuery({
    queryKey: ['featured'],
    queryFn: () => propertiesApi.getFeatured().then((r) => r.data),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.keyword) params.set('keyword', search.keyword);
    if (search.status) params.set('status', search.status);
    if (search.city) params.set('city', search.city);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────── */}
      <header
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url('${HERO_BG}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-6 w-full max-w-[900px] mx-auto flex flex-col items-center gap-6 mt-[-80px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-[#ffb957]/50 text-[#ffddb5] px-4 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-[16px] text-[#fcab28]">stars</span>
            <span className="text-xs font-bold uppercase tracking-widest">Egypt's #1 Premium Real Estate Platform</span>
          </div>

          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight">
            Find Your Perfect Property in Egypt
          </h1>
          <p className="text-white/90 text-lg max-w-[600px] drop-shadow-md">
            Discover high-value investments, heritage estates, and modern urban living spaces with unparalleled reliability.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-[800px] mt-4 bg-white rounded-2xl md:rounded-full p-3 md:p-2 flex flex-col md:flex-row items-center gap-3 md:gap-2 shadow-ambient-3"
          >
            <div className="flex-1 flex items-center px-4 py-2 w-full border-b md:border-b-0 md:border-r border-[#c0c9bb]">
              <span className="material-symbols-outlined text-[#717a6d] mr-2">search</span>
              <input
                type="text"
                value={search.keyword}
                onChange={(e) => setSearch((s) => ({ ...s, keyword: e.target.value }))}
                className="w-full bg-transparent border-none focus:ring-0 text-base text-[#1b1c1c] placeholder-[#717a6d] focus:outline-none"
                placeholder="Search by city, neighborhood, or reference..."
              />
            </div>
            <div className="flex items-center gap-2 px-2 w-full md:w-auto justify-between">
              <select
                value={search.status}
                onChange={(e) => setSearch((s) => ({ ...s, status: e.target.value }))}
                className="bg-transparent border-none focus:ring-0 text-sm text-[#41493e] cursor-pointer py-2 pl-2 pr-8 focus:outline-none"
              >
                <option value="sale">Buy</option>
                <option value="rent">Rent</option>
              </select>
              <select
                value={search.city}
                onChange={(e) => setSearch((s) => ({ ...s, city: e.target.value }))}
                className="bg-transparent border-none focus:ring-0 text-sm text-[#41493e] cursor-pointer py-2 pl-2 pr-8 border-l border-[#c0c9bb] focus:outline-none"
              >
                <option value="">All Cities</option>
                {['Cairo', 'Giza', 'Alexandria', 'Matrouh', '6th October'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-[#fcab28] text-[#694300] rounded-full p-3 hover:bg-[#ffb957] transition-colors flex items-center justify-center hover:-translate-y-0.5 transform shadow-sm flex-shrink-0"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </form>

          {/* Popular chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-white/80 text-sm mr-1">Popular:</span>
            {['New Cairo', 'Zamalek', 'North Coast', 'Sheikh Zayed'].map((city) => (
              <button
                key={city}
                onClick={() => navigate(`/search?city=${city}`)}
                className="bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm px-3 py-1 rounded-full text-sm transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Stats ────────────────────────────────── */}
      <section className="bg-[#1b5e20] py-12">
        <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <span className="material-symbols-outlined text-[#91d78a] text-[32px] block mb-2">{s.icon}</span>
              <div className="font-['Playfair_Display'] text-3xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-white/70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Property Types ───────────────────────── */}
      <section className="py-20 bg-[#fbf9f8]">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-[#fcab28] mb-2">Browse by Category</p>
            <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1b1c1c]">Explore Property Types</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TYPES.map((t) => (
              <Link
                key={t.value}
                to={`/search?type=${t.value}`}
                className="group bg-white border border-[#c0c9bb] rounded-2xl p-8 text-center hover:border-[#1b5e20] hover:shadow-ambient-2 transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-[#e8f5e9] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1b5e20] transition-colors">
                  <span className="material-symbols-outlined text-[28px] text-[#1b5e20] group-hover:text-white transition-colors">{t.icon}</span>
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1b1c1c] mb-1">{t.label}</h3>
                <p className="text-sm text-[#41493e]">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Listings ────────────────────── */}
      <section className="py-20 bg-[#f5f3f3]">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#fcab28] mb-2">Handpicked for You</p>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold text-[#1b1c1c]">Featured Properties</h2>
            </div>
            <Link
              to="/search?featured=true"
              className="hidden md:flex items-center gap-1 text-sm font-medium text-[#1b5e20] hover:underline"
            >
              View all <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          {featLoading ? (
            <Spinner center />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredData?.data || []).map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          )}

          {(featuredData?.data || []).length === 0 && !featLoading && (
            <div className="text-center py-16 text-[#41493e]">
              <span className="material-symbols-outlined text-[48px] text-[#c0c9bb] block mb-4">home_work</span>
              <p>No featured listings yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-24 bg-[#1b5e20]">
        <div className="max-w-[1140px] mx-auto px-6 text-center">
          <span className="material-symbols-outlined text-[#91d78a] text-[48px] block mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>real_estate_agent</span>
          <h2 className="font-['Playfair_Display'] text-4xl font-bold text-white mb-4">
            List Your Property Today
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
            Reach thousands of verified buyers and renters across Egypt. Join Aqar and list your property for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full px-4">
            <Link
              to="/register"
              className="w-full sm:w-auto text-center bg-[#fcab28] text-[#694300] px-8 py-4 rounded-full font-bold hover:bg-[#ffb957] transition-all hover:-translate-y-0.5 shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/search"
              className="w-full sm:w-auto text-center bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
