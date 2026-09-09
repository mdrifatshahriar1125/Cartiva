import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[var(--color-bg)] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-[var(--color-main-text)] mb-4">About Cartiva</h1>
          <div className="h-1 w-24 bg-[var(--color-primary)] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-[var(--color-secondary-text)] leading-relaxed">
            Cartiva is your one-stop destination for quality products at unbeatable prices. 
            Founded with the mission to make online shopping easy, secure, and enjoyable, 
            we bring you a curated collection of products across multiple categories.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[var(--color-main-text)] mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="h-16 w-16 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600 text-sm">Every product is carefully selected and verified for quality before listing on our platform.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="h-16 w-16 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Shopping</h3>
              <p className="text-gray-600 text-sm">Your data is protected with industry-standard encryption. Shop with confidence every time.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="h-16 w-16 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center mx-auto mb-4 text-2xl font-bold">🚚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">We partner with top logistics providers to ensure your orders arrive quickly and safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-[var(--color-bg)]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[var(--color-main-text)] mb-12">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-[var(--color-primary)] mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600">support@cartiva.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-[var(--color-primary)] mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-[var(--color-primary)] mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900">Address</h3>
                  <p className="text-gray-600">123 Commerce Street, San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent! (Demo)'); }}>
              <input type="text" placeholder="Your Name" required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              />
              <input type="email" placeholder="Your Email" required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              />
              <textarea rows="4" placeholder="Your Message" required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              />
              <button type="submit"
                className="w-full inline-flex items-center justify-center bg-[var(--color-primary)] text-white py-2.5 px-4 rounded-md font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                <Send className="h-4 w-4 mr-2" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
