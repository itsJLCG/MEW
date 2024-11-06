const bcrypt = require("bcrypt");
const User = require("../models/User");
const Customer = require("../models/Customer");
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const sendRegistrationEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register both User and Customer
exports.Register = async function (req, res) {
    const session = await mongoose.startSession(); // Start a session for transaction
    session.startTransaction();

    try {
        const { username, email, password, firstName, lastName, phoneNumber, address, zipCode } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new User instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: "customer", // Set role as customer
            verified: false // Not verified yet
        });

        // Save the user in the database with the transaction session
        const savedUser = await newUser.save({ session });

        // Upload the profile image to Cloudinary (if any)
        let profileImage = {};
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'register/users',
                width: 150,
                crop: "scale"
            });

            profileImage = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        // Create a new Customer instance reference to the User
        const newCustomer = new Customer({
            firstName,
            lastName,
            phoneNumber,
            address,
            zipCode,
            profileImage: profileImage,
            user: savedUser._id // Link the customer to the user
        });

        // Save the customer in the database with the same session
        const savedCustomer = await newCustomer.save({ session });

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        // Store the token in the user's record
        savedUser.verificationToken = verificationToken;
        await savedUser.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Send verification email with token
        const verificationUrl = `${req.protocol}://${req.get("host")}/api/auth/verify-email/${verificationToken}`;
        await sendRegistrationEmail(savedUser.email, verificationUrl);

        res.status(201).json({
            message: "Account has been registered successfully. Please verify your email to activate your account.",
            user: savedUser,
            customer: savedCustomer
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Email verification handler
exports.verifyEmail = async function (req, res) {
    try {
        const { token } = req.params;

        // Find the user with the matching token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token." });
        }

        // Verify the user
        user.verified = true;
        user.verificationToken = undefined; // Remove the token
        await user.save();

        res.status(200).json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Checks if Verified user before sending token
exports.Login = async function (req, res) {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Please enter email & password' });
        }

        // Find the user by email and include the password field for comparison
        let user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        // Check if the user is verified
        if (!user.verified) {
            return res.status(403).json({ message: 'Your account is not verified. Please verify your email to log in.' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }

        // Retrieve the associated customer
        const customer = await Customer.findOne({ user: user._id });
        if (!customer) {
            return res.status(404).json({ message: 'Customer details not found' });
        }

        // Generate JWT token
        const token = user.getJwtToken();

        // Return the token, user information, and customer ID
        return res.status(201).json({
            success: true,
            user,
            token,
            customerId: customer._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// // Uncommented example: Get user profile function
// exports.getUserProfile = async function (req, res, next) {
//     try {
//         // Fetch user by ID
//         const user = await User.findById(req.user.id);

//         // Fetch customer details linked to this user
//         const customer = await Customer.findOne({ user: req.user.id });

//         // Check if both user and customer exist
//         if (!user || !customer) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User or customer details not found"
//             });
//         }

//         // Return user and customer details in the response
//         return res.status(200).json({
//             success: true,
//             user: {
//                 _id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 role: user.role
//             },
//             customer: {
//                 _id: customer._id,
//                 firstName: customer.firstName,
//                 lastName: customer.lastName,
//                 phoneNumber: customer.phoneNumber,
//                 address: customer.address,
//                 zipCode: customer.zipCode,
//                 profileImage: customer.profileImage
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error fetching user profile" });
//     }
// }

// // Uncommented example: Update User and Customer profile function
// exports.updateProfile = async function (req, res, next) {
//     try {
//         const { username, email, firstName, lastName, phoneNumber, address, zipCode } = req.body;

//         // Initialize a new user data object
//         const newUserData = {
//             username,
//             email
//         };

//         // Start transaction session to update both User and Customer
//         const session = await mongoose.startSession();
//         session.startTransaction();

//         // Update the user details
//         const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
//             new: true,
//             runValidators: true,
//             session
//         });

//         // Initialize new customer data object
//         const newCustomerData = {
//             firstName,
//             lastName,
//             phoneNumber,
//             address,
//             zipCode
//         };

//         // Update profile image for customer if provided
//         if (req.file) {
//             const result = await cloudinary.uploader.upload(req.file.path, {
//                 folder: 'users',
//                 width: 150,
//                 crop: "scale"
//             });
//             newCustomerData.profileImage = {
//                 public_id: result.public_id,
//                 url: result.secure_url
//             };
//         }

//         const updatedCustomer = await Customer.findOneAndUpdate(
//             { user: req.user.id },
//             newCustomerData,
//             { new: true, runValidators: true, session }
//         );

//         // Commit the transaction
//         await session.commitTransaction();
//         session.endSession();

//         // Respond with updated user and customer details
//         return res.status(200).json({
//             success: true,
//             message: "Profile updated successfully",
//             user: updatedUser,
//             customer: updatedCustomer
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error updating profile", error: error.message });
//     }
// }

