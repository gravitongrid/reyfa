import { useAdmin } from '../context/AdminContext';
import { Target, Eye, Users, Globe, Lightbulb } from 'lucide-react';

const About = () => {
  const { siteData } = useAdmin();

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Excellence",
      description: "We deliver world-class solutions that exceed expectations"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "We embrace cutting-edge technologies and creative solutions"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Partnership",
      description: "We build lasting relationships with our clients and communities"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "We serve businesses locally in Nigeria and internationally"
    }
  ];

  const achievements = [
    { number: "500+", label: "Projects Completed" },
    { number: "50+", label: "Happy Clients" },
    { number: "10+", label: "Years Experience" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{siteData.about.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {siteData.about.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600">
                      {value.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{value.title}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Eye className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {siteData.about.vision}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {siteData.about.mission}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{achievement.number}</div>
                  <div className="text-sm text-gray-600">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;