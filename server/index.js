const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const consultationRoutes = require('./routes/consultations');
const siteDataRoutes = require('./routes/siteData');
const portfolioRoutes = require('./routes/portfolio');
const galleryRoutes = require('./routes/gallery');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.mongodb.com"]
    }
  }
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 

    ? [process.env.FRONTEND_URL, 'https://treyfatech-b8a4b76df4a0.herokuapp.com/']

    ? [process.env.FRONTEND_URL, 'https://your-app-name.herokuapp.com']

    ? [process.env.FRONTEND_URL, 'https://treyfatech-b8a4b76df4a0.herokuapp.com/']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection

/* const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://treyfatech_db_user:Kolenda1995@Cluster0.mongodb.net/', {
      useNewUrlParser: true,
=======
=======
=======
const connectDB = async () => {
  try {
<<<<<<< HEAD
    // Ensure we are using the correct connection string
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://treyfatech_db_user:Kolenda1995@Cluster0.mongodb.net/'   
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useFindAndModify: false,   // Avoid deprecation warning for findAndModify
      useCreateIndex: true,      // Ensures the index creation is done correctly
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000,    // Timeout for socket operations
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    // Attempt to gracefully exit the application
    process.exit(1); // You can later add retry logic here if desired
  }
};

// Connect to the database
connectDB();

// Gracefully handle process termination
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed due to application termination');
    process.exit(0);
  });
});
>>>>>>> c57a8377 (update)


<<<<<<< HEAD
// MongoDB Connection
>>>>>>> 0c805960 (update)
const connectDB = async () => {
  try {
    // Ensure we are using the correct connection string
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://treyfatech_db_user:Kolenda1995@Cluster0.mongodb.net/    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useFindAndModify: false,   // Avoid deprecation warning for findAndModify
      useCreateIndex: true,      // Ensures the index creation is done correctly
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000,    // Timeout for socket operations
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    // Attempt to gracefully exit the application
    process.exit(1); // You can later add retry logic here if desired
  }
};

// Connect to the database
connectDB();

// Gracefully handle process termination
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed due to application termination');
    process.exit(0);
  });
});

=======
>>>>>>> 2859b385 (update)
/* const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://treyfatech_db_user:Kolenda1995@Cluster0.mongodb.net/treyfatech_db_user?retryWrites=true&w=majority', {
=======
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://treyfatech_db_user:Kolenda1995@Cluster0.mongodb.net/', {
>>>>>>> 8bd7951d (update)
      useNewUrlParser: true,
<<<<<<< HEAD
      useUnifiedTopology: true,
>>>>>>> 76cb5bbb (Initial deployment to Heroku)
=======
>>>>>>> 5e5bf4fc (update)
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
connectDB(); */
=======
connectDB();
>>>>>>> 76cb5bbb (Initial deployment to Heroku)
=======
connectDB(); */
>>>>>>> 0c805960 (update)
=======
connectDB();
>>>>>>> 8bd7951d (update)
=======
connectDB(); */
>>>>>>> 4327e441 (update)

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/site-data', siteDataRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
<<<<<<< HEAD
<<<<<<< HEAD
  // Serve static files from the dist directory
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  
  // Handle React routing - send all non-API requests to React app
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
=======
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle React routing - send all non-API requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
>>>>>>> 76cb5bbb (Initial deployment to Heroku)
=======
  // Serve static files from the dist directory
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  
  // Handle React routing - send all non-API requests to React app
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
>>>>>>> c950fe90 (Initial deployment to Heroku)
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for API routes
<<<<<<< HEAD
<<<<<<< HEAD
app.use('/api/*splat', (req, res) => {
=======
app.use('/api/*', (req, res) => {
>>>>>>> 76cb5bbb (Initial deployment to Heroku)
=======
app.use('/api/*splat', (req, res) => {
>>>>>>> 216e3dbd (make it better)
  res.status(404).json({ message: 'API endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

module.exports = app;