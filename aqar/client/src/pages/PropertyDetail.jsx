import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { propertiesApi } from '../api/propertiesApi';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/property/PropertyCard';
import PropertyGallery from '../components/property/PropertyGallery';
import MapView from '../components/map/MapView';
import Spinner from '../components/ui/Spinner';
import { toast } from 'react-toastify';

const formatPrice = (p, status) =>
  new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(p) +
  (status === 'rent' ? '/mo' : '');

export default function PropertyDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesApi.getById(id).then((r) => r.data),
  });

  const { data: similarData } = useQuery({
    queryKey: ['similar', id],
    queryFn: () => propertiesApi.getSimilar(id).then((r) => r.data),
    enabled: !!id,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (formData) => propertiesApi.sendInquiry(id, formData),
    onSuccess: () => {
      toast.success('Inquiry sent successfully!');
      reset();
      setInquiryOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to send inquiry'),
  });

  const onInquire = (data) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to send an inquiry');
      navigate('/login');
      return;
    }
    mutation.mutate(data);
  };

  if (isLoading) return <div className="pt-[72px]"><Spinner center /></div>;
  
  // 404 error if property not found (Requirement 24.8)
  if (error) return (
    <div className="pt-[72px] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <span className="material-symbols-outlined text-[64px] text-[#c0c9bb] block mb-4">error</span>
        <h2 className="text-xl font-bold text-[#1b1c1c] mb-2">Property not found</h2>
        <Link to="/search" className="text-[#1b5e20] hover:underline">← Back to Search</Link>
      </div>
    </div>
  );

  const property = data?.data;
  if (!property) return null;

  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'];
  
  // Prepare map center from property coordinates (Requirement 24.4)
  const mapCenter = property.location?.coordinates?.lat && property.location?.coordinates?.lng
    ? { lat: property.location.coordinates.lat, lng: property.location.coordinates.lng }
    : null;

  return (
    <div className="min-h-screen bg-[#fbf9f8] pt-[72px]">
      <main className="max-w-[1140px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* ── Left: Content (8/12) ─────────────── */}
        <div className="lg:col-span-8 space-y-8">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-1 text-sm text-[#717a6d]">
            <Link to="/" className="hover:text-[#00450d] transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <Link to="/search" className="hover:text-[#00450d] transition-colors">Search</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <Link to={`/search?city=${property.location?.city}`} className="hover:text-[#00450d] transition-colors">
              {property.location?.city}
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-[#41493e] font-medium truncate max-w-[200px]">{property.title}</span>
          </nav>

          {/* Gallery (Requirement 24.2) */}
          <PropertyGallery images={images} title={property.title} />

          {/* Header info */}
          <div className="space-y-3">
            <div className="text-[#00450d] font-['Playfair_Display'] text-3xl font-bold">
              {formatPrice(property.price, property.status)}
            </div>
            <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#1b1c1c] leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-[#41493e]">
              <span className="material-symbols-outlined text-[#1b5e20]">location_on</span>
              <span>{property.location?.address}, {property.location?.city}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 border border-[#91d78a] bg-white text-[#41493e] text-xs font-bold uppercase tracking-wider rounded capitalize">
                {property.type}
              </span>
              {property.category && (
                <span className="px-3 py-1 border border-[#c0c9bb] text-[#41493e] text-xs font-bold uppercase tracking-wider rounded">
                  {property.category}
                </span>
              )}
              <span className="px-3 py-1 bg-[#f0eded] text-[#1b5e20] text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span> Verified
              </span>
            </div>
          </div>

          {/* Key features grid */}
          <div className="bg-[#f5f3f3] rounded-2xl p-6 border border-[#c0c9bb]/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: 'bed', label: 'Bedrooms', value: property.rooms ?? '—' },
                { icon: 'shower', label: 'Bathrooms', value: property.bathrooms ?? '—' },
                { icon: 'square_foot', label: 'Area', value: property.area ? `${property.area} m²` : '—' },
                { icon: 'home_work', label: 'Category', value: property.category || property.type },
              ].map((feat) => (
                <div key={feat.label} className="flex flex-col gap-1">
                  <span className="material-symbols-outlined text-[#717a6d] text-[20px]">{feat.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#717a6d]">{feat.label}</span>
                  <span className="font-bold text-[#1b1c1c] text-lg">{feat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c] mb-3">About This Property</h2>
            <p className="text-[#41493e] leading-relaxed">{property.description}</p>
          </div>

          {/* Features */}
          {property.features?.length > 0 && (
            <div>
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c] mb-4">Amenities & Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#41493e]">
                    <span className="material-symbols-outlined text-[#1b5e20] text-[18px]">check_circle</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Map (Requirement 24.4) */}
          {mapCenter && (
            <div>
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c] mb-4">Location</h2>
              <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-ambient-2 border border-[#c0c9bb]">
                <MapView
                  properties={[property]}
                  initialCenter={mapCenter}
                  initialZoom={15}
                  onMarkerClick={() => {}}
                />
              </div>
              <p className="text-sm text-[#41493e] mt-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1b5e20]">location_on</span>
                {property.location?.address}, {property.location?.city}
              </p>
            </div>
          )}

          {/* Similar Properties */}
          {similarData?.data?.length > 0 && (
            <div>
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c] mb-6">Similar Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {similarData.data.slice(0, 4).map((p) => <PropertyCard key={p._id} property={p} />)}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Sticky Contact Card (4/12) ── */}
        <div className="lg:col-span-4">
          <div className="sticky top-[96px] bg-white rounded-2xl p-6 shadow-ambient-3 border border-[#c0c9bb] flex flex-col gap-5">
            {/* Price (mobile) */}
            <div className="lg:hidden">
              <div className="font-['Playfair_Display'] text-2xl font-bold text-[#00450d]">
                {formatPrice(property.price, property.status)}
              </div>
            </div>

            {/* Owner info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[#e4e2e1] border-2 border-[#91d78a] flex-shrink-0">
                {property.owner?.avatar ? (
                  <img src={property.owner.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1b5e20] text-white font-bold text-xl">
                    {property.owner?.name?.[0] || 'O'}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-[#1b1c1c]">{property.owner?.name || 'Property Owner'}</h3>
                <span className="inline-flex items-center gap-1 bg-[#f0eded] text-[#1b5e20] text-xs font-bold px-2 py-1 rounded mt-0.5 capitalize">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  Verified {property.owner?.role}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            {property.owner?.phone && (
              <div className="grid grid-cols-2 gap-3">
                <a href={`tel:${property.owner.phone}`}
                  className="bg-[#1b5e20] text-white py-3 rounded-xl font-semibold hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-[18px]">call</span> Call
                </a>
                <a href={`https://wa.me/${property.owner.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                  className="bg-[#25D366] text-white py-3 rounded-xl font-semibold hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm">
                  WhatsApp
                </a>
              </div>
            )}

            <hr className="border-[#c0c9bb]/40" />

            {/* Inquiry form */}
            <form onSubmit={handleSubmit(onInquire)} className="flex flex-col gap-4">
              <h4 className="font-semibold text-[#1b1c1c]">Send Inquiry</h4>
              {[
                { field: 'phone', type: 'tel', label: 'Your Phone', req: true },
                { field: 'email', type: 'email', label: 'Your Email', req: true },
              ].map(({ field, type, label, req }) => (
                <div key={field} className="relative">
                  <input {...register(field, { required: req && `${label} is required` })}
                    type={type} placeholder=" "
                    defaultValue={user?.[field] || ''}
                    className="peer block w-full px-3 pb-2 pt-5 bg-white border-0 border-b-2 border-[#717a6d] text-[#1b1c1c] text-sm focus:outline-none focus:border-[#1b5e20]" />
                  <label className="absolute text-xs text-[#717a6d] top-1 left-3 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5 transition-all">
                    {label}
                  </label>
                  {errors[field] && <p className="text-[#ba1a1a] text-xs mt-0.5">{errors[field].message}</p>}
                </div>
              ))}
              <div className="relative">
                <textarea {...register('message', { required: 'Message is required' })}
                  placeholder=" " rows={3}
                  defaultValue="I am interested in this property. Please contact me."
                  className="peer block w-full px-3 pb-2 pt-5 bg-white border-0 border-b-2 border-[#717a6d] text-[#1b1c1c] text-sm focus:outline-none focus:border-[#1b5e20] resize-none" />
                <label className="absolute text-xs text-[#717a6d] top-1 left-3">Message</label>
                {errors.message && <p className="text-[#ba1a1a] text-xs mt-0.5">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={mutation.isPending}
                className="w-full bg-[#835400] text-white py-3 rounded-xl font-semibold hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {mutation.isPending
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span className="material-symbols-outlined text-[18px]">send</span> Send Inquiry</>}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
