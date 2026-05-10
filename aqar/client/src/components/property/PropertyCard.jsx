/** Reusable property card matching the Aqar design system */
import { Link } from 'react-router-dom';

const STATUS_BADGE = {
  rent: { label: 'For Rent', color: 'bg-[#fcab28] text-[#694300]' },
  sale: { label: 'For Sale', color: 'bg-[#1b5e20] text-[#90d689]' },
};

export default function PropertyCard({ property }) {
  const {
    _id,
    title,
    price,
    status,
    type,
    rooms,
    bathrooms,
    area,
    location,
    images,
    isFeatured,
  } = property;

  const badge = STATUS_BADGE[status] || STATUS_BADGE.sale;
  const coverImage = images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0,
    }).format(p);

  return (
    <Link
      to={`/properties/${_id}`}
      className="group bg-white border border-[#c0c9bb] rounded-xl overflow-hidden hover:shadow-ambient-3 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#f0eded]">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badge.color}`}>
            {badge.label}
          </span>
          {isFeatured && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#00450d]">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Price */}
        <p className="font-['Playfair_Display'] text-xl font-bold text-[#00450d]">
          {formatPrice(price)}
          {status === 'rent' && <span className="text-sm font-normal text-[#41493e]">/mo</span>}
        </p>

        {/* Title */}
        <h3 className="font-medium text-[#1b1c1c] text-sm leading-snug line-clamp-2 group-hover:text-[#00450d] transition-colors">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-[#41493e]">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          <span className="text-xs">{location?.city || 'Cairo'}</span>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-[#e4e2e1] text-xs text-[#41493e]">
          {rooms != null && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bed</span>
              {rooms} {rooms === 1 ? 'Bed' : 'Beds'}
            </span>
          )}
          {bathrooms != null && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bathtub</span>
              {bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}
            </span>
          )}
          {area && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">square_foot</span>
              {area} m²
            </span>
          )}
          <span className="ml-auto capitalize text-[10px] font-medium text-[#717a6d] bg-[#f0eded] px-2 py-0.5 rounded-full">
            {type}
          </span>
        </div>
      </div>
    </Link>
  );
}
