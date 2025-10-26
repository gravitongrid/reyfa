const express = require('express');
const SiteData = require('../models/SiteData');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all site data
router.get('/', async (req, res) => {
  try {
    const siteData = await SiteData.find();
    
    // Convert to object format
    const data = {};
    siteData.forEach(item => {
      data[item.section] = item.data;
    });

    res.json(data);
  } catch (error) {
    console.error('Get site data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific section
router.get('/:section', async (req, res) => {
  try {
    const siteData = await SiteData.findOne({ section: req.params.section });
    
    if (!siteData) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(siteData.data);
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update site data section
router.put('/:section', auth, async (req, res) => {
  try {
    // Check permissions (only super admin can update site data)
    if (!req.user.permissions.includes('all')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { section } = req.params;
    const { data } = req.body;

    const siteData = await SiteData.findOneAndUpdate(
      { section },
      { section, data },
      { upsert: true, new: true }
    );

    res.json({
      message: 'Site data updated successfully',
      section,
      data: siteData.data
    });
  } catch (error) {
    console.error('Update site data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize default site data
router.post('/initialize', auth, async (req, res) => {
  try {
    // Check permissions
    if (!req.user.permissions.includes('all')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const defaultData = {
      hero: {
        title: "World-Class Technology Solutions",
<<<<<<< HEAD
<<<<<<< HEAD
        subtitle: "Treyfa-Tech & Integrated Services Ltd",
        description: "Empowering businesses in Nigeria and beyond with cutting-edge software development, IT consulting, and integrated technology services."
      },
      header: {
        companyName: "TREYFA-TECH",
        logo: "",
=======
        subtitle: "Treyfat-Tech & Integrated Services Ltd",
        description: "Empowering businesses in Nigeria and beyond with cutting-edge software development, IT consulting, and integrated technology services."
      },
      header: {
        companyName: "Treyfat-Tech",
        logo: "TT",
>>>>>>> 76cb5bbb (Initial deployment to Heroku)
=======
        subtitle: "Treyfa-Tech & Integrated Services Ltd",
        description: "Empowering businesses in Nigeria and beyond with cutting-edge software development, IT consulting, and integrated technology services."
      },
      header: {
        companyName: "TREYFA-TECH",
        logo: "",
>>>>>>> 72b8caa0 (update)
        navigation: [
          { label: "Home", link: "/" },
          { label: "About", link: "#about" },
          { label: "Services", link: "#services" },
          { label: "Portfolio", link: "/portfolio" },
          { label: "Contact", link: "#contact" }
        ]
      },
      footer: {
<<<<<<< HEAD
<<<<<<< HEAD
        companyName: "TREYFA-TECH",
        tagline: "& INTEGRATED SERVICES LTD",
=======
        companyName: "Treyfat-Tech",
        tagline: "& Integrated Services Ltd",
>>>>>>> 76cb5bbb (Initial deployment to Heroku)
=======
        companyName: "TREYFA-TECH",
        tagline: "& INTEGRATED SERVICES LTD",
>>>>>>> 72b8caa0 (update)
        description: "Empowering businesses with world-class technology solutions across Nigeria and beyond.",
        socialLinks: [
          { platform: "Facebook", url: "#" },
          { platform: "Twitter", url: "#" },
          { platform: "LinkedIn", url: "#" },
          { platform: "Instagram", url: "#" },
          { platform: "YouTube", url: "#" }
        ],
        quickLinks: ["Home", "Services", "About Us", "Contact"],
        services: [
          "Software Development",
          "IT Training & Consultancy", 
          "Business Process Outsourcing",
          "Hardware & IoT Solutions",
          "Data Management"
        ],
<<<<<<< HEAD
<<<<<<< HEAD
        copyright: "© 2024 Treyfa-Tech & Integrated Services Ltd. All rights reserved."
      },
      about: {
        title: "About Treyfa-Tech",
        description: "Treyfa-Tech & Integrated Services Ltd is a leading technology company dedicated to providing comprehensive IT solutions that drive business growth and digital transformation. Based in Nigeria, we serve clients across Africa and beyond.",
=======
        copyright: "© 2024 Treyfat-Tech & Integrated Services Ltd. All rights reserved."
      },
      about: {
        title: "About Treyfat-Tech",
        description: "Treyfat-Tech & Integrated Services Ltd is a leading technology company dedicated to providing comprehensive IT solutions that drive business growth and digital transformation. Based in Nigeria, we serve clients across Africa and beyond.",
>>>>>>> 76cb5bbb (Initial deployment to Heroku)
=======
        copyright: "© 2024 Treyfa-Tech & Integrated Services Ltd. All rights reserved."
      },
      about: {
        title: "About Treyfa-Tech",
        description: "Treyfa-Tech & Integrated Services Ltd is a leading technology company dedicated to providing comprehensive IT solutions that drive business growth and digital transformation. Based in Nigeria, we serve clients across Africa and beyond.",
>>>>>>> 72b8caa0 (update)
        mission: "To empower businesses with innovative technology solutions that enhance productivity, drive growth, and create sustainable competitive advantages in the digital economy.",
        vision: "To be the leading technology partner for businesses across Africa, driving digital transformation and innovation through world-class solutions and exceptional service delivery."
      },
      contact: {
<<<<<<< HEAD
<<<<<<< HEAD
        email: "info@Treyfa-tech.com",
=======
        email: "info@treyfat-tech.com",
>>>>>>> 76cb5bbb (Initial deployment to Heroku)
=======
        email: "info@Treyfa-tech.com",
>>>>>>> 72b8caa0 (update)
        phone: "+234 (0) 123 456 7890",
        address: "Shop No.5 EPP Plaza Sangere FUTY Opposite MAU Main Gate Ground Floor Adamawa State Girei",
        businessHours: "Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM"
      }
    };

    // Initialize each section
    for (const [section, data] of Object.entries(defaultData)) {
      await SiteData.findOneAndUpdate(
        { section },
        { section, data },
        { upsert: true }
      );
    }

    res.json({
      message: 'Site data initialized successfully',
      sections: Object.keys(defaultData)
    });
  } catch (error) {
    console.error('Initialize site data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;