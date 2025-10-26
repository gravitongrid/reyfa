import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { 
  Code, 
  Settings, 
  GraduationCap, 
  Headphones, 
  Cpu, 
  Wrench, 
  Film, 
  Database,
  Layers
} from 'lucide-react';

const Services = () => {
  const { siteData } = useAdmin();
  const services = siteData.services;

  const getServiceIcon = (serviceId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'software-development': <Code className="w-8 h-8" />,
      'systems-application': <Settings className="w-8 h-8" />,
      'it-training': <GraduationCap className="w-8 h-8" />,
      'outsourcing-bpo': <Headphones className="w-8 h-8" />,
      'hardware-iot': <Cpu className="w-8 h-8" />,
      'engineering-contracting': <Wrench className="w-8 h-8" />,
      'animation-creative': <Film className="w-8 h-8" />,
      'data-management': <Database className="w-8 h-8" />,
      'software-programming': <Layers className="w-8 h-8" />
    };
    return iconMap[serviceId] || <Code className="w-8 h-8" />;
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; border: string; hover: string } } = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-300' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:border-purple-300' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', hover: 'hover:border-green-300' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:border-orange-300' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', hover: 'hover:border-indigo-300' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', hover: 'hover:border-red-300' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', hover: 'hover:border-pink-300' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200', hover: 'hover:border-teal-300' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', hover: 'hover:border-cyan-300' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        At Treyfa-Tech & Integrated Services Ltd, we provide world-class technology solutions 
        tailored to meet the needs of businesses in Nigeria and beyond.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => {
        const colors = getColorClasses(service.color);
        return (
          <div
            key={index}
            className={`bg-white rounded-xl border-2 ${colors.border} ${colors.hover} p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            {/* Service Icon */}
            <div className={`w-16 h-16 ${colors.bg} rounded-lg flex items-center justify-center mb-4`}>
              <div className={colors.text}>
                {getServiceIcon(service.id)}
              </div>
            </div>
            
            {/* Service Title and Description */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            
            {/* Features List */}
            <ul className="space-y-2">
              {service.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <div
                    className={`w-2 h-2 ${colors.text.replace('text-', 'bg-')} rounded-full mt-2 mr-3 flex-shrink-0`}
                  ></div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            {/* Read More Button */}
            <div className="mt-6">
              <Link
                to={`/service/${service.id}`}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${colors.text} ${colors.bg} rounded-lg hover:shadow-md transition-all duration-300 group`}
              >
                Read More
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>
  );
};

export default Services;