import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/adminApi';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-toastify';

export default function PendingApprovals() {
  const queryClient = useQueryClient();

  const { data: pendingData, isLoading } = useQuery({
    queryKey: ['admin-pending'],
    queryFn: () => adminApi.getPendingListings().then((r) => r.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => adminApi.approveListing(id),
    onSuccess: () => {
      toast.success('Listing approved!');
      queryClient.invalidateQueries({ queryKey: ['admin-pending'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Approval failed'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => adminApi.rejectListing(id),
    onSuccess: () => {
      toast.success('Listing rejected and removed');
      queryClient.invalidateQueries({ queryKey: ['admin-pending'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Rejection failed'),
  });

  const pending = pendingData?.data || [];

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0,
    }).format(p);

  return (
    <div className="min-h-screen bg-[#fbf9f8] pt-[72px]">
      <div className="max-w-[1140px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-1 text-sm text-[#717a6d] mb-4">
            <Link to="/admin" className="hover:text-[#00450d]">
              Admin Dashboard
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-[#41493e]">Pending Approvals</span>
          </nav>
          <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1b1c1c]">
            Pending Approvals
          </h1>
          <p className="text-sm text-[#41493e] mt-1">
            Review and approve property listings submitted by users
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <Spinner center />
        ) : pending.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#c0c9bb] p-16 text-center shadow-ambient-1">
            <span className="material-symbols-outlined text-[64px] text-[#91d78a] block mb-4">
              task_alt
            </span>
            <h2 className="font-semibold text-[#1b1c1c] text-xl mb-2">All caught up!</h2>
            <p className="text-sm text-[#41493e]">
              No listings are waiting for review at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="bg-[#fff8e1] border border-[#fcab28]/30 rounded-2xl p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#835400] text-[28px]">
                pending_actions
              </span>
              <div>
                <p className="font-semibold text-[#1b1c1c]">
                  {pending.length} {pending.length === 1 ? 'listing' : 'listings'} awaiting review
                </p>
                <p className="text-xs text-[#41493e]">
                  Review each listing carefully before approving or rejecting
                </p>
              </div>
            </div>

            {/* Pending Listings */}
            {pending.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-2xl border border-[#c0c9bb] p-5 shadow-ambient-1 hover:shadow-ambient-2 transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-[#eae8e7]">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#c0c9bb] text-[48px]">
                          image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#1b1c1c] text-lg mb-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[#41493e] mb-1">
                          <span className="material-symbols-outlined text-[16px]">
                            location_on
                          </span>
                          <span>
                            {property.location?.address}, {property.location?.city}
                          </span>
                        </div>
                        <p className="font-bold text-[#00450d] text-lg">
                          {formatPrice(property.price)}
                          {property.status === 'rent' && (
                            <span className="text-sm font-normal text-[#41493e]">/mo</span>
                          )}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-col gap-2 items-end flex-shrink-0">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                            property.status === 'rent'
                              ? 'bg-[#fcab28] text-[#694300]'
                              : 'bg-[#1b5e20] text-[#90d689]'
                          }`}
                        >
                          For {property.status}
                        </span>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#f0eded] text-[#41493e] capitalize">
                          {property.type}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {property.description && (
                      <p className="text-sm text-[#41493e] line-clamp-2 mb-3">
                        {property.description}
                      </p>
                    )}

                    {/* Amenities */}
                    <div className="flex items-center gap-4 text-xs text-[#41493e] mb-3">
                      {property.rooms != null && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">bed</span>
                          {property.rooms} Beds
                        </span>
                      )}
                      {property.bathrooms != null && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">bathtub</span>
                          {property.bathrooms} Baths
                        </span>
                      )}
                      {property.area && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            square_foot
                          </span>
                          {property.area} m²
                        </span>
                      )}
                    </div>

                    {/* Submitter Info */}
                    <div className="flex items-center gap-2 text-xs text-[#717a6d] mb-4 pb-4 border-b border-[#c0c9bb]/40">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      <span>
                        Submitted by{' '}
                        <span className="font-medium text-[#1b1c1c]">
                          {property.owner?.name || 'Unknown'}
                        </span>
                      </span>
                      <span>•</span>
                      <span>{new Date(property.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/properties/${property._id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-4 py-2.5 border-2 border-[#c0c9bb] rounded-xl text-sm font-medium text-[#41493e] hover:bg-[#f5f3f3] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        View Details
                      </Link>
                      <button
                        onClick={() => approveMutation.mutate(property._id)}
                        disabled={approveMutation.isPending}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1b5e20] text-white rounded-xl text-sm font-semibold hover:bg-[#00450d] transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-60"
                      >
                        {approveMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">check</span>
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              'Are you sure you want to reject and delete this listing?'
                            )
                          ) {
                            rejectMutation.mutate(property._id);
                          }
                        }}
                        disabled={rejectMutation.isPending}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-[#ba1a1a] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                      >
                        {rejectMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">close</span>
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
