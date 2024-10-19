const Category = require('../models/Categories');
const slugify = require('slugify');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'categories',
          width: 150,
				  crop: "scale",  
        });
        imageUrls.push(result.secure_url); 
        fs.unlinkSync(file.path); 
      }
    }

    const newCategory = new Category({
      name,
      description,
      image: imageUrls,  
    });

    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      message: "Category fetched successfully",
      category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const categorySlug = req.params.slug;

    const category = await Category.findOne({ slug: categorySlug });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      message: "Category fetched successfully",
      category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name, description } = req.body;
  const newSlug = slugify(name, { lower: true });

  try {
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    let updatedImageUrls = [];

    if (req.files && req.files.length > 0) {
      if (category.image && category.image.length > 0) {
        for (const imageUrl of category.image) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId); 
        }
      }

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'categories',
          width: 150,
				  crop: "scale",  
        });
        updatedImageUrls.push(result.secure_url);  
        fs.unlinkSync(file.path);  
      }
    } else {
      updatedImageUrls = category.image;
    }

    category.name = name;
    category.description = description;
    category.image = updatedImageUrls;  
    category.slug = newSlug;

    await category.save();

    res.status(200).json({
      message: 'Category updated successfully',
      category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  const { slug } = req.params;
    
  try {
    const category = await Category.findOneAndDelete({ slug }).exec();

    if (!category) {
      return res.status(400).json({ error: 'Delete error: category not found' });
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
