import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { toast } from "react-hot-toast";

const OrderInfo = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get the authToken from localStorage
        const response = await axios.get("http://localhost:4000/api/orderInfo", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          withCredentials: true, // Ensure cookies or authentication tokens are sent if using cookies
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        "http://localhost:4000/api/updateOrderStatus",
        { orderId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        toast.success("Order status updated successfully.");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating order status.");
    }
  };

  const toTitleCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };  
  

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Order Information
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No orders found.
        </Typography>
      ) : (
        orders.map((order) => (
          <Box key={order._id} marginBottom={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">
                  Customer: {order.customer.firstName} {order.customer.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Shipping Address: {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.zipCode}, {order.shippingInfo.country}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Payment Method: {order.paymentInfo.cardName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Price: ₱{order.totalPrice}
                </Typography>
                
                {/* Order Status Dropdown */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Order Status</InputLabel>
                    <Select
                        label="Order Status"
                        value={toTitleCase(order.orderStatus)} // Convert to title case for display
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>

                <Grid container spacing={2} marginTop={2}>
                  {order.orderItems.map((item) => (
                    <Grid item key={item._id} xs={12} sm={6} md={4}>
                      <Card>
                        <CardMedia
                          component="img"
                          alt={item.name}
                          image={item.image}
                          title={item.name}
                          height="100"
                          width="100"
                        />
                        <CardContent>
                          <Typography variant="h6">{item.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Quantity: {item.quantity}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Price: ₱{item.price} each
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Box>
        ))
      )}
    </Box>
  );
};

export default OrderInfo;
