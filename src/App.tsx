import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider, useAdmin } from './context/AdminContext';

import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

import Portfolio from './pages/Portfolio';
import ServiceDetail from './pages/ServiceDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Consultation from './pages/Consultation';

// ✅ Favicon updater component
function FaviconUpdater() {
  const { siteData } = useAdmin();

  React.useEffect(() => {
    if (siteData?.header?.favicon) {
      // Remove existing favicon
      const existingFavicon = document.querySelector('link[rel="icon"]');
      if (existingFavicon) {
        existingFavicon.remove();
      }

      // Add new favicon
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = siteData.header.favicon;
      document.head.appendChild(link);
    }
  }, [siteData?.header?.favicon]);

  return null;
}

// ✅ Home page section
function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <Contact />
    </>
  );
}

// ✅ Main App component
function App() {
  return (
    <AdminProvider>
      <Router>
        <div className="min-h-screen bg-white relative">
          <FaviconUpdater />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/service/:serviceId" element={<ServiceDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/consultation" element={<Consultation />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;
