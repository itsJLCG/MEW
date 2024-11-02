//Custom script to delete all data from users and customers collections in MongoDB
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database'); // Adjust the path based on your directory structure

// Load environment variables
dotenv.config({ path: 'config/.env' });

// Import your models
const User = require('../models/user'); // Adjust the path based on your models
const Customer = require('../models/customer');

async function deleteAllData() {
    try {
        // Connect to MongoDB
        await connectDatabase(); // Call your connectDatabase function

        // Delete all users
        const usersDeleted = await User.deleteMany({});
        console.log(`${usersDeleted.deletedCount} users deleted.`);

        // Delete all customers
        const customersDeleted = await Customer.deleteMany({});
        console.log(`${customersDeleted.deletedCount} customers deleted.`);

    } catch (error) {
        console.error('Error deleting data:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
    }
}

// Execute the script
deleteAllData();
