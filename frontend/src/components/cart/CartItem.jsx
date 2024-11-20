
import styled from "styled-components";
import { PropTypes } from "prop-types";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CartTableRowWrapper = styled.tr`
  transition: opacity 0.5s ease-out;
  opacity: ${(props) => (props.$isDeleted ? 0 : 1)};
  .cart-tbl {
    &-prod {
      grid-template-columns: 80px auto;
      column-gap: 12px;
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
        border: 1px solid #ccc;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        transition: all 0.3s ease;
        &:hover {
          border-color: #2ecc71;
          background-color: #2ecc71;
          color: #fff;
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
      color: #2ecc71;
      font-weight: bold;
    }
  }
  .cart-prod-img {
    width: 80px;
    height: 80px;
    overflow: hidden;
    border-radius: 8px;
  }
`;

const CartItem = ({ cartItem, onUpdate, onDelete }) => {
  const [quantity, setQuantity] = useState(cartItem.quantity);
  const [isDeleted, setIsDeleted] = useState(false);

  const authToken = localStorage.getItem("authToken");

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:4000/api/cart/delete",
        {
          data: { productId: cartItem.productId._id },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        setIsDeleted(true);
        toast.success("Item successfully deleted from cart!");

        setTimeout(() => {
          if (onDelete) onDelete(cartItem._id);
        }, 500);
      } else {
        console.error("Failed to delete item:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error deleting item from cart.");
    }
  };

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
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.success) {
        setQuantity(newQuantity);
        if (onUpdate) onUpdate(); // Trigger parent update
      } else {
        console.error("Failed to update quantity:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const incrementQuantity = () => handleQuantityChange(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  return (
    <CartTableRowWrapper $isDeleted={isDeleted} key={cartItem._id}>
      <td>
        <div className="cart-tbl-prod grid">
          <div className="cart-prod-img">
            <img src={cartItem.productId.image[0]} className="object-fit-cover" alt="" />
          </div>
          <div className="cart-prod-info">
            <h4 className="text-base">{cartItem.productId.name}</h4>
            <p className="text-sm text-gray inline-flex">
              <span className="font-semibold">Category: </span>
              <span className="category-text">{cartItem.productId.category.name}</span>
            </p>
            <p className="text-sm text-gray inline-flex">
              <span className="font-semibold">Brand:</span> {cartItem.productId.brand.name}
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
        <span className="text-lg font-bold text-outerspace">
          ₱{cartItem.productId.price * quantity}
        </span>
      </td>
      <td>
        <div className="cart-tbl-actions flex justify-center">
          <button onClick={handleDelete} className="tbl-del-action text-red">
            <Delete />
          </button>
        </div>
      </td>
    </CartTableRowWrapper>
  );
};

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

export default CartItem;