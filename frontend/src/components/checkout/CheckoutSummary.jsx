import styled from "styled-components";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import PropTypes from "prop-types";
import { currencyFormat } from "../../utils/helper";

const CheckoutSummaryWrapper = styled.div`
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.05),
    -2px -2px 4px 0px rgba(0, 0, 0, 0.05);
  padding: 40px;

  @media (max-width: ${breakpoints.xl}) {
    padding: 24px;
  }

  @media (max-width: ${breakpoints.sm}) {
    padding: 16px;
  }

  @media (max-width: ${breakpoints.xs}) {
    background-color: transparent;
    padding: 0;
    box-shadow: none;
  }

  .order-list {
    row-gap: 24px;
    margin-top: 20px;

    @media (max-width: ${breakpoints.sm}) {
      row-gap: 16px;
    }
  }

  .order-item {
    grid-template-columns: 60px auto;
    gap: 16px;

    @media (max-width: ${breakpoints.xs}) {
      align-items: center;
    }

    &-img {
      width: 60px;
      height: 60px;
      overflow: hidden;
      border-radius: 4px;
    }

    &-info {
      gap: 16px;

      @media (max-width: ${breakpoints.xs}) {
        flex-direction: column;
        gap: 6px;
      }
    }
  }

  .order-info {
    margin-top: 30px;
    @media (max-width: ${breakpoints.sm}) {
      margin-top: 20px;
    }

    li {
      margin: 6px 0;
    }

    .list-separator {
      height: 1px;
      background-color: ${defaultTheme.color_anti_flash_white};
      margin: 12px 0;
    }
  }
`;

const CheckoutSummary = ({ cartItems }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
  const shipping = 100; // Fixed shipping cost
  const total = subtotal + shipping;

  return (
    <CheckoutSummaryWrapper>
      <h4 className="text-xxl font-bold text-outerspace">
        Checkout Order Summary
      </h4>
      <div className="order-list grid">
        {cartItems.map((cartItem) => (
          <div className="order-item grid" key={cartItem._id}>
            <div className="order-item-img">
              <img
                src={cartItem.productId.image[0]}
                className="object-fit-cover"
                alt={cartItem.productId.name}
              />
            </div>
            <div className="order-item-info flex justify-between">
              <div className="order-item-info-l">
                <p className="text-base font-bold text-outerspace">
                  {cartItem.productId.name}&nbsp;
                  <span className="text-gray">x{cartItem.quantity}</span>
                </p>
                <p className="text-base font-bold text-outerspace">
                  Brand: &nbsp;
                  <span className="text-gray font-normal">{cartItem.productId.brand.name}</span>
                </p>
                <p className="text-base font-bold text-outerspace">
                  Category: &nbsp;
                  <span className="text-gray font-normal">{cartItem.productId.category.name}</span>
                </p>
              </div>
              <div className="order-item-info-r text-gray font-bold text-base">
                {currencyFormat(cartItem.productId.price)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ul className="order-info">
        <li className="flex items-center justify-between">
          <span className="text-outerspace font-bold text-lg">
            Subtotal <span className="text-gray font-semibold">({cartItems.length} items)</span>
          </span>
          <span className="text-outerspace font-bold text-lg">{currencyFormat(subtotal)}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-outerspace font-bold text-lg">Shipping</span>
          <span className="text-outerspace font-bold text-lg">{currencyFormat(shipping)}</span>
        </li>
        <li className="list-separator"></li>
        <li className="flex items-center justify-between">
          <span className="text-outerspace font-bold text-lg">Total</span>
          <span className="text-outerspace font-bold text-lg">{currencyFormat(total)}</span>
        </li>
      </ul>
    </CheckoutSummaryWrapper>
  );
};

CheckoutSummary.propTypes = {
  cartItems: PropTypes.array.isRequired,
};

export default CheckoutSummary;