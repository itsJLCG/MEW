
import styled from "styled-components";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { Delete } from "@mui/icons-material";

import { useState } from "react";
import axios from "axios";

const CartTableRowWrapper = styled.tr`
  .cart-tbl {
    &-prod {
      grid-template-columns: 80px auto;
      column-gap: 12px;

      @media (max-width: ${breakpoints.xl}) {
        grid-template-columns: 60px auto;
      }
    }

    &-qty {
      display: flex;
      align-items: center;

      .qty-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: 1px solid ${defaultTheme.color_platinum};
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        transition: all 0.3s ease;

        &:hover {
          border-color: ${defaultTheme.color_sea_green};
          background-color: ${defaultTheme.color_sea_green};
          color: ${defaultTheme.color_white};
        }
      }

      .qty-value {
        width: 40px;
        height: 32px;
        text-align: center;
        font-weight: 500;
        margin: 0 8px;
      }
    }
  }

  .cart-prod-info {
    p {
      margin-right: 8px;
      span {
        margin-right: 4px;
      }
    }

    .category-text {
      color: ${defaultTheme.color_sea_green}; /* Custom color for category */
      font-weight: bold;
    }
  }

  .cart-prod-img {
    width: 80px;
    height: 80px;
    overflow: hidden;
    border-radius: 8px;

    @media (max-width: ${breakpoints.xl}) {
      width: 60px;
      height: 60px;
    }
  }
`;

// CartItem component
const CartItem = ({ cartItem, onUpdate }) => {
  const [quantity, setQuantity] = useState(cartItem.quantity);

  // Retrieve authToken from localStorage
  const authToken = localStorage.getItem("authToken");

  // Function to handle quantity update
  const handleQuantityChange = async (newQuantity) => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/cart/update-quantity",
        {
          productId: cartItem.productId._id,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include auth token
          },
        }
      );

      if (response.data.success) {
        setQuantity(newQuantity); // Update quantity in local state
        if (onUpdate) onUpdate(); // Trigger any additional parent updates if needed
      } else {
        console.error("Failed to update quantity:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Increment and decrement handlers
  const incrementQuantity = () => handleQuantityChange(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  return (
    <>
        <CartTableRowWrapper key={cartItem._id}>
          <td>
            <div className="cart-tbl-prod grid">
              <div className="cart-prod-img">
                <img src={cartItem.productId.image[0]} className="object-fit-cover" alt="" />
              </div>
              <div className="cart-prod-info">
                <h4 className="text-base">{cartItem.productId.name}</h4>
                <p className="text-sm text-gray inline-flex">
                  <span className="font-semibold">Category: </span> 
                  <span className="category-text">{cartItem.productId.category}</span>
                </p>
                <p className="text-sm text-gray inline-flex">
                  <span className="font-semibold">Brand:</span> {cartItem.productId.brand}
                </p>
              </div>
            </div>
          </td>
          <td>
            <span className="text-lg font-bold text-outerspace">
            ₱{cartItem.productId.price}
            </span>
          </td>
          <td>
            <div className="cart-tbl-qty">
              <button className="qty-btn" onClick={decrementQuantity}>−</button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={incrementQuantity}>+</button>
            </div>
          </td>
          <td>
            <span className="cart-tbl-shipping uppercase text-silver font-bold">
              {cartItem.shipping === 0 ? "Free" : `$${cartItem.shipping}`}
            </span>
          </td>
          <td>
            <span className="text-lg font-bold text-outerspace">
            ₱{cartItem.productId.price *  quantity}
            </span>
          </td>
          <td>
            <div className="cart-tbl-actions flex justify-center">
              <Link to="/" className="tbl-del-action text-red">
                <Delete />
              </Link>
            </div>
          </td>
        </CartTableRowWrapper>
  
    </>
  );
};

export default CartItem;
