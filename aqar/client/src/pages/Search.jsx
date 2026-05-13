import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../api/propertiesApi';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilters from '../components/property/PropertyFilters';
import MapView from '../components/map/MapView';
import Spinner from '../components/ui/Spinner';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMap, setShowMap] = useState(true);
  const [keywordInput, setKeywordInput] = useState(searchParams.get('keyword') || '');

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    status: searchParams.get('status') || '',
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rooms: searchParams.get('rooms') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    bounds: searchParams.get('bounds') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  // Debounce keyword search by 300ms (Requirement 22.5)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (keywordInput !== filters.keyword) {
        setFilters((f) => ({ ...f, keyword: keywordInput, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [keywordInput]);

  // Sync filters → URL
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== 1) params[k] = v; });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const queryParams = useMemo(() => ({ ...filters, limit: 12 }), [filters]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['properties', queryParams],
    queryFn: () => propertiesApi.getAll(queryParams).then((r) => r.data),
    keepPreviousData: true,
  });

  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }));

  // Handle map bounds change (Requirement 23.6)
  const handleBoundsChange = useCallback((boundsString) => {
    setFilters((f) => ({ ...f, bounds: boundsString, page: 1 }));
  }, []);

  // Handle marker click - navigate to property detail
  const handleMarkerClick = useCallback((propertyId) => {
    window.open(`/properties/${propertyId}`, '_blank');
  }, []);

  // Handle filter changes from PropertyFilters component
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((f) => ({ ...f, ...newFilters, page: 1 }));
  }, []);

  // Handle filter reset
  const handleFilterReset = useCallback(() => {
    setFilters({
      keyword: '',
      status: '',
      type: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      rooms: '',
      minArea: '',
      maxArea: '',
      bounds: '',
      sort: 'newest',
      page: 1,
    });
    setKeywordInput('');
  }, []);

  const properties = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
  const total = data?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  // Debug logging
  console.log('Search Page Debug:', {
    hasData: !!data,
    dataKeys: data ? Object.keys(data) : [],
    dataDataIsArray: Array.isArray(data?.data),
    propertiesLength: properties.length,
    total,
    firstProperty: properties[0]?.title
  });

  return (
    <div className="min-h-screen bg-[#fbf9f8] pt-[72px]">
      {/* Top search bar */}
      <div className="bg-white border-b border-[#c0c9bb] sticky top-[72px] z-30 shadow-ambient-1">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 min-w-[200px] w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717a6d] text-[20px]">search</span>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Search by title, city, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#c0c9bb] rounded-full text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20] bg-[#f5f3f3]"
            />
          </div>

          {/* Status toggle */}
          <div className="flex rounded-full border border-[#c0c9bb] overflow-hidden w-full md:w-auto">
            {['', 'sale', 'rent'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter('status', s)}
                className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  filters.status === s ? 'bg-[#1b5e20] text-white' : 'text-[#41493e] hover:bg-[#f0eded]'
                }`}
              >
                {s === '' ? 'All' : s === 'sale' ? 'Buy' : 'Rent'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => setFilter('sort', e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 border border-[#c0c9bb] rounded-full text-sm text-[#41493e] bg-white focus:outline-none focus:border-[#1b5e20]"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Map toggle */}
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center justify-center gap-1.5 w-full md:w-auto px-4 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-colors ${
              showMap ? 'bg-[#1b5e20] text-white border-[#1b5e20]' : 'border-[#c0c9bb] text-[#41493e] hover:bg-[#f0eded]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">map</span>
            Map
          </button>
        </div>
      </div>

      {/* Main content: Filters + Map/List */}
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar: Filters */}
          <aside className="lg:col-span-3">
            <div className="sticky top-[140px]">
              <PropertyFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleFilterReset}
              />
            </div>
          </aside>

          {/* Right content: Map + Property Grid */}
          <div className="lg:col-span-9 space-y-6">
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#41493e]">
                Showing{' '}
                <span className="font-bold text-[#00450d]">{properties.length}</span>
                {' '}of{' '}
                <span className="font-bold text-[#00450d]">{total}</span>
                {' '}properties
                {isFetching && !isLoading && (
                  <span className="ml-2 inline-block w-4 h-4 border-2 border-[#c0c9bb] border-t-[#1b5e20] rounded-full animate-spin align-middle" />
                )}
              </p>
            </div>

            {/* Map View (Requirement 23.1, 23.2, 23.3, 23.6) */}
            {showMap && (
              <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-ambient-2 border border-[#c0c9bb]">
                <MapView
                  properties={properties}
                  onBoundsChange={handleBoundsChange}
                  onMarkerClick={handleMarkerClick}
                />
              </div>
            )}

            {/* Loading state (Requirement 22.6) */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#c0c9bb] animate-pulse">
                    <div className="h-48 bg-[#f0eded]" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-[#f0eded] rounded w-3/4" />
                      <div className="h-3 bg-[#f0eded] rounded w-1/2" />
                      <div className="h-6 bg-[#f0eded] rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              // No properties found (Requirement 22.7)
              <div className="text-center py-24">
                <span className="material-symbols-outlined text-[64px] text-[#c0c9bb] block mb-4">search_off</span>
                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c] mb-2">No properties found</h3>
                <p className="text-[#41493e] mb-6">Try adjusting your filters or search a different city.</p>
                <button
                  onClick={handleFilterReset}
                  className="bg-[#1b5e20] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00450d] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      disabled={filters.page <= 1}
                      onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                      className="flex items-center gap-1 px-4 py-2 border border-[#c0c9bb] rounded-lg text-sm text-[#41493e] hover:bg-[#f0eded] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      Prev
                    </button>
                    <span className="text-sm text-[#41493e] px-4">
                      Page <span className="font-bold text-[#00450d]">{filters.page}</span> of {totalPages}
                    </span>
                    <button
                      disabled={filters.page >= totalPages}
                      onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                      className="flex items-center gap-1 px-4 py-2 border border-[#c0c9bb] rounded-lg text-sm text-[#41493e] hover:bg-[#f0eded] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
