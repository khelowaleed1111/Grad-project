import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { propertiesApi } from '../../api/propertiesApi';
import { toast } from 'react-toastify';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Describe the property in at least 20 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  status: z.enum(['sale', 'rent']),
  type: z.enum(['residential', 'commercial', 'land']),
  category: z.string().optional(),
  rooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  area: z.coerce.number().positive().optional(),
  'location.city': z.string().min(1, 'City is required'),
  'location.address': z.string().min(1, 'Address is required'),
  'location.district': z.string().optional(),
});

const STEPS = ['Basic Info', 'Details', 'Location', 'Submit'];

export default function AddProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState('');

  const { register, handleSubmit, trigger, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: 'sale', type: 'residential' },
  });

  const mutation = useMutation({
    mutationFn: (formData) => propertiesApi.create(formData),
    onSuccess: () => {
      toast.success('Listing submitted for review! Admin will approve it shortly.');
      navigate('/dashboard');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create listing'),
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed]);
      setFeatureInput('');
    }
  };

  const removeFeature = (f) => setFeatures(features.filter((x) => x !== f));

  const nextStep = async () => {
    const fieldGroups = [
      ['title', 'description', 'status', 'type'],
      ['price', 'rooms', 'bathrooms', 'area'],
      ['location.city', 'location.address'],
    ];
    const valid = await trigger(fieldGroups[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = (data) => {
    const fd = new FormData();
    // Flatten location fields
    const payload = {
      title: data.title,
      description: data.description,
      price: data.price,
      status: data.status,
      type: data.type,
      category: data.category,
      rooms: data.rooms,
      bathrooms: data.bathrooms,
      area: data.area,
      features: JSON.stringify(features),
      'location[city]': data['location.city'],
      'location[address]': data['location.address'],
      'location[district]': data['location.district'],
    };
    Object.entries(payload).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v); });
    images.forEach((img) => fd.append('images', img));
    mutation.mutate(fd);
  };

  const inputClass = (err) =>
    `w-full px-4 py-3 border-2 rounded-xl text-[#1b1c1c] text-sm focus:outline-none transition-colors
    ${err ? 'border-[#ba1a1a]' : 'border-[#c0c9bb] focus:border-[#1b5e20]'}`;

  return (
    <div className="min-h-screen bg-[#fbf9f8] pt-[72px]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-[#717a6d] mb-6">
          <Link to="/dashboard" className="hover:text-[#00450d]">Dashboard</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#41493e]">Add New Listing</span>
        </nav>

        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1b1c1c] mb-2">List Your Property</h1>
        <p className="text-sm text-[#41493e] mb-8">Your listing will be reviewed by our team before going live.</p>

        {/* Progress stepper */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 flex-shrink-0 ${i < STEPS.length - 1 ? 'w-full' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step ? 'bg-[#1b5e20] text-white'
                  : i === step ? 'bg-[#fcab28] text-[#694300]'
                  : 'bg-[#e4e2e1] text-[#717a6d]'
                }`}>
                  {i < step ? <span className="material-symbols-outlined text-[16px]">check</span> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-[#1b1c1c]' : 'text-[#717a6d]'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-[#1b5e20]' : 'bg-[#e4e2e1]'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl border border-[#c0c9bb] shadow-ambient-1 p-6 space-y-5">
            {/* Step 0: Basic Info */}
            {step === 0 && (
              <>
                <h2 className="font-semibold text-[#1b1c1c] text-lg">Basic Information</h2>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">Property Title *</label>
                  <input {...register('title')} type="text" placeholder="e.g. Modern Apartment in Zamalek" className={inputClass(errors.title)} />
                  {errors.title && <p className="text-[#ba1a1a] text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">Description *</label>
                  <textarea {...register('description')} rows={5} placeholder="Describe the property in detail..." className={inputClass(errors.description)} />
                  {errors.description && <p className="text-[#ba1a1a] text-xs mt-1">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">Listing Type *</label>
                    <div className="flex rounded-xl border border-[#c0c9bb] overflow-hidden">
                      {[{ v: 'sale', l: 'For Sale' }, { v: 'rent', l: 'For Rent' }].map(({ v, l }) => (
                        <label key={v} className="flex-1 cursor-pointer">
                          <input {...register('status')} type="radio" value={v} className="sr-only" />
                          <div className={`py-3 text-center text-sm font-medium transition-colors ${
                            watch('status') === v ? 'bg-[#1b5e20] text-white' : 'text-[#41493e] hover:bg-[#f5f3f3]'
                          }`}>{l}</div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">Property Type *</label>
                    <select {...register('type')} className={inputClass(errors.type)}>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">Category</label>
                  <select {...register('category')} className={inputClass()}>
                    <option value="">Select category (optional)</option>
                    {['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio', 'Office', 'Shop', 'Warehouse', 'Plot'].map((c) => (
                      <option key={c} value={c.toLowerCase()}>{c}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Step 1: Details */}
            {step === 1 && (
              <>
                <h2 className="font-semibold text-[#1b1c1c] text-lg">Property Details</h2>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">Price (EGP) *</label>
                  <input {...register('price')} type="number" min="0" placeholder="e.g. 1500000" className={inputClass(errors.price)} />
                  {errors.price && <p className="text-[#ba1a1a] text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { field: 'rooms', label: 'Bedrooms', icon: 'bed' },
                    { field: 'bathrooms', label: 'Bathrooms', icon: 'shower' },
                    { field: 'area', label: 'Area (m²)', icon: 'square_foot' },
                  ].map(({ field, label, icon }) => (
                    <div key={field}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">{icon}</span>{label}
                      </label>
                      <input {...register(field)} type="number" min="0" placeholder="0"
                        className={inputClass(errors[field])} />
                    </div>
                  ))}
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">Amenities & Features</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                      placeholder="e.g. Swimming Pool, Parking, Gym..."
                      className="flex-1 px-4 py-3 border-2 border-[#c0c9bb] rounded-xl text-sm focus:outline-none focus:border-[#1b5e20]" />
                    <button type="button" onClick={addFeature}
                      className="px-4 py-3 bg-[#1b5e20] text-white rounded-xl text-sm font-medium hover:bg-[#00450d] transition-colors">
                      Add
                    </button>
                  </div>
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {features.map((f) => (
                        <span key={f} className="flex items-center gap-1 bg-[#e8f5e9] text-[#1b5e20] text-xs font-medium px-3 py-1.5 rounded-full">
                          {f}
                          <button type="button" onClick={() => removeFeature(f)} className="hover:text-[#ba1a1a] ml-1">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Images */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">Property Photos</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#c0c9bb] rounded-xl cursor-pointer hover:border-[#1b5e20] hover:bg-[#e8f5e9]/30 transition-colors">
                    <span className="material-symbols-outlined text-[32px] text-[#717a6d]">add_photo_alternate</span>
                    <span className="text-sm text-[#41493e] mt-1">Click to upload photos</span>
                    <span className="text-xs text-[#717a6d]">PNG, JPG up to 10MB each</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-[#c0c9bb]">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <>
                <h2 className="font-semibold text-[#1b1c1c] text-lg">Location Details</h2>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">City *</label>
                  <select {...register('location.city')} className={inputClass(errors['location.city'])}>
                    <option value="">Select city</option>
                    {['Cairo', 'Giza', 'Alexandria', 'Matrouh', '6th October', 'New Cairo', 'Maadi', 'Zamalek', 'Sheikh Zayed', 'Heliopolis'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors['location.city'] && <p className="text-[#ba1a1a] text-xs mt-1">{errors['location.city'].message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">District / Neighborhood</label>
                  <input {...register('location.district')} type="text" placeholder="e.g. Maadi, Heliopolis"
                    className={inputClass(errors['location.district'])} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#41493e] mb-1.5">Street Address *</label>
                  <input {...register('location.address')} type="text" placeholder="e.g. 15 Ahmed Orabi Street"
                    className={inputClass(errors['location.address'])} />
                  {errors['location.address'] && <p className="text-[#ba1a1a] text-xs mt-1">{errors['location.address'].message}</p>}
                </div>
              </>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <>
                <h2 className="font-semibold text-[#1b1c1c] text-lg">Review & Submit</h2>
                <div className="bg-[#e8f5e9] border border-[#91d78a] rounded-xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#1b5e20]">info</span>
                  <div>
                    <p className="text-sm font-medium text-[#1b5e20]">Your listing will be reviewed</p>
                    <p className="text-xs text-[#1b5e20]/80 mt-0.5">
                      After submission, our team will verify your property within 24 hours before it goes live on the platform.
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#41493e]">
                  <div className="flex justify-between py-2 border-b border-[#c0c9bb]/40">
                    <span className="font-medium text-[#1b1c1c]">Title</span>
                    <span>{watch('title') || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#c0c9bb]/40">
                    <span className="font-medium text-[#1b1c1c]">Status</span>
                    <span className="capitalize">{watch('status')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#c0c9bb]/40">
                    <span className="font-medium text-[#1b1c1c]">Type</span>
                    <span className="capitalize">{watch('type')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#c0c9bb]/40">
                    <span className="font-medium text-[#1b1c1c]">Price</span>
                    <span>{watch('price') ? new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(watch('price')) : '—'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#c0c9bb]/40">
                    <span className="font-medium text-[#1b1c1c]">City</span>
                    <span>{watch('location.city') || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-[#1b1c1c]">Photos</span>
                    <span>{images.length} uploaded</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-6">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 px-5 py-3 border border-[#c0c9bb] rounded-xl text-sm font-medium text-[#41493e] hover:bg-[#f0eded] transition-colors">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>Previous
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-[#1b5e20] text-white rounded-xl text-sm font-semibold hover:bg-[#00450d] transition-all hover:-translate-y-0.5 shadow-sm">
                Continue <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            ) : (
              <button type="submit" disabled={mutation.isPending}
                className="flex items-center gap-2 px-8 py-3 bg-[#fcab28] text-[#694300] rounded-xl text-sm font-bold hover:bg-[#ffb957] transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-60">
                {mutation.isPending
                  ? <div className="w-4 h-4 border-2 border-[#694300]/30 border-t-[#694300] rounded-full animate-spin" />
                  : <><span className="material-symbols-outlined text-[18px]">send</span>Submit Listing</>}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
