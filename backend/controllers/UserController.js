const User = require('../models/User');
const slugify = require('slugify');

// Image handling
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


// // Create user with image upload
// exports.create = async (req, res) => {
//   try {
//     const { name, email, address } = req.body;

//     if (!name || !email || !address) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     let imageUrls = [];
//     if (req.files && req.files.length > 0) {
//       // Loop through each file and upload to Cloudinary
//       for (const file of req.files) {
//         const result = await cloudinary.uploader.upload(file.path);
//         imageUrls.push(result.secure_url);  // Add uploaded image URL to array
//         fs.unlinkSync(file.path);  // Remove local file after uploading
//       }
//     }

//     const newUser = new User({
//       name,
//       email,
//       address,
//       image: imageUrls,  // Save the image URL in the database
//     });

//     await newUser.save();

//     res.status(201).json({
//       message: "User created successfully",
//       user: newUser,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

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
      // Loop through each file and upload to Cloudinary, creating the folder 'users' if not exists
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'users',
          width: 150,
				  crop: "scale",  // Upload image to 'users' folder
        });
        imageUrls.push(result.secure_url);  // Add uploaded image URL to array
        fs.unlinkSync(file.path);  // Remove local file after uploading
      }
    }

    const newUser = new User({
      name,
      email,
      address,
      image: imageUrls,  // Save the image URLs in the database
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

exports.getUserBySlug = async (req, res) => {
try {
    const userSlug = req.params.slug;

    const user = await User.findOne({ slug: userSlug });

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


// exports.update = async (req, res) => {
//   const { slug } = req.params;
//   const { name, email, address } = req.body;  // Simplified the form fields
//   const newSlug = slugify(name, { lower: true });

//   try {
//     // Step 1: Find the user to update
//     const user = await User.findOne({ slug });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Step 2: Clear old images if new images are being uploaded
//     let updatedImageUrls = [];

//     // Step 3: Handle image upload - only overwrite if new images are provided
//     if (req.files && req.files.length > 0) {
//       // Delete old images on Cloudinary (optional: if you store Cloudinary image public IDs)
//       if (user.image && user.image.length > 0) {
//         for (const imageUrl of user.image) {
//           const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
//           await cloudinary.uploader.destroy(publicId); // Delete image from Cloudinary
//         }
//       }

//       // Upload new images
//       for (const file of req.files) {
//         const result = await cloudinary.uploader.upload(file.path);
//         updatedImageUrls.push(result.secure_url);  // Add new image URLs
//         fs.unlinkSync(file.path);  // Remove the local file after uploading to Cloudinary
//       }
//     } else {
//       // If no new images are uploaded, retain the existing images
//       updatedImageUrls = user.image;
//     }

//     // Step 4: Update user fields and overwrite the image field
//     user.name = name;
//     user.email = email;
//     user.address = address;
//     user.image = updatedImageUrls;  // Overwrite old images with new images (or retain if no new images)
//     user.slug = newSlug;

//     // Save the updated user
//     await user.save();

//     res.status(200).json({
//       message: 'User updated successfully',
//       user,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };


// Update user with image upload to specific folder
exports.update = async (req, res) => {
  const { slug } = req.params;
  const { name, email, address } = req.body;
  const newSlug = slugify(name, { lower: true });

  try {
    // Step 1: Find the user to update
    const user = await User.findOne({ slug });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Step 2: Clear old images if new images are being uploaded
    let updatedImageUrls = [];

    // Step 3: Handle image upload - only overwrite if new images are provided
    if (req.files && req.files.length > 0) {
      // Delete old images on Cloudinary (optional: if you store Cloudinary image public IDs)
      if (user.image && user.image.length > 0) {
        for (const imageUrl of user.image) {
          const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
          await cloudinary.uploader.destroy(publicId); // Delete image from Cloudinary
        }
      }

      // Upload new images to 'users' folder
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'users',
          width: 150,
				  crop: "scale",  // Upload image to 'users' folder
        });
        updatedImageUrls.push(result.secure_url);  // Add new image URLs
        fs.unlinkSync(file.path);  // Remove the local file after uploading to Cloudinary
      }
    } else {
      // If no new images are uploaded, retain the existing images
      updatedImageUrls = user.image;
    }

    // Step 4: Update user fields and overwrite the image field
    user.name = name;
    user.email = email;
    user.address = address;
    user.image = updatedImageUrls;  // Overwrite old images with new images (or retain if no new images)
    user.slug = newSlug;

    // Save the updated user
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
    const { slug } = req.params;
    
    try {
      const user = await User.findOneAndDelete({ slug }).exec();
  
      if (!user) {
        return res.status(400).json({ error: 'Delete error: user not found' });
      }
  
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  