// middlewares/auth.js

const User = require('../models/User');
const Customer = require('../models/Customer');
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Login first to access this resource' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch the user using the decoded id
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch associated Customer record
        const customer = await Customer.findOne({ user: req.user._id });

        if (customer) {
            req.user.customerId = customer._id; // Attach customer ID to req.user
        } else {
            req.user.customerId = null; // Set to null if no associated customer found
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};
