import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Settings, Save, Globe, Palette, Upload, Image as ImageIcon } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

const SiteSettings = () => {
  const { siteData, updateSiteData, hasPermission } = useAdmin();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    companyName: siteData.header.companyName,
    logo: siteData.header.logo,
    logoImage: siteData.header.logoImage || '',
    favicon: siteData.header.favicon || '',
    heroTitle: siteData.hero.title,
    heroSubtitle: siteData.hero.subtitle,
    heroDescription: siteData.hero.description,
    aboutTitle: siteData.about.title,
    aboutDescription: siteData.about.description,
    aboutMission: siteData.about.mission,
    aboutVision: siteData.about.vision,
    contactEmail: siteData.contact.email,
    contactPhone: siteData.contact.phone,
    contactAddress: siteData.contact.address,
    contactBusinessHours: siteData.contact.businessHours,
    footerTagline: siteData.footer.tagline,
    footerDescription: siteData.footer.description,
    footerCopyright: siteData.footer.copyright,
  });

  const canManageSettings = hasPermission('all');

  if (!canManageSettings) {
    return (
      <div className="p-8 text-center">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage site settings.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateSiteData('header', {
      ...siteData.header,
      companyName: formData.companyName,
      logo: formData.logo,
      logoImage: formData.logoImage,
      favicon: formData.favicon,
    });

    updateSiteData('hero', {
      ...siteData.hero,
      title: formData.heroTitle,
      subtitle: formData.heroSubtitle,
      description: formData.heroDescription,
    });

    updateSiteData('about', {
      ...siteData.about,
      title: formData.aboutTitle,
      description: formData.aboutDescription,
      mission: formData.aboutMission,
      vision: formData.aboutVision,
    });

    updateSiteData('contact', {
      ...siteData.contact,
      email: formData.contactEmail,
      phone: formData.contactPhone,
      address: formData.contactAddress,
      businessHours: formData.contactBusinessHours,
    });

    updateSiteData('footer', {
      ...siteData.footer,
      companyName: formData.companyName,
      tagline: formData.footerTagline,
      description: formData.footerDescription,
      copyright: formData.footerCopyright,
    });

    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'branding', label: 'Branding', icon: <Palette className="w-4 h-4" /> },
    { id: 'content', label: 'Content', icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 pt-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600 mt-1">Manage your website configuration and content</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-lg">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Text</label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., TT"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
              <textarea
                name="contactAddress"
                value={formData.contactAddress}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
              <input
                type="text"
                name="contactBusinessHours"
                value={formData.contactBusinessHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Monday - Friday: 8:00 AM - 6:00 PM"
              />
            </div>
          </div>
        )}

        {/* Branding */}
        {activeTab === 'branding' && (
          <div className="p-6 space-y-8">
            <h2 className="text-xl font-semibold text-gray-900">Branding & Visual Identity</h2>

            {/* Logo */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Logo</h3>
              <div className="flex items-center space-x-2 mb-2">
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Upload your company logo</span>
              </div>
              <ImageUploader
                category="logo"
                onImageSelect={(imageUrl) => setFormData({ ...formData, logoImage: imageUrl })}
                selectedImage={formData.logoImage}
                maxImages={1}
                title="Upload Logo"
                description="Upload your company logo (recommended size: 200x200px)"
              />
              {formData.logoImage && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-gray-700">Current Logo Preview:</p>
                  </div>
                  <img
                    src={formData.logoImage}
                    alt="Logo Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Favicon */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Favicon</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                  <input
                    type="url"
                    name="favicon"
                    value={formData.favicon}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
                {formData.favicon && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Favicon Preview:</p>
                    <img
                      src={formData.favicon}
                      alt="Favicon Preview"
                      className="w-8 h-8 object-cover rounded border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer Branding */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Footer Branding</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Footer Tagline</label>
                <input
                  type="text"
                  name="footerTagline"
                  value={formData.footerTagline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., & Integrated Services Ltd"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Footer Description</label>
                <textarea
                  name="footerDescription"
                  value={formData.footerDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description for footer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                <input
                  type="text"
                  name="footerCopyright"
                  value={formData.footerCopyright}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="© 2025 Your Company. All rights reserved."
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === 'content' && (
          <div className="p-6 space-y-8">
            <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>

            {/* Hero */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Hero Section</h3>
              <input
                type="text"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                placeholder="Hero Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleChange}
                placeholder="Hero Subtitle"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="heroDescription"
                value={formData.heroDescription}
                onChange={handleChange}
                rows={3}
                placeholder="Hero Description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* About */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">About Section</h3>
              <input
                type="text"
                name="aboutTitle"
                value={formData.aboutTitle}
                onChange={handleChange}
                placeholder="About Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="aboutDescription"
                value={formData.aboutDescription}
                onChange={handleChange}
                rows={4}
                placeholder="About Description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="aboutMission"
                value={formData.aboutMission}
                onChange={handleChange}
                rows={3}
                placeholder="Mission Statement"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="aboutVision"
                value={formData.aboutVision}
                onChange={handleChange}
                rows={3}
                placeholder="Vision Statement"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteSettings;
