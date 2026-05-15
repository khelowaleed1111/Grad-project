import React from 'react';
import Button from '../components/ui/Button';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] pt-24 pb-16">
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#fcab28] mb-2">Get in Touch</p>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-[#1b1c1c]">Contact Us</h1>
          <p className="text-[#41493e] mt-4 max-w-2xl mx-auto">
            Have questions about a property or need help with your listing? Our team of real estate experts is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-2xl border border-[#c0c9bb] p-8 shadow-ambient-1">
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c] mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#1b5e20]">mail</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#41493e] mb-1">Email Us</h3>
                    <p className="text-lg font-medium text-[#1b1c1c]">khelowaleed@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#fff8e1] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#fcab28]">phone_iphone</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#41493e] mb-1">Call Us</h3>
                    <p className="text-lg font-medium text-[#1b1c1c]">01125474066</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f3f4f6] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#41493e]">location_on</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#41493e] mb-1">Visit Us</h3>
                    <p className="text-lg font-medium text-[#1b1c1c]">Cairo, Egypt</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1b5e20] rounded-2xl p-8 text-white shadow-ambient-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]">support_agent</span>
              </div>
              <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2 relative z-10">24/7 Support</h3>
              <p className="text-white/80 text-sm leading-relaxed relative z-10">
                Our support team is available around the clock to help you with any technical issues or inquiries.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#c0c9bb] p-8 md:p-10 shadow-ambient-2">
            <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1b1c1c] mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-[#41493e] ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-[#f5f3f3] border-2 border-transparent rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-[#41493e] ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-[#f5f3f3] border-2 border-transparent rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-[#41493e] ml-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 bg-[#f5f3f3] border-2 border-transparent rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all"
                  placeholder="How can we help?"
                />
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-[#41493e] ml-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-3 bg-[#f5f3f3] border-2 border-transparent rounded-xl focus:bg-white focus:border-[#1b5e20] outline-none transition-all resize-none"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>
              
              <Button
                type="submit"
                size="xl"
                fullWidth
                icon="send"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
