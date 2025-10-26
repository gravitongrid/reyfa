import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Calendar, User, Tag, ExternalLink, X, MapPin, Clock, CheckCircle } from 'lucide-react';

const Portfolio = () => {
  const { siteData } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const categories = ['All', ...Array.from(new Set(siteData.portfolio.map(project => project.category)))];
  
  const filteredProjects = selectedCategory === 'All' 
    ? siteData.portfolio 
    : siteData.portfolio.filter(project => project.category === selectedCategory);

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our successful projects and see how we've helped businesses transform 
            their operations with innovative technology solutions.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-2" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{project.year}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Tag className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Technologies:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedProject(project)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
                >
                  View Details
                  <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No projects found in this category.</p>
          </div>
        )}

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-6xl max-h-full bg-white rounded-2xl overflow-hidden">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full text-gray-700 hover:text-gray-900 hover:bg-opacity-100 z-10 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedProject.category}
                    </span>
                  </div>
                </div>
                
                {/* Details Section */}
                <div className="p-8 lg:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedProject.title}
                  </h2>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {selectedProject.description}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-700">
                      <User className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Client:</span>
                        <span className="ml-2">{selectedProject.client}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Year:</span>
                        <span className="ml-2">{selectedProject.year}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Tag className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Category:</span>
                        <span className="ml-2">{selectedProject.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Location:</span>
                        <span className="ml-2">Nigeria</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Duration:</span>
                        <span className="ml-2">3-6 months</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Technologies */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-blue-600" />
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Project Features */}
                  <div className="border-t border-gray-200 pt-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Custom solution tailored to client needs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Scalable architecture for future growth</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Modern user interface and experience</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Comprehensive testing and quality assurance</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">Ongoing support and maintenance</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Project Success */}
                  <div className="bg-green-50 rounded-lg p-4 mb-8">
                    <h4 className="font-semibold text-green-900 mb-2">Project Success</h4>
                    <p className="text-green-800 text-sm">
                      This project was delivered on time and exceeded client expectations, 
                      resulting in improved efficiency and user satisfaction.
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        window.location.href = '/#contact';
                      }}
                      className="flex-1 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Start Your Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-xl mb-6 opacity-90">
              Let's discuss how we can help transform your business with innovative technology solutions.
            </p>
            <button 
              onClick={() => {
                window.location.href = '/#contact';
              }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;