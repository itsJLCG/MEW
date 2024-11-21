import styled from "styled-components";
import { BaseButtonGreen } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

const CartSummaryWrapper = styled.div`
  background-color: ${defaultTheme.color_flash_white};
  padding: 16px;

  .checkout-btn {
    min-width: 100%;
  }

  .summary-list {
    padding: 20px;

    @media (max-width: ${breakpoints.xs}) {
      padding-top: 0;
      padding-right: 0;
      padding-left: 0;
    }

    .summary-item {
      margin: 6px 0;

      &:last-child {
        margin-top: 20px;
        border-top: 1px dashed ${defaultTheme.color_sea_green};
        padding-top: 10px;
      }
    }
  }
`;

const CartSummary = ({ cartItems }) => {
  const navigate = useNavigate()

  let subtotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    subtotal += cartItems[i].productId.price * cartItems[i].quantity;
  }

  const shippingCost = 5.00; // Example shipping cost
  const grandTotal = subtotal + shippingCost;

  const handleCheckout = () =>{
    navigate('/home/checkout')
  }
  return (
    <CartSummaryWrapper>
      <ul className="summary-list">
        <li className="summary-item flex justify-between">
          <span className="font-medium text-outerspace">Sub Total</span>
          <span className="font-medium text-outerspace">₱{subtotal.toFixed(2)}</span>
        </li>
        <li className="summary-item flex justify-between">
          <span className="font-medium text-outerspace">Shipping</span>
          <span className="font-medium text-outerspace">₱{shippingCost.toFixed(2)}</span>
        </li>
        <li className="summary-item flex justify-between">
          <span className="font-medium text-outerspace">Grand Total</span>
          <span className="summary-item-value font-bold text-outerspace">
            ₱{grandTotal.toFixed(2)}
          </span>
        </li>
      </ul>
      <BaseButtonGreen type="button" className="checkout-btn" onClick={handleCheckout}>
        Proceed To Checkout
      </BaseButtonGreen>
    </CartSummaryWrapper>
  );
};

CartSummary.propTypes = {
  cartItems: PropTypes.array.isRequired,
};

export default CartSummary;