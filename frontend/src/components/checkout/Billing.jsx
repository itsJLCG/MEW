import React from "react";
import styled from "styled-components";
import { Input } from "../../styles/form";
import { BaseButtonGreen } from "../../styles/button";
import CheckoutSummary from "./CheckoutSummary";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import PropTypes from "prop-types";

const BillingOrderWrapper = styled.div`
  display: grid;
  gap: 60px;
  grid-template-columns: 2fr 1fr;

  @media (max-width: ${breakpoints.xl}) {
    gap: 40px;
  }
  @media (max-width: ${breakpoints.lg}) {
    gap: 30px;
    grid-template-columns: 100%;
  }
`;

const BillingDetailsWrapper = styled.div`
  @media (max-width: ${breakpoints.lg}) {
    order: 2;
  }

  .checkout-form {
    margin-top: 24px;

    .input-elem {
      margin-bottom: 16px;

      @media (max-width: ${breakpoints.xs}) {
        margin-bottom: 10px;
      }

      label {
        margin-bottom: 8px;
        display: block;
      }

      input,
      select {
        height: 40px;
        border-radius: 4px;
        background: ${defaultTheme.color_whitesmoke};
        padding-left: 12px;
        padding-right: 12px;
        width: 100%;
        border: 1px solid ${defaultTheme.color_platinum};
        font-size: 12px;

        &::placeholder {
          font-size: 12px;
        }
      }
    }

    .elem-col-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 24px;

      @media (max-width: ${breakpoints.lg}) {
        column-gap: 12px;
      }
      @media (max-width: ${breakpoints.sm}) {
        grid-template-columns: 100%;
      }
    }

    .input-check-group {
      column-gap: 10px;
      margin-top: 16px;
    }

    .contd-delivery-btn {
      margin-top: 20px;

      @media (max-width: ${breakpoints.sm}) {
        width: 100%;
      }
    }
  }
`;

const Billing = ({ cartItems }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <BillingOrderWrapper className="billing-and-order grid items-start">
      <BillingDetailsWrapper>
        <h4 className="text-xxl font-bold text-outerspace">Billing Details</h4>
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label
                htmlFor="firstName"
                className="text-base text-outerspace font-semibold"
              >
                First Name*
              </label>
              <Input id="firstName" type="text" placeholder="First Name" />
            </div>
            <div className="input-elem">
              <label
                htmlFor="lastName"
                className="text-base text-outerspace font-semibold"
              >
                Last Name*
              </label>
              <Input id="lastName" type="text" placeholder="Last Name" />
            </div>
          </div>
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label
                htmlFor="country"
                className="text-base text-outerspace font-semibold"
              >
                Country / Region*
              </label>
              <Input id="country" type="text" placeholder="Country / Region" />
            </div>
            <div className="input-elem">
              <label
                htmlFor="address"
                className="text-base text-outerspace font-semibold"
              >
                Street Address*
              </label>
              <Input id="address" type="text" placeholder="House number and street name" />
            </div>
          </div>
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label
                htmlFor="city"
                className="text-base text-outerspace font-semibold"
              >
                City*
              </label>
              <Input id="city" type="text" placeholder="Town / City" />
            </div>
            <div className="input-elem">
              <label
                htmlFor="zipCode"
                className="text-base text-outerspace font-semibold"
              >
                Zip Code*
              </label>
              <Input id="zipCode" type="text" placeholder="Postal Code" />
            </div>
          </div>
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label
                htmlFor="phone"
                className="text-base text-outerspace font-semibold"
              >
                Phone*
              </label>
              <Input id="phone" type="text" placeholder="Phone" />
            </div>
          </div>
          <BaseButtonGreen type="submit" className="contd-delivery-btn">
            Continue to delivery
          </BaseButtonGreen>
          <div className="input-check-group flex items-center flex-wrap">
            <Input type="checkbox" id="saveInfo" />
            <label htmlFor="saveInfo" className="text-base">
              Save my information for a faster checkout
            </label>
          </div>
        </form>
      </BillingDetailsWrapper>
      <CheckoutSummary cartItems={cartItems} />
    </BillingOrderWrapper>
  );
};

Billing.propTypes = {
  cartItems: PropTypes.array.isRequired,
};

export default Billing;