import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-green-700 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">khelowaleed@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 text-green-700 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600">01125474066</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-green-700 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Address</h3>
                  <p className="text-gray-600">Cairo, Egypt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your message..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
