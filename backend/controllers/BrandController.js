const Brand = require('../models/Brands');
const slugify = require('slugify');

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


exports.getAllBrands = async (req, res) => {
try {
    const brands = await Brand.find({});
    
    res.status(200).json({
    message: "Brands fetched successfully",
    brands,
    });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
}
};

exports.create = async (req, res) => {
  try {
    const { name, company, website, description } = req.body;

    if (!name || !company || !website || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'brands',
          width: 150,
				  crop: "scale",  
        });
        imageUrls.push(result.secure_url); 
        fs.unlinkSync(file.path); 
      }
    }

    const newBrand = new Brand({
      name,
      company,
      website,
      description,
      image: imageUrls,  
    });

    await newBrand.save();

    res.status(201).json({
      message: "Brand created successfully",
      brand: newBrand,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBrandById = async (req, res) => {
    try {
      const brandId = req.params.id;
  
      const brand = await Brand.findById(brandId);
  
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
  
      res.status(200).json({
        message: "Brand fetched successfully",
        brand,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };  

exports.getBrandBySlug = async (req, res) => {
try {
    const brandSlug = req.params.slug;

    const brand = await Brand.findOne({ slug: brandSlug });

    if (!brand) {
    return res.status(404).json({ error: "Brand not found" });
    }

    res.status(200).json({
    message: "Brand fetched successfully",
    brand,
    });
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
}
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name, company, website, description } = req.body;
  const newSlug = slugify(name, { lower: true });

  try {
    const brand = await Brand.findOne({ slug });

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    let updatedImageUrls = [];

    if (req.files && req.files.length > 0) {
      if (brand.image && brand.image.length > 0) {
        for (const imageUrl of brand.image) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId); 
        }
      }

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'brands',
          width: 150,
				  crop: "scale",  
        });
        updatedImageUrls.push(result.secure_url);  
        fs.unlinkSync(file.path);  
      }
    } else {
      updatedImageUrls = brand.image;
    }

    brand.name = name;
    brand.company = company;
    brand.website = website;
    brand.description = description;
    brand.image = updatedImageUrls;  
    brand.slug = newSlug;

    await brand.save();

    res.status(200).json({
      message: 'Brand updated successfully',
      brand,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.remove = async (req, res) => {
    const { slug } = req.params;
    
    try {
      const brand = await Brand.findOneAndDelete({ slug }).exec();
  
      if (!brand) {
        return res.status(400).json({ error: 'Delete error: brand not found' });
      }
  
      return res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  