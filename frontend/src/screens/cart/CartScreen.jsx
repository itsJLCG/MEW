import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { Link } from "react-router-dom";
import CartTable from "../../components/cart/CartTable";
import { breakpoints } from "../../styles/themes/default";
import CartDiscount from "../../components/cart/CartDiscount";
import CartSummary from "../../components/cart/CartSummary";
import React, { useEffect, useState } from "react";
import axios from "axios";

const CartPageWrapper = styled.main`
  padding: 48px 0;

  .breadcrumb-nav {
    margin-bottom: 20px;
  }
`;

const CartContent = styled.div`
  margin-top: 40px;
  grid-template-columns: 2fr 1fr;
  gap: 40px;

  @media (max-width: ${breakpoints.xl}) {
    grid-template-columns: 100%;
  }

  @media (max-width: ${breakpoints.sm}) {
    margin-top: 24px;
  }

  .cart-list {
    @media (max-width: ${breakpoints.lg}) {
      overflow-x: scroll;
    }
  }

  .cart-content-right {
    gap: 24px;

    @media (max-width: ${breakpoints.xl}) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${breakpoints.md}) {
      grid-template-columns: 100%;
    }
  }
`;

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh]);

  const handleUpdate = () => {
    setRefresh(!refresh);
  };

  const breadcrumbItems = [
    { label: "Home", link: "/home/cart" },
    { label: "Add To Cart", link: "" },
  ];

  return (
    <CartPageWrapper>
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <div className="cart-head">
          <h1 className="text-4xl font-semibold text-outerspace">Shopping Cart</h1>
          <Link to="/home/product" className="text-sea-green">
            Continue Shopping
          </Link>
        </div>
        <CartContent className="grid items-start">
          <div className="cart-content-left">
            <CartTable cartItems={cartItems} setCartItems={setCartItems} onUpdate={handleUpdate} />
          </div>
          <div className="grid cart-content-right">
            <CartDiscount />
            <CartSummary cartItems={cartItems} />
          </div>
        </CartContent>
      </Container>
    </CartPageWrapper>
  );
};

export default CartScreen;