import styled from "styled-components";
import { Container } from "../../styles/styles";
import Title from "../../components/common/Title";
import Billing from "../../components/checkout/Billing";
import ShippingPayment from "../../components/checkout/ShippingPayment";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseButtonGreen } from "../../styles/button"; // Import BaseButtonGreen
import { toast } from "react-hot-toast"; // Import toast
import { useNavigate } from "react-router-dom"; 

const CheckoutScreenWrapper = styled.main`
  padding: 48px 0;
  .horiz-line-separator {
    height: 1px;
    background-color: ${defaultTheme.color_anti_flash_white};
    max-width: 818px;
    margin: 30px 0;

    @media (max-width: ${breakpoints.sm}) {
      margin: 20px 0;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px; /* Adjust this value to move the button slightly to the top */
`;

const StyledBaseButtonGreen = styled(BaseButtonGreen)`
  padding: 16px 32px; /* Adjust padding to change button size */
  font-size: 18px; /* Adjust font size */
`;

const CheckoutScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [billingDetails, setBillingDetails] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get("http://localhost:4000/api/cart/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setCartItems(response.data.cartItems);
          toast.success("Cart items fetched successfully");
        } else {
          console.error("Failed to fetch cart items:", response.data.message);
          toast.error("Failed to fetch cart items");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error.message);
        toast.error("Error fetching cart items");
      }
    };

    fetchCartItems();
  }, []);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("authToken");

    let itemsPrice = 0;
    for (const item of cartItems) {
      itemsPrice += item.productId.price * item.quantity;
    }

    const shippingPrice = 100; // Fixed shipping cost
    const totalPrice = itemsPrice + shippingPrice;

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.productId.name,
        quantity: item.quantity,
        image: item.productId.image[0],
        price: item.productId.price,
        product: item.productId._id,
      })),
      shippingInfo: billingDetails,
      itemsPrice: itemsPrice,
      taxPrice: 0, // Adjust as needed
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
      paymentInfo: paymentDetails,
    };

    try {
      const response = await axios.post("http://localhost:4000/api/order/new", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        console.log("Order placed successfully:", response.data.order);
        toast.success("Order placed successfully");
         // Set localStorage item "hasCart" to false
         localStorage.setItem("hasCart", false);
        navigate("/home/confirm");
      } else {
        console.error("Failed to place order:", response.data.message);
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      toast.error("Error placing order");
    }
  };

  return (
    <CheckoutScreenWrapper>
      <Container>
        <Title titleText="Check Out" />
        <Billing cartItems={cartItems} setBillingDetails={setBillingDetails} />
        <ButtonWrapper>
          <StyledBaseButtonGreen onClick={handlePlaceOrder}>Place Order</StyledBaseButtonGreen>
        </ButtonWrapper>
        <div className="horiz-line-separator w-full"></div>
        <ShippingPayment setPaymentDetails={setPaymentDetails} />
      </Container>
    </CheckoutScreenWrapper>
  );
};

export default CheckoutScreen;