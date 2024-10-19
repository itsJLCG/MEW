const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const slugify = require('slugify');

const brandSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    website: {
      type: String,  
      required: true,
      min: 0,       
    },
    description: {
      type: String,  
      required: true,
      min: 0,        
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    image: [String],
  });
  
  brandSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });
  
  module.exports = mongoose.model('Brand', brandSchema);
  