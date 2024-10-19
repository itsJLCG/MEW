const Promo = require('../models/Promos');
const slugify = require('slugify');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getAllPromos = async (req, res) => {
  try {
    const promos = await Promo.find({});
    res.status(200).json({
      message: "Promos fetched successfully",
      promos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, discount, startDate, endDate } = req.body;

    if (!name || !description || !discount || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'promos',
          width: 150,
          crop: "scale",
        });
        imageUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const newPromo = new Promo({
      name,
      description,
      discount,
      startDate,
      endDate,
      image: imageUrls,
      slug: slugify(name, { lower: true }),
    });

    await newPromo.save();

    res.status(201).json({
      message: "Promo created successfully",
      promo: newPromo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPromoById = async (req, res) => {
  try {
    const promoId = req.params.id;
    const promo = await Promo.findById(promoId);

    if (!promo) {
      return res.status(404).json({ error: "Promo not found" });
    }

    res.status(200).json({
      message: "Promo fetched successfully",
      promo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPromoBySlug = async (req, res) => {
  try {
    const promoSlug = req.params.slug;
    const promo = await Promo.findOne({ slug: promoSlug });

    if (!promo) {
      return res.status(404).json({ error: "Promo not found" });
    }

    res.status(200).json({
      message: "Promo fetched successfully",
      promo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name, description, discount, startDate, endDate } = req.body;
  const newSlug = slugify(name, { lower: true });

  try {
    const promo = await Promo.findOne({ slug });

    if (!promo) {
      return res.status(404).json({ error: 'Promo not found' });
    }

    let updatedImageUrls = [];

    if (req.files && req.files.length > 0) {
      if (promo.image && promo.image.length > 0) {
        for (const imageUrl of promo.image) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'promos',
          width: 150,
          crop: "scale",
        });
        updatedImageUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    } else {
      updatedImageUrls = promo.image;
    }

    promo.name = name;
    promo.description = description;
    promo.discount = discount;
    promo.startDate = startDate;
    promo.endDate = endDate;
    promo.image = updatedImageUrls;
    promo.slug = newSlug;

    await promo.save();

    res.status(200).json({
      message: 'Promo updated successfully',
      promo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  const { slug } = req.params;

  try {
    const promo = await Promo.findOneAndDelete({ slug }).exec();

    if (!promo) {
      return res.status(400).json({ error: 'Delete error: promo not found' });
    }

    return res.status(200).json({ message: 'Promo deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
