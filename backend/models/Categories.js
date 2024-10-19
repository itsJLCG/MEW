const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
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
  
  categorySchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });
  
  module.exports = mongoose.model('Category', categorySchema);
  