import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Image as ImageIcon,
  Briefcase,
  MessageSquare,
} from 'lucide-react';

import UserManagement from './UserManagement';
import BlogManagement from './BlogManagement';
import ConsultationManagement from './ConsultationManagement';
import SiteSettings from './SiteSettings';
import ServicesManagement from './ServicesManagement';
import GalleryManagement from './GalleryManagement';
import PortfolioManagement from './PortfolioManagement';

const AdminDashboard = () => {
  const {
    isAuthenticated,
    currentUser,
    logout,
    siteData,
    hasPermission,
    loading,
    error,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, permission: 'all' },
    { id: 'users', label: 'User Management', icon: <Users className="w-5 h-5" />, permission: 'all' },
    { id: 'blog', label: 'Blog Management', icon: <FileText className="w-5 h-5" />, permission: 'blog:create' },
    { id: 'consultations', label: 'Consultations', icon: <Calendar className="w-5 h-5" />, permission: 'consultation:view' },
    { id: 'services', label: 'Services', icon: <MessageSquare className="w-5 h-5" />, permission: 'all' },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase className="w-5 h-5" />, permission: 'all' },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-5 h-5" />, permission: 'all' },
    { id: 'settings', label: 'Site Settings', icon: <Settings className="w-5 h-5" />, permission: 'all' },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => hasPermission(item.permission) || hasPermission('all')
  );

  const stats = [
    { title: 'Total Users', value: '12', icon: <Users className="w-8 h-8 text-blue-600" />, color: 'bg-blue-100' },
    { title: 'Blog Posts', value: siteData.blog?.length || 0, icon: <FileText className="w-8 h-8 text-green-600" />, color: 'bg-green-100' },
    { title: 'Consultations', value: siteData.consultations?.length || 0, icon: <Calendar className="w-8 h-8 text-purple-600" />, color: 'bg-purple-100' },
    { title: 'Portfolio Items', value: siteData.portfolio?.length || 0, icon: <Briefcase className="w-8 h-8 text-orange-600" />, color: 'bg-orange-100' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'blog':
        return <BlogManagement />;
      case 'consultations':
        return <ConsultationManagement />;
      case 'services':
        return <ServicesManagement />;
      case 'portfolio':
        return <PortfolioManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'settings':
        return <SiteSettings />;
      default:
        return (
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">Welcome back, {currentUser?.username}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-16 h-16 ${stat.color} rounded-lg flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Blog Posts</h2>
                {siteData.blog?.length ? (
                  <div className="space-y-3">
                    {siteData.blog.slice(0, 5).map((post: any) => (
                      <div key={post.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{post.title}</p>
                          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No blog posts yet.</p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Consultations</h2>
                {siteData.consultations?.length ? (
                  <div className="space-y-3">
                    {siteData.consultations.slice(0, 5).map((consultation: any) => (
                      <div key={consultation.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{consultation.clientName}</p>
                          <p className="text-sm text-gray-500">{consultation.serviceType}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            consultation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : consultation.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {consultation.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No consultation requests yet.</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {hasPermission('blog:create') && (
                  <button
                    onClick={() => setActiveTab('blog')}
                    className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="w-6 h-6 text-blue-600" />
                    <span className="font-medium text-blue-900">Create Blog Post</span>
                  </button>
                )}
                {hasPermission('consultation:view') && (
                  <button
                    onClick={() => setActiveTab('consultations')}
                    className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Calendar className="w-6 h-6 text-green-600" />
                    <span className="font-medium text-green-900">Manage Consultations</span>
                  </button>
                )}
                {['services', 'portfolio', 'gallery', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {tab === 'services' && <MessageSquare className="w-6 h-6 text-indigo-600" />}
                    {tab === 'portfolio' && <Briefcase className="w-6 h-6 text-orange-600" />}
                    {tab === 'gallery' && <ImageIcon className="w-6 h-6 text-teal-600" />}
                    {tab === 'settings' && <Settings className="w-6 h-6 text-gray-600" />}
                    <span className="font-medium text-gray-900 capitalize">
                      {`Manage ${tab}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-admin-dashboard>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto z-30 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-sm text-gray-600">Treyfa-Tech</p>
        </div>

        <nav className="mt-6 pb-6">
          {visibleMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentUser?.username}</p>
              <p className="text-sm text-gray-500">
                {currentUser?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-16 min-h-screen">
        {error && (
          <div className="p-6">
            <ErrorMessage message={error} type="error" />
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
