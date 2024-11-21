import React from 'react';
import styled from "styled-components";
import PropTypes from "prop-types";
import { BaseLinkGreen } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

const OrderItemWrapper = styled.div`
  margin: 30px 0;
  border-bottom: 1px solid ${defaultTheme.color_anti_flash_white};

  .order-item-title {
    margin-bottom: 12px;
  }

  .order-item-details {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 24px 32px;
    border-radius: 8px;

    @media (max-width: ${breakpoints.sm}) {
      padding: 20px 24px;
    }

    @media (max-width: ${breakpoints.xs}) {
      padding: 12px 16px;
    }
  }

  .order-info-group {
    @media (max-width: ${breakpoints.sm}) {
      flex-direction: column;
    }
  }

  .order-info-item {
    width: 50%;

    span {
      &:nth-child(2) {
        margin-left: 4px;
      }
    }

    &:nth-child(even) {
      text-align: right;
      @media (max-width: ${breakpoints.lg}) {
        text-align: left;
      }
    }

    @media (max-width: ${breakpoints.sm}) {
      width: 100%;
      margin: 2px 0;
    }
  }
`;

const OrderItem = ({ order }) => {
  return (
    <OrderItemWrapper>
      <div className="order-item-details">
        <h3 className="text-x order-item-title">Order id: {order._id}</h3>
        <BaseLinkGreen to={`/home/order_detail/${order._id}`}>View Detail</BaseLinkGreen>
        <div className="order-info-group flex flex-wrap">
          <div className="order-info-item">
            <span className="text-gray font-semibold">Order Date:</span>
            <span className="text-silver">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="order-info-item">
            <span className="text-gray font-semibold">Order Status:</span>
            <span className="text-silver">{order.orderStatus}</span>
          </div>
          <div className="order-info-item">
            <span className="text-gray font-semibold">
              Estimated Delivery Date:
            </span>
            <span className="text-silver">{new Date(order.paidAt).toLocaleDateString()}</span>
          </div>
          <div className="order-info-item">
            <span className="text-gray font-semibold">Payment Method:</span>
            <span className="text-silver">{order.paymentInfo.cardName}</span>
          </div>
        </div>
      </div>
    </OrderItemWrapper>
  );
};

export default OrderItem;

OrderItem.propTypes = {
  order: PropTypes.object,
};