const mongoose = require('mongoose'); // Add this line
const User = require('../models/User');
const Customer = require('../models/Customer'); // Add this line if not already present
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const admin = require('../firebasebackend/firebaseAdmin');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create user with image upload to specific folder
exports.create = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'users',
          width: 150,
          crop: "scale",
        });
        imageUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const newUser = new User({
      name,
      email,
      address,
      image: imageUrls,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user with image upload to specific folder
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, email, address } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let updatedImageUrls = [];

    if (req.files && req.files.length > 0) {
      if (user.image && user.image.length > 0) {
        for (const imageUrl of user.image) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'users',
          width: 150,
          crop: "scale",
        });
        updatedImageUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    } else {
      updatedImageUrls = user.image;
    }

    user.name = name;
    user.email = email;
    user.address = address;
    user.image = updatedImageUrls;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    // Find and delete the user
    const user = await User.findByIdAndDelete(id, { session });

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Delete error: user not found' });
    }

    // Delete user from Firebase Authentication using firebaseUid
    if (user.firebaseUid) {
      await admin.auth().deleteUser(user.firebaseUid);
    }

    // Find and delete the related customer
    const customer = await Customer.findOneAndDelete({ user: id }, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: 'User and related customer deleted successfully' });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ error: 'Server error' });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role", error);
    res.status(500).json({ error: "Server error" });
  }
};