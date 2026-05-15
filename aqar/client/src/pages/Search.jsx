import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../api/propertiesApi';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilters from '../components/property/PropertyFilters';
import MapView from '../components/map/MapView';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMap, setShowMap] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
    setMobileFiltersOpen(false);
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
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] w-full md:w-auto">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717a6d] text-[20px]">search</span>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#c0c9bb] rounded-full text-sm text-[#1b1c1c] focus:outline-none focus:border-[#1b5e20] bg-[#f5f3f3]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {/* Mobile filter button */}
            <Button
              onClick={() => setMobileFiltersOpen(true)}
              variant="outline"
              size="sm"
              icon="tune"
              className="lg:hidden whitespace-nowrap"
            >
              Filters
              {Object.values(filters).filter(v => v !== '' && v !== 1 && v !== 'newest' && v !== null).length > 0 && (
                <span className="w-2 h-2 bg-[#1b5e20] rounded-full"></span>
              )}
            </Button>

            {/* Status toggle */}
            <div className="flex rounded-full border border-[#c0c9bb] overflow-hidden flex-shrink-0">
              {['', 'sale', 'rent'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter('status', s)}
                  className={`px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
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
              className="px-4 py-2.5 border border-[#c0c9bb] rounded-full text-xs font-bold uppercase tracking-wider text-[#41493e] bg-white focus:outline-none focus:border-[#1b5e20] flex-shrink-0"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Map toggle */}
            <Button
              onClick={() => setShowMap(!showMap)}
              variant={showMap ? 'primary' : 'outline'}
              size="sm"
              icon="map"
              className="flex-shrink-0"
            >
              Map
            </Button>
          </div>
        </div>
      </div>

      {/* Main content: Filters + Map/List */}
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar: Filters (Desktop) / Drawer (Mobile) */}
          <aside className={`fixed inset-0 z-50 lg:relative lg:z-0 lg:block lg:col-span-3 transition-transform duration-300 ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            {/* Backdrop */}
            <div 
              className={`fixed inset-0 bg-black/50 lg:hidden transition-opacity duration-300 ${mobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setMobileFiltersOpen(false)}
            />
            
            <div className="relative w-[85%] max-w-[320px] h-full lg:w-full lg:max-w-none lg:h-auto bg-[#fbf9f8] lg:bg-transparent overflow-y-auto lg:overflow-visible shadow-xl lg:shadow-none flex flex-col">
              <div className="sticky top-0 lg:top-[140px] p-6 lg:p-0 flex flex-col h-full lg:h-auto">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c]">Filters</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-[#41493e] hover:bg-[#f0eded] rounded-full transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <PropertyFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleFilterReset}
                  onApply={() => setMobileFiltersOpen(false)}
                />
              </div>
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
                <Button
                  onClick={handleFilterReset}
                  size="lg"
                  icon="refresh"
                >
                  Clear Filters
                </Button>
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
                    <Button
                      disabled={filters.page <= 1}
                      onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                      variant="outline"
                      size="sm"
                      icon="chevron_left"
                    >
                      Prev
                    </Button>
                    <span className="text-sm text-[#41493e] px-4">
                      Page <span className="font-bold text-[#00450d]">{filters.page}</span> of {totalPages}
                    </span>
                    <Button
                      disabled={filters.page >= totalPages}
                      onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                      variant="outline"
                      size="sm"
                      iconRight="chevron_right"
                    >
                      Next
                    </Button>
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
