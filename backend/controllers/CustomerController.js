// // customerController.js

// const Customer = require('../models/Customer'); // Adjust the path as necessary
// const User = require('../models/User'); // Adjust the path as necessary

// // Function to get all customers
// exports.getAllCustomers = async (req, res) => {
//     try {
//         const customers = await Customer.find(); // Retrieve all customers from the database
//         res.status(200).json(customers); // Send the customer data as a response
//     } catch (error) {
//         console.error("Error fetching customers:", error);
//         res.status(500).json({ message: "Server error" }); // Handle server errors
//     }
// };

// // exports.getCustomersByUserId = async (req, res) => {
// //     try {
// //         const userId = req.user._id; // Assuming you have user information from token in req.user
// //         const customers = await Customer.find({ user: userId }); // Find customers with matching userId
// //         res.status(200).json(customers); // Send the customer data as a response
// //     } catch (error) {
// //         console.error("Error fetching customers:", error);
// //         res.status(500).json({ message: "Server error" }); // Handle server errors
// //     }
// // };
