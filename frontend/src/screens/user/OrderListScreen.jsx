import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../styles/styles';
import Breadcrumb from '../../components/common/Breadcrumb';
import { UserContent, UserDashboardWrapper } from '../../styles/user';
import UserMenu from '../../components/user/UserMenu';
import Title from '../../components/common/Title';
import { defaultTheme } from '../../styles/themes/default';
import { Toaster, toast } from 'react-hot-toast';
import { Button, TextField } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Filter } from 'bad-words'; // Use named import
import CartEmpty from '../cart/CartEmptyScreen';


const filter = new Filter(); // Create an instance of the filter

const OrderListScreenWrapper = styled.div`
  padding: 20px 0;

  .order-tabs-contents {
    margin-top: 40px;
  }

  .order-item {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid ${defaultTheme.color_whitesmoke};
    border-radius: 8px;

    h3 {
      font-size: 20px;
      font-weight: bold;
    }

    p {
      margin: 8px 0;
      color: ${defaultTheme.color_gray};
    }

    .order-header {
      margin-bottom: 15px;
    }

    .order-items {
      margin-top: 10px;

      .order-item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;

        img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          margin-right: 15px;
        }

        .item-details {
          flex-grow: 1;

          h5 {
            margin: 0;
            font-size: 16px;
          }

          p {
            margin: 0;
            color: #555;
          }
        }

        .rate-button {
          background-color: #10b9b0;
          color: white;
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;

          &:hover {
            background-color: #e374a1;
          }
        }
      }
    }

    .order-summary {
      margin-top: 20px;
      font-size: 16px;
      font-weight: bold;
    }

    .update-button {
          background-color: #10b9b0;
          color: white;
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;

          &:hover {
            background-color: #e374a1;
          }
    }
  }
`;

const ReviewFormWrapper = styled.div`
  margin-top: 10px;
  transition: all 0.3s ease;

  .rating {
    margin-top: 10px;
    font-size: 24px;
    color: #ffd700;
    display: flex;
    gap: 5px;

    span {
      cursor: pointer;
    }
  }

  button {
    background-color: #ff85c1;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    display: block;
    width: 100%;

    &:hover {
      background-color: #e374a1;
    }
  }
`;

const breadcrumbItems = [
  { label: 'Home', link: '/' },
  { label: 'Order', link: '' },
];

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isReviewing, setIsReviewing] = useState(null); // Tracks which product is being reviewed
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1); // Default rating
  const [reviews, setReviews] = useState({}); // Store reviews by productId and orderId
  const [isEditing, setIsEditing] = useState(null); // Tracks which review is being edited
  const [editReviewText, setEditReviewText] = useState(''); // Holds the text for editing reviews
  const [editRating, setEditRating] = useState(1); // Holds the rating for editing reviews

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login'); // Redirect if not authenticated
          return;
        }

        const response = await axios.get('http://localhost:4000/api/orders/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.orders);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    const fetchReviews = async (productId, orderId) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/reviews/reviews/${productId}?orderId=${orderId}` // Use the correct URL format
        );
    
        console.log('Reviews fetched:', response.data);
    
        // Check if reviews exist and update the state accordingly
        setReviews((prev) => ({
          ...prev,
          [`${productId}_${orderId}`]: response.data.reviews || [], // If no reviews, store an empty array
        }));
      } catch (err) {
        // You can choose to not update the state or update it with an empty array instead of showing an error
        setReviews((prev) => ({
          ...prev,
          [`${productId}_${orderId}`]: [], // If error occurs, set empty array (no reviews)
        }));
      }
    };
    

    if (orders.length > 0) {
      orders.forEach((order) => {
        order.orderItems.forEach((item) => {
          fetchReviews(item.product, order._id); // Include orderId
        });
      });
    }
  }, [orders]);

  const handleSubmitReview = async (productId, orderId) => {
    try {
      // Clean the review text by masking bad words
      const cleanedReviewText = filter.clean(reviewText);
  
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://localhost:4000/api/reviews/review',
        { productId, orderId, reviewText: cleanedReviewText, rating }, // Send the cleaned text
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Review submitted successfully!');
  
      if (!productId || !orderId) {
        toast.error('Product or Order ID is missing.');
        return;
      }
  
      // Update reviews state with the new masked review
      setReviews((prev) => ({
        ...prev,
        [`${productId}_${orderId}`]: [
          ...(prev[`${productId}_${orderId}`] || []), // Preserve existing reviews
          { reviewText: cleanedReviewText, rating }, // Add new review
        ],
      }));
  
      // Reset form
      setIsReviewing(null);
      setReviewText('');
      setRating(1);
    setIsEditing(null);   // Ensure no edit state is triggered
    setRating(1);
    console.log('isReviewing:', isReviewing);
    console.log('isEditing:', isEditing);
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit review.');
    }
  };

  const handleCloseReviewForm = () => {
    setIsReviewing(null); // Close the review form
    setIsEditing(null);
    setEditReviewText(null);
  };

  const handleEditReview = (productId, orderId, review) => {
    setIsEditing({ productId, orderId, reviewId: review._id }); // Open the edit form
    setEditReviewText(review.reviewText); // Prefill the review text for editing
    setEditRating(review.rating); // Prefill the rating for editing
  };
  
  const handleSubmitUpdatedReview = async () => {
    if (!isEditing) return;
  
    const { productId, orderId, reviewId } = isEditing;
  
    try {
      const cleanedReviewText = filter.clean(editReviewText);
  
      const token = localStorage.getItem('authToken');
      await axios.put(
        `http://localhost:4000/api/reviews/review/update/${productId}/${orderId}`, // Update endpoint with reviewId
        { reviewText: cleanedReviewText, rating: editRating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Review updated successfully!');
  
      // Update the reviews state with the updated review
      setReviews((prev) => ({
        ...prev,
        [`${productId}_${orderId}`]: prev[`${productId}_${orderId}`].map((review) =>
          review._id === reviewId ? { ...review, reviewText: cleanedReviewText, rating: editRating } : review
        ),
      }));
  
      // Reset edit state
      setIsEditing(null);
      setEditReviewText('');
      setEditRating(1);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update review.');
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(null); // Close the edit form
    setEditReviewText('');
    setEditRating(1);
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <OrderListScreenWrapper>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <Title titleText={'My Orders'} />
            {orders.length === 0 ? (
              <p><CartEmpty /></p>
            ) : (
              <div className="order-tabs-contents">
                {orders.map((order) => (
                  <div key={order._id} className="order-item">
                    <div className="order-header">
                      <h3>Order #{order._id}</h3>
                      <p>Status: {order.orderStatus}</p>
                      <p>Paid At: {new Date(order.paidAt).toLocaleString()}</p>
                    </div>
                    <h4>Shipping Info:</h4>
                    <p>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                    <p>{order.shippingInfo.address}</p>
                    <p>{order.shippingInfo.city}, {order.shippingInfo.zipCode}, {order.shippingInfo.country}</p>

                    <h4>Order Items:</h4>
                    <div className="order-items">
                      {order.orderItems.map((item) => (
                        <div key={item._id} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="item-details">
                            <h5>{item.name}</h5>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ₱{item.price}</p>
                            <p>Id: {item.product}</p>
                            <p>Order Id: {order._id}</p>
                          </div>

                          {/* Show Review Button only if no review exists */}
                          {order.orderStatus === 'Completed' && !reviews[`${item.product}_${order._id}`]?.length && (
                            <button
                              className="rate-button"
                              onClick={() => setIsReviewing({ productId: item.product, orderId: order._id })} // Pass productId and orderId
                            >
                              Review/Rate Product
                            </button>
                          )}

                          {/* Display reviews for the corresponding product and order */}
                          {reviews[`${item.product}_${order._id}`]?.length > 0 ? (
                          <div>
                            <h5>Reviews:</h5>
                            {reviews[`${item.product}_${order._id}`].map((review, idx) => (
                              <div key={idx}>
                                <p>{review.reviewText}</p>
                                <p>
                                  Rating: {review.rating} <StarIcon style={{ color: 'gold' }} />
                                </p>
                                {/* Add Edit button for each review */}
                                {isEditing?.reviewId === review._id ? (
                                  <ReviewFormWrapper>
                                    <TextField
                                      multiline
                                      rows={4}
                                      fullWidth
                                      value={editReviewText} // Controlled input for editing
                                      onChange={(e) => setEditReviewText(e.target.value)}
                                      label="Edit your review"
                                      variant="outlined"
                                      style={{ marginBottom: '10px' }}
                                    />
                                    <div className="rating">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                          key={star}
                                          style={{
                                            cursor: 'pointer',
                                            color: star <= editRating ? 'gold' : 'gray',
                                          }}
                                          onClick={() => setEditRating(star)}
                                        >
                                          <StarIcon />
                                        </span>
                                      ))}
                                    </div>
                                    <Button variant="contained" onClick={handleSubmitUpdatedReview}>
                                      Update Review
                                    </Button>
                                    <Button onClick={handleCancelEdit}>Cancel</Button>
                                  </ReviewFormWrapper>
                                ) : (
                                  <button
                                    className="edit-button"
                                    onClick={() => handleEditReview(item.product, order._id, review)}
                                  >
                                    Edit Review
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : isReviewing?.productId === item.product && isReviewing?.orderId === order._id && (
                          <ReviewFormWrapper>
                            <TextField
                              multiline
                              rows={4}
                              fullWidth
                              value={reviewText} // Controlled input for new reviews
                              onChange={(e) => setReviewText(e.target.value)}
                              label="Write your review"
                              variant="outlined"
                              style={{ marginBottom: '10px' }}
                            />
                            <div className="rating">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  style={{
                                    cursor: 'pointer',
                                    color: star <= rating ? 'gold' : 'gray',
                                  }}
                                  onClick={() => setRating(star)}
                                >
                                  <StarIcon />
                                </span>
                              ))}
                            </div>
                            <Button
                              variant="contained"
                              onClick={() => handleSubmitReview(item.product, order._id)}
                            >
                              Submit Review
                            </Button>
                            <Button onClick={handleCloseReviewForm}>Cancel</Button>
                          </ReviewFormWrapper>
                        )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </OrderListScreenWrapper>
  );
};

export default OrderListScreen;
