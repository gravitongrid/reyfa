import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Image as ImageIcon, Plus, Edit3, Trash2, Calendar } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

const GalleryManagement = () => {
  const { siteData, updateSiteData, hasPermission } = useAdmin();
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const canManageGallery = hasPermission('all');

  if (!canManageGallery) {
    return (
      <div className="p-8 text-center">
        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage gallery.</p>
      </div>
    );
  }

  const gallery = siteData.gallery || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      ...formData,
      id: formData.id || Date.now().toString()
    };

    if (editingItem) {
      const updatedGallery = gallery.map((item: any) =>
        item.id === editingItem ? itemData : item
      );
      updateSiteData('gallery', updatedGallery);
      setEditingItem(null);
    } else {
      updateSiteData('gallery', [...gallery, itemData]);
    }
    
    setShowAddItem(false);
    
    setFormData({
      id: '',
      title: '',
      description: '',
      image: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const startEdit = (item: any) => {
    setEditingItem(item.id);
    setFormData({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
      date: item.date
    });
    setShowAddItem(true);
  };

  const deleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      const updatedGallery = gallery.filter((item: any) => item.id !== id);
      updateSiteData('gallery', updatedGallery);
    }
  };

  const categories = ['Office', 'Team', 'Technology', 'Business', 'Development', 'Training', 'Events'];

  return (
    <div className="p-6 pt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage your company gallery images</p>
        </div>
        <button
          onClick={() => setShowAddItem(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Image
        </button>
      </div>

      {/* Add/Edit Item Form */}
      {showAddItem && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddItem(false);
                      setEditingItem(null);
                      setFormData({
                        id: '',
                        title: '',
                        description: '',
                        image: '',
                        category: '',
                        date: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div>
              <ImageUploader
                category="gallery"
                onImageSelect={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                selectedImage={formData.image}
                maxImages={20}
                title="Upload Gallery Image"
                description="Upload an image for the gallery"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gallery Items List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Gallery Items ({gallery.length})</h2>
        </div>
        
        {gallery.length === 0 ? (
          <div className="p-8 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gallery items yet</h3>
            <p className="text-gray-600">Add your first gallery item to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {gallery.map((item: any) => (
              <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-1 bg-white bg-opacity-90 text-blue-600 rounded hover:bg-opacity-100 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1 bg-white bg-opacity-90 text-red-600 rounded hover:bg-opacity-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;