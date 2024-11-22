import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import Title from "../common/Title";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

const NavMenuWrapper = styled.nav`
  margin-top: 32px;
  
  .nav-menu-list {
    row-gap: 8px;

    @media (max-width: ${breakpoints.md}) {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }

  .nav-menu-item {
    border-radius: 4px;

    @media (max-width: ${breakpoints.sm}) {
      flex: 1 1 0;
    }
  }

  .nav-menu-link {
    padding-left: 36px;
    width: 100%;
    height: 40px;
    column-gap: 12px;
    border: 1px solid transparent;

    &:hover {
      background-color: ${defaultTheme.color_whitesmoke};
    }

    .nav-link-text {
      color: ${defaultTheme.color_gray};
    }

    &.active {
      border-left: 2px solid ${defaultTheme.color_gray};
      background-color: ${defaultTheme.color_whitesmoke};

      @media (max-width: ${breakpoints.md}) {
        border-bottom: 2px solid ${defaultTheme.color_gray};
        border-left: 0;
        background-color: transparent;
      }
    }

    @media (max-width: ${breakpoints.md}) {
      padding-left: 16px;
      padding-right: 16px;
    }

    @media (max-width: ${breakpoints.sm}) {
      padding-left: 8px;
      padding-right: 8px;
      column-gap: 8px;
    }
  }
`;

const UserMenu = () => {
  const [username, setUsername] = useState(""); // Store the username
  const [loading, setLoading] = useState(true); // Loading state
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken"); // Get token from localStorage

      if (!token) {
        console.error("No token found");
        window.location.href = "/login"; // Redirect to login if no token found
        return;
      }

      try {
        // Make an API request to get user data
        const response = await axios.get("/api/users/all", { // Use your API route
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assuming the username is in the response data
        setUsername(response.data.username); // Set the username in the state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false); // Stop loading if there's an error
      }
    };

    fetchUserData();
  }, []);

  // Show loading state until data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>

      <NavMenuWrapper>
        <ul className="nav-menu-list grid">
          <li className="nav-menu-item">
            <Link
              to="/home/order"
              className={`nav-menu-link flex items-center ${
                location.pathname === "/order" ||
                location.pathname === "/order_detail"
                  ? "active"
                  : ""
              }`}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_orders.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">
                My orders
              </span>
            </Link>
          </li>
          <li className="nav-menu-item">
            <Link
              to="/home/account"
              className={`nav-menu-link flex items-center ${
                location.pathname === "/account" ||
                location.pathname === "/account/add"
                  ? "active"
                  : ""
              }`}
            >
              <span className="nav-link-icon flex items-center justify-center">
                <img src="./assets/icons/ac_user.svg" alt="" />
              </span>
              <span className="text-base font-semibold nav-link-text no-wrap">
                My Account
              </span>
            </Link>
          </li>
        </ul>
      </NavMenuWrapper>
    </div>
  );
};

export default UserMenu;
