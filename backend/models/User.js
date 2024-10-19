const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const slugify = require('slugify');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    image: [String],
  });

  userSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

module.exports = mongoose.model('User', userSchema);



