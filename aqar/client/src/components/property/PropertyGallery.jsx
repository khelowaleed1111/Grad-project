import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

/**
 * PropertyGallery - Image gallery with Swiper carousel
 * Features: Navigation, pagination, thumbnails, zoom, fullscreen
 */
export default function PropertyGallery({ images = [], title = 'Property' }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-[#f0eded] rounded-2xl flex items-center justify-center">
        <div className="text-center text-[#717a6d]">
          <span className="material-symbols-outlined text-[64px] block mb-2">image</span>
          <p className="text-sm">No images available</p>
        </div>
      </div>
    );
  }

  const openFullscreen = (index) => {
    setActiveIndex(index);
    setIsFullscreen(true);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-3">
        {/* Main Swiper */}
        <div className="relative rounded-2xl overflow-hidden bg-[#f0eded] shadow-ambient-2">
          <Swiper
            modules={[Navigation, Pagination, Thumbs, Zoom]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            zoom={true}
            className="h-[400px] md:h-[500px]"
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="swiper-zoom-container h-full">
                  <img
                    src={img}
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => openFullscreen(index)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-[#1b1c1c] transition-all hover:scale-110"
                aria-label="Previous image"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-[#1b1c1c] transition-all hover:scale-110"
                aria-label="Next image"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 right-4 z-10 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => openFullscreen(activeIndex)}
            className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-[#1b1c1c] transition-all hover:scale-110"
            aria-label="View fullscreen"
          >
            <span className="material-symbols-outlined text-[20px]">fullscreen</span>
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView={4}
            breakpoints={{
              640: { slidesPerView: 5 },
              768: { slidesPerView: 6 },
              1024: { slidesPerView: 7 },
            }}
            watchSlidesProgress
            className="h-20"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    activeIndex === index
                      ? 'border-[#1b5e20] opacity-100'
                      : 'border-[#c0c9bb] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            aria-label="Close fullscreen"
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>

          <div className="w-full h-full flex items-center justify-center p-4">
            <Swiper
              modules={[Navigation, Pagination, Zoom]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-fullscreen',
                prevEl: '.swiper-button-prev-fullscreen',
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              zoom={true}
              initialSlide={activeIndex}
              className="w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="swiper-zoom-container h-full flex items-center justify-center">
                    <img
                      src={img}
                      alt={`${title} - Image ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <button
                  className="swiper-button-prev-fullscreen absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Previous image"
                >
                  <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                </button>
                <button
                  className="swiper-button-next-fullscreen absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Next image"
                >
                  <span className="material-symbols-outlined text-[28px]">chevron_right</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
