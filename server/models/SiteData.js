const mongoose = require('mongoose');

const siteDataSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteData', siteDataSchema);