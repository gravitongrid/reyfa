import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Briefcase, Plus, Edit3, Trash2, Calendar, User, Tag, X } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

const PortfolioManagement = () => {
  const { siteData, updateSiteData, hasPermission } = useAdmin();
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    category: '',
    technologies: [''],
    client: '',
    year: new Date().getFullYear().toString()
  });

  const canManagePortfolio = hasPermission('all');

  if (!canManagePortfolio) {
    return (
      <div className="p-8 text-center">
        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage portfolio.</p>
      </div>
    );
  }

  const portfolio = siteData.portfolio || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      id: formData.id || Date.now().toString(),
      technologies: formData.technologies.filter(tech => tech.trim() !== '')
    };

    if (editingProject) {
      const updatedPortfolio = portfolio.map((project: any) =>
        project.id === editingProject ? projectData : project
      );
      updateSiteData('portfolio', updatedPortfolio);
      setEditingProject(null);
    } else {
      updateSiteData('portfolio', [...portfolio, projectData]);
      setShowAddProject(false);
    }
    
    setFormData({
      id: '',
      title: '',
      description: '',
      image: '',
      category: '',
      technologies: [''],
      client: '',
      year: new Date().getFullYear().toString()
    });
  };

  const startEdit = (project: any) => {
    setEditingProject(project.id);
    setFormData({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      technologies: [...project.technologies],
      client: project.client,
      year: project.year
    });
    setShowAddProject(true);
  };

  const deleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio project?')) {
      const updatedPortfolio = portfolio.filter((project: any) => project.id !== id);
      updateSiteData('portfolio', updatedPortfolio);
    }
  };

  const addTechnology = () => {
    setFormData({ ...formData, technologies: [...formData.technologies, ''] });
  };

  const updateTechnology = (index: number, value: string) => {
    const newTechnologies = [...formData.technologies];
    newTechnologies[index] = value;
    setFormData({ ...formData, technologies: newTechnologies });
  };

  const removeTechnology = (index: number) => {
    const newTechnologies = formData.technologies.filter((_, i) => i !== index);
    setFormData({ ...formData, technologies: newTechnologies });
  };

  const categories = [
    'Web Development', 'Mobile Development', 'Desktop Application', 'IoT Solutions',
    'Healthcare', 'Education', 'E-commerce', 'Government', 'Finance', 'Other'
  ];

  return (
    <div className="p-6 pt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600 mt-1">Manage your company portfolio projects</p>
        </div>
        <button
          onClick={() => setShowAddProject(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      {/* Add/Edit Project Form */}
      {showAddProject && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
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
                    rows={4}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      min="2000"
                      max={new Date().getFullYear() + 1}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                  {formData.technologies.map((tech, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => updateTechnology(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter technology"
                      />
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Technology
                  </button>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingProject ? 'Update Project' : 'Add Project'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProject(false);
                      setEditingProject(null);
                      setFormData({
                        id: '',
                        title: '',
                        description: '',
                        image: '',
                        category: '',
                        technologies: [''],
                        client: '',
                        year: new Date().getFullYear().toString()
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
                category="portfolio"
                onImageSelect={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                selectedImage={formData.image}
                maxImages={20}
                title="Upload Project Image"
                description="Upload an image for the portfolio project"
              />
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Projects List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Portfolio Projects ({portfolio.length})</h2>
        </div>
        
        {portfolio.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio projects yet</h3>
            <p className="text-gray-600">Add your first portfolio project to get started.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {portfolio.map((project: any) => (
              <div key={project.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => startEdit(project)}
                      className="p-1 bg-white bg-opacity-90 text-blue-600 rounded hover:bg-opacity-100 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-1 bg-white bg-opacity-90 text-red-600 rounded hover:bg-opacity-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      <span>{project.client}</span>
                      <Calendar className="w-3 h-3 ml-3 mr-1" />
                      <span>{project.year}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <Tag className="w-3 h-3 mr-1 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech: string, index: number) => (
                          <span key={index} className="bg-gray-200 text-gray-700 px-1 py-0.5 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-gray-500">+{project.technologies.length - 3}</span>
                        )}
                      </div>
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

export default PortfolioManagement;