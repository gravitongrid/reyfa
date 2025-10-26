import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Calendar, Tag, Search, Filter, X, MapPin, User } from 'lucide-react';

const Gallery = () => {
  const { siteData } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const categories = ['All', ...Array.from(new Set(siteData.gallery.map((item) => item.category)))];

  const filteredGallery = siteData.gallery.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a look behind the scenes at Treyfa-Tech — from our modern workspace to client meetings,
            training sessions, and cutting-edge technology implementations.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {item.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(item);
                      }}
                      className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGallery.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No images found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{siteData.gallery.length}</div>
              <div className="text-blue-100">Total Images</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{categories.length - 1}</div>
              <div className="text-blue-100">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Projects Captured</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Want to See Your Project Here?</h2>
            <p className="text-xl text-gray-600 mb-6">
              Let's work together to create amazing technology solutions that we'll be proud to showcase.
            </p>
            <button
              onClick={() => {
                window.location.href = '/#contact';
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start Your Project
            </button>
          </div>
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full bg-white rounded-2xl overflow-hidden">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full text-gray-700 hover:text-gray-900 hover:bg-opacity-100 z-10 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedImage.category}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-8 lg:p-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedImage.title}</h2>

                  <p className="text-gray-600 text-lg leading-relaxed mb-6">{selectedImage.description}</p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Date:</span>
                        <span className="ml-2">
                          {new Date(selectedImage.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <Tag className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Category:</span>
                        <span className="ml-2">{selectedImage.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Location:</span>
                        <span className="ml-2">Treyfa-Tech Office, Nigeria</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <User className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <span className="font-medium">Photographer:</span>
                        <span className="ml-2">TREYFA-TECH Team</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Image</h3>
                    <p className="text-gray-600 leading-relaxed">
                      This image showcases our commitment to excellence and innovation at Treyfa-Tech.
                      Every moment captured represents our dedication to delivering world-class technology
                      solutions and maintaining the highest standards in our work environment.
                    </p>
                  </div>

                  <div className="mt-8 flex space-x-4">
                    <button
                      onClick={() => setSelectedImage(null)}
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
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
