import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import Title from "../../components/common/Title";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import OrderItemList from "../../components/user/OrderItemList";

const OrderListScreenWrapper = styled.div`
  .order-tabs-contents {
    margin-top: 40px;
  }
  .order-tabs-head {
    min-width: 170px;
    padding: 12px 0;
    border-bottom: 3px solid ${defaultTheme.color_whitesmoke};

    &.order-tabs-head-active {
      border-bottom-color: ${defaultTheme.color_outerspace};
    }

    @media (max-width: ${breakpoints.lg}) {
      min-width: 120px;
    }

    @media (max-width: ${breakpoints.xs}) {
      min-width: 80px;
    }
  }
`;

const breadcrumbItems = [
  { label: "Home", link: "/" },
  { label: "Order", link: "" },
];

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
        const response = await axios.get('http://localhost:4000/api/orders/all', {
          headers: {
            Authorization: `Bearer ${token}`
          },// Ensure cookies are sent with the request
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    getOrders();
  }, []);

  return (
    <OrderListScreenWrapper className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <Title titleText={"My Orders"} />
            <div className="order-tabs">
              <div className="order-tabs-heads">
                <button
                  type="button"
                  className="order-tabs-head text-xl italic order-tabs-head-active"
                  data-id="active"
                >
                  Active
                </button>
                <button
                  type="button"
                  className="order-tabs-head text-xl italic"
                  data-id="cancelled"
                >
                  Cancelled
                </button>
                <button
                  type="button"
                  className="order-tabs-head text-xl italic"
                  data-id="completed"
                >
                  Completed
                </button>
              </div>

              <div className="order-tabs-contents">
                <div className="order-tabs-content" id="active">
                    <OrderItemList orders={orders} />
                </div>
                <div className="order-tabs-content" id="cancelled">
                    Cancelled content
                </div>
                <div className="order-tabs-content" id="completed">
                    Completed content
                </div>
              </div>
            </div>
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </OrderListScreenWrapper>
  );
};

export default OrderListScreen;