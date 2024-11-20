import styled from "styled-components";
import CartItem from "./CartItem";
import { PropTypes } from "prop-types";
import { breakpoints } from "../../styles/themes/default";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ScrollbarXWrapper = styled.div`
  overflow-x: scroll;
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: grey;
  }
`;

const CartTableWrapper = styled.table`
  border-collapse: collapse;
  min-width: 680px;
  border: 1px solid rgba(0, 0, 0, 0.1);

  thead {
    th {
      height: 48px;
      padding-left: 16px;
      padding-right: 16px;
      letter-spacing: 0.03em;

      @media (max-width: ${breakpoints.lg}) {
        padding: 16px 12px;
      }

      @media (max-width: ${breakpoints.xs}) {
        padding: 10px;
      }
    }
  }

  tbody {
    td {
      padding: 24px 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);

      @media (max-width: ${breakpoints.lg}) {
        padding: 16px 12px;
      }

      @media (max-width: ${breakpoints.xs}) {
        padding: 10px 6px;
      }
    }
  }
`;

const CartTable = () => {
  const [cartItems, setCartItems] = useState([]);
  const [hasCart, setHasCart] = useState(false);

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

  // Define the onDelete function
  const onDelete = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== cartItemId)
    );
  };

  const CART_TABLE_HEADS = [
    "Product details",
    "Price",
    "Quantity",
    "Subtotal",
    "Action",
  ];

  return (
    <ScrollbarXWrapper>
      <CartTableWrapper className="w-full">
        <thead>
          <tr className="text-start">
            {CART_TABLE_HEADS?.map((column, index) => (
              <th
                key={index}
                className={`bg-outerspace text-white font-semibold capitalize text-base ${
                  index === CART_TABLE_HEADS.length - 1 ? " text-center" : ""
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cartItems.map((cartItem) => (
            <CartItem onDelete={onDelete} key={cartItem._id} cartItem={cartItem} />
          ))}
        </tbody>
      </CartTableWrapper>
    </ScrollbarXWrapper>
  );
};

export default CartTable;
