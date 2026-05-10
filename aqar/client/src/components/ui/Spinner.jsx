/** Spinner component */
export default function Spinner({ size = 'md', center = false }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={center ? 'flex items-center justify-center py-16' : 'inline-flex'}>
      <div
        className={`${sizes[size]} rounded-full border-[#c0c9bb] border-t-[#1b5e20] animate-spin`}
      />
    </div>
  );
}
