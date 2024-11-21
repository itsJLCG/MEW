import styled from "styled-components";
import { Container } from "../../styles/styles";
import Title from "../../components/common/Title";
import Billing from "../../components/checkout/Billing";
import ShippingPayment from "../../components/checkout/ShippingPayment";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import React, { useEffect, useState } from "react";
import axios from "axios";

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

const CheckoutScreen = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get("http://localhost:4000/api/cart/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setCartItems(response.data.cartItems);
        } else {
          console.error("Failed to fetch cart items:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error.message);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <CheckoutScreenWrapper>
      <Container>
        <Title titleText="Check Out" />
        <Billing cartItems={cartItems} />
        <div className="horiz-line-separator w-full"></div>
        <ShippingPayment />
      </Container>
    </CheckoutScreenWrapper>
  );
};

export default CheckoutScreen;