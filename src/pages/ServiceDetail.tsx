import { useParams, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { ArrowLeft, CheckCircle, Phone, Mail } from 'lucide-react';

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { siteData } = useAdmin();

  const service = siteData.services.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<
      string,
      { bg: string; text: string; border: string }
    > = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
    };

    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(service.color);

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/#services"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Services
          </Link>
        </div>

        {/* Service Header */}
        <div className={`${colors.bg} rounded-2xl p-8 mb-8`}>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
          <p className="text-xl text-gray-700 leading-relaxed">{service.description}</p>
        </div>

        {/* Service Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className={`w-6 h-6 ${colors.text} flex-shrink-0 mt-0.5`} />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose TREYFA-TECH?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <span
                    className={`w-3 h-3 ${colors.text.replace('text-', 'bg-')} rounded-full`}
                  ></span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Expert Team</h3>
                  <p className="text-gray-600 text-sm">
                    Our experienced professionals deliver world-class solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <span
                    className={`w-3 h-3 ${colors.text.replace('text-', 'bg-')} rounded-full`}
                  ></span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Proven Track Record</h3>
                  <p className="text-gray-600 text-sm">
                    Successfully delivered 500+ projects across various industries.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <span
                    className={`w-3 h-3 ${colors.text.replace('text-', 'bg-')} rounded-full`}
                  ></span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                  <p className="text-gray-600 text-sm">
                    Round-the-clock technical support and maintenance.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <span
                    className={`w-3 h-3 ${colors.text.replace('text-', 'bg-')} rounded-full`}
                  ></span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Competitive Pricing</h3>
                  <p className="text-gray-600 text-sm">
                    Cost-effective solutions without compromising quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 opacity-90">
            Let's discuss how our {service.title.toLowerCase()} can transform your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteData.contact.phone}`}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us Now
            </a>
            <a
              href={`mailto:${siteData.contact.email}`}
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
