const express = require('express');
const Review = require('../models/Reviews'); // Import the review model
const { isAuthenticatedUser } = require('../middlewares/auth'); // Add authentication middleware

const router = express.Router();

// Route to add a review for a product
router.post('/review', isAuthenticatedUser, async (req, res) => {
  const { productId, reviewText, rating, orderId } = req.body;
  const userId = req.user._id; // Assuming `req.user` contains the authenticated user

  if (!productId || !reviewText || !rating) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  try {
    const review = new Review({
      productId,
      orderId,
      reviewText,
      rating,
      user: userId,
    });

    await review.save();
    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding review' });
  }
});

// Route to get all reviews for a product
router.get('/reviews/:productId', async (req, res) => {
  const { productId } = req.params;
  const { orderId } = req.query; // Extract orderId from query parameters

  try {
    // Build the query object dynamically
    const query = { productId };
    if (orderId) {
      query.orderId = orderId; // Add orderId to the query if provided
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email') // Populate user details (name, email)
      .exec();

    if (!reviews || reviews.length === 0) {
      return res.status(200).json({
        message: 'No reviews found for this product and order.',
        productId,       // Return the productId
        orderId,         // Return the orderId (if it exists)
      });
    }

    res.status(200).json({ reviews });
  } catch (error) {
    return res.status(200).json({
      message: 'No reviews found for this product and order.',
      productId,       // Return the productId
      orderId,         // Return the orderId (if it exists)
      warning: true
    });
  }
});



const { getAllReviews, deleteReview, updateReview } = require('../controllers/ReviewController');

router.get('/reviewAll/list', getAllReviews);
router.delete('/review/delete/:id', deleteReview);
router.put('/review/update/:productId/:orderId', updateReview);

module.exports = router;
