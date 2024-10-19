const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,  
    required: true,
    min: 0,       
  },
  stock: {
    type: Number,  
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

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Product', productSchema);
