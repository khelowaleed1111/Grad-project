import { useState, useEffect } from 'react';
import Button from '../ui/Button';

/**
 * PropertyFilters - Reusable filter component for property search
 * Emits filter changes to parent component
 */
export default function PropertyFilters({ filters = {}, onFilterChange, onReset, onApply }) {
  const [localFilters, setLocalFilters] = useState({
    status: '',
    type: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    rooms: '',
    minArea: '',
    maxArea: '',
    keyword: '',
    ...filters,
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Update local filters when parent filters change
  useEffect(() => {
    setLocalFilters((prev) => ({ ...prev, ...filters }));
  }, [filters]);

  const handleChange = (field, value) => {
    const updated = { ...localFilters, [field]: value };
    setLocalFilters(updated);
    onFilterChange?.(updated);
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      type: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      rooms: '',
      minArea: '',
      maxArea: '',
      keyword: '',
    };
    setLocalFilters(resetFilters);
    onReset?.();
  };

  const activeFilterCount = Object.values(localFilters).filter((v) => v !== '' && v !== null && v !== undefined).length;

  const inputClass = "w-full px-4 py-3 border-2 border-[#c0c9bb] rounded-xl text-base md:text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20] transition-colors bg-white placeholder-[#717a6d]";
  const labelClass = "block text-[11px] font-bold uppercase tracking-widest text-[#41493e] mb-2 ml-1 opacity-80";

  return (
    <div className="bg-white rounded-2xl border border-[#c0c9bb] shadow-ambient-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#c0c9bb] bg-[#f5f3f3]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1b5e20]">tune</span>
          <h3 className="font-semibold text-[#1b1c1c]">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-[#1b5e20] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="md:hidden p-1 text-[#41493e] hover:text-[#1b5e20] transition-colors"
          aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
        >
          <span className="material-symbols-outlined">
            {isCollapsed ? 'expand_more' : 'expand_less'}
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className={`p-4 space-y-4 ${isCollapsed ? 'hidden md:block' : ''}`}>
        {/* Keyword Search */}
        <div>
          <label className={labelClass}>Search</label>
          <div className="relative">
            <input
              type="text"
              value={localFilters.keyword}
              onChange={(e) => handleChange('keyword', e.target.value)}
              placeholder="Search by keyword..."
              className={inputClass}
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#717a6d] text-[18px]">
              search
            </span>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Listing Type</label>
          <div className="flex rounded-xl border-2 border-[#c0c9bb] overflow-hidden p-1 bg-[#f5f3f3]">
            {[
              { value: '', label: 'All' },
              { value: 'sale', label: 'Sale' },
              { value: 'rent', label: 'Rent' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange('status', option.value)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                  localFilters.status === option.value
                    ? 'bg-[#1b5e20] text-white shadow-sm'
                    : 'text-[#41493e] hover:bg-[#e4e2e1]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className={labelClass}>Property Type</label>
          <select
            value={localFilters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className={inputClass}
          >
            <option value="">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label className={labelClass}>City</label>
          <select
            value={localFilters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={inputClass}
          >
            <option value="">All Cities</option>
            {[
              'Cairo',
              'Giza',
              'Alexandria',
              'Matrouh',
              '6th October',
              'New Cairo',
              'Maadi',
              'Zamalek',
              'Sheikh Zayed',
              'Heliopolis',
            ].map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className={labelClass}>Price Range (EGP)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={localFilters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              placeholder="Min"
              min="0"
              className={inputClass}
            />
            <input
              type="number"
              value={localFilters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              placeholder="Max"
              min="0"
              className={inputClass}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className={labelClass}>Bedrooms</label>
          <div className="grid grid-cols-5 gap-2">
            {['', '1', '2', '3', '4+'].map((value) => (
              <button
                key={value || 'any'}
                type="button"
                onClick={() => handleChange('rooms', value === '4+' ? '4' : value)}
                className={`py-2.5 text-xs font-bold rounded-xl border-2 transition-colors ${
                  localFilters.rooms === (value === '4+' ? '4' : value)
                    ? 'border-[#1b5e20] bg-[#e8f5e9] text-[#1b5e20]'
                    : 'border-[#c0c9bb] text-[#41493e] hover:bg-[#f5f3f3]'
                }`}
              >
                {value || 'Any'}
              </button>
            ))}
          </div>
        </div>

        {/* Area Range */}
        <div>
          <label className={labelClass}>Area (m²)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={localFilters.minArea}
              onChange={(e) => handleChange('minArea', e.target.value)}
              placeholder="Min"
              min="0"
              className={inputClass}
            />
            <input
              type="number"
              value={localFilters.maxArea}
              onChange={(e) => handleChange('maxArea', e.target.value)}
              placeholder="Max"
              min="0"
              className={inputClass}
            />
          </div>
        </div>

        {/* Reset & Apply Buttons */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#c0c9bb]/50">
          {activeFilterCount > 0 && (
            <Button
              variant="text"
              onClick={handleReset}
              fullWidth
              size="md"
              icon="restart_alt"
              className="text-[#41493e]"
            >
              Reset Filters
            </Button>
          )}
          
          <Button
            onClick={onApply}
            className="lg:hidden"
            fullWidth
            size="lg"
            icon="check"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
