const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const slugify = require('slugify');

const promoSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,  
      required: true,
      min: 0,       
    },
    startDate: {
      type: Date,  
      required: true,  
    },
    endDate: {
        type: Date,  
        required: true,
      },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    image: [String],
  });
  
  promoSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });
  
  module.exports = mongoose.model('Promo', promoSchema);
  