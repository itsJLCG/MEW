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
  const [reviews, setReviews] = useState({}); // Store reviews by product ID

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
    const fetchReviews = async (productId) => {
      try {
        const response = await axios.get(`http://localhost:4000/api/reviews/reviews/${productId}`);
        setReviews(prev => ({
          ...prev,
          [productId]: response.data.reviews || {} // Ensure you're using the 'reviews' key
        }));
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    
  
    if (orders.length > 0) {
      orders.forEach(order => {
        order.orderItems.forEach(item => {
          console.log("Fetching reviews for product ID:", item.product); // Log the product ID
          fetchReviews(item.product);
        });
      });
    }
  }, [orders]);  

  const handleSubmitReview = async (productId) => {
    try {
      // Clean the review text by masking bad words
      const cleanedReviewText = filter.clean(reviewText);
  
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://localhost:4000/api/reviews/review',
        { productId, reviewText: cleanedReviewText, rating }, // Send the cleaned text
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Review submitted successfully!');
  
      // Update reviews state with the new masked review
      setReviews((prev) => ({
        ...prev,
        [productId]: [
          ...(prev[productId] || []), // Keep existing reviews if any
          { reviewText: cleanedReviewText, rating }, // Add the cleaned review
        ],
      }));
  
      // Reset form
      setIsReviewing(null);
      setReviewText('');
      setRating(1);
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit review.');
    }
  };  
  
  const handleEditReview = (productId) => {
    const productReviews = reviews[productId];
    if (productReviews && productReviews.length > 0) {
      const { reviewText, rating } = productReviews[0]; // Load the first review
      setReviewText(reviewText);
      setRating(rating);
      setIsReviewing(productId);
    }
  };

  const handleCloseReviewForm = () => {
    setIsReviewing(null); // Close the review form
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
              <p>No orders found.</p>
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
                          </div>
                          {order.orderStatus === 'Completed' && !reviews[item.product] && (
                            <button
                              className="rate-button"
                              onClick={() => setIsReviewing(item.product)} // Use product ID here
                            >
                              Review/Rate Product
                            </button>
                          )}
                          {reviews[item.product] && reviews[item.product].length > 0 ? (
                            <div>
                            <h5>Reviews:</h5>
                            {reviews[item.product].map((review, idx) => (
                              <div key={idx}>
                                {/* Display the review text */}
                                <p>{review.reviewText}</p>
                                {/* Display the rating */}
                                <p>
                                  Rating: {review.rating} <StarIcon style={{ color: 'gold' }} />
                                </p>
                              </div>
                            ))}
                            {order.orderStatus === 'Completed' && reviews[item.product] && (
                              <>
                                <button
                                  className="update-button"
                                  onClick={() => handleEditReview(item.product)}
                                >
                                  Edit Review
                                </button>
                                {isReviewing === item.product && (
                                  <ReviewFormWrapper>
                                    <TextField
                                      multiline
                                      rows={4}
                                      fullWidth
                                      value={reviewText}
                                      onChange={(e) => setReviewText(e.target.value)}
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
                                      onClick={() => handleUpdateReview(item.product)}
                                    >
                                      Update Review
                                    </Button>
                                    <Button onClick={handleCloseReviewForm}>Cancel</Button>
                                  </ReviewFormWrapper>
                                )}
                              </>
                            )}
                          </div>
                          
                            
                          ) : isReviewing === item.product && (
                            <ReviewFormWrapper>
                              <TextField
                                multiline
                                rows={4}
                                fullWidth
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
                                onClick={() => handleSubmitReview(item.product)}
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
