import { useAdmin } from '../context/AdminContext';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from 'lucide-react';

const Footer = () => {
  const { siteData } = useAdmin();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper to get social link by platform
  const getSocialUrl = (platform: string) =>
    siteData.footer.socialLinks.find((s) => s.platform === platform)?.url || '#';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              {siteData.header.logoImage ? (
                <img
                  src={siteData.header.logoImage}
                  alt={siteData.header.companyName}
                  className="w-10 h-10 rounded-lg object-cover mr-3"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">
                    {siteData.header.logo}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold">
                  {siteData.footer.companyName}
                </h3>
                <p className="text-sm text-gray-400">
                  {siteData.footer.tagline}
                </p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed">
              {siteData.footer.description}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href={getSocialUrl('Facebook')}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href={getSocialUrl('Twitter')}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href={getSocialUrl('LinkedIn')}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={getSocialUrl('Instagram')}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={getSocialUrl('YouTube')}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {siteData.footer.quickLinks.map((link: string, index: number) => (
                <li key={index}>
                  <button
                    onClick={() =>
                      scrollToSection(link.toLowerCase().replace(/\s+/g, ''))
                    }
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              {siteData.footer.services.map((service: string, index: number) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  Shop No.5, EPP Plaza, Sangere Futy<br />
                  Opposite MAU Gate, Girei, Adamawa State<br />
                  Nigeria
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span>+234 (0) 706 4786 424</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span>info@treyfatech.com.ng</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span>support@treyfatech.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {siteData.footer.copyright}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
