import styled from "styled-components";
import CartItem from "./CartItem";
import { PropTypes } from "prop-types";
import { breakpoints } from "../../styles/themes/default";
import React from "react";

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

const CartTable = ({ cartItems, setCartItems, onUpdate }) => {
  // Define the onDelete function
  const onDelete = (cartItemId) => {
    if (cartItems.length === 1) {
      localStorage.setItem('hasCart', 'false');
    }
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== cartItemId)
    );
    onUpdate();
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
            <CartItem onDelete={onDelete} onUpdate={onUpdate} key={cartItem._id} cartItem={cartItem} />
          ))}
        </tbody>
      </CartTableWrapper>
    </ScrollbarXWrapper>
  );
};

CartTable.propTypes = {
  cartItems: PropTypes.array.isRequired,
  setCartItems: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CartTable;