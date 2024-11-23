// Import the Review model
const Review = require('../models/Reviews');

/**
 * Fetch all reviews from the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getAllReviews = async (req, res) => {
    try {
        // Fetch all reviews
        const reviews = await Review.find();
        
        // Send the reviews as a response
        res.status(200).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message,
        });
    }
};

/**
 * Delete a review from the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const deleteReview = async (req, res) => {
    try {
        // Get the review ID from the request parameters
        const { id } = req.params;

        // Check if the review exists
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            });
        }

        // Delete the review
        await Review.findByIdAndDelete(id);

        // Send a success response
        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message,
        });
    }
};

module.exports = { getAllReviews, deleteReview };
