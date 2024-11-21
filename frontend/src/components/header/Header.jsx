import styled from "styled-components";
import { HeaderMainWrapper, SiteBrandWrapper } from "../../styles/header";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import { navMenuData } from "../../data/data";
import { Link, useLocation } from "react-router-dom";
import { Input, InputGroupWrapper } from "../../styles/form";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/slices/sidebarSlice";

import LogoutIcon from '@mui/icons-material/Logout'; // Import Logout Icon
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast';

import { useEffect, useState } from 'react';

const LogoutButton = styled(LogoutIcon)`
  cursor: pointer;
  margin-left: 20px;
  transition: color 0.3s, transform 0.3s; // Smooth transition for hover effects

  &:hover {
    color: ${defaultTheme.color_sea_green}; // Change color on hover
    transform: scale(1.1); // Slightly increase size on hover
  }
`;

const BurgerIcon = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  margin-right: 20px; // Space between burger icon and logo

  .bar {
    width: 24px;
    height: 3px;
    background-color: ${defaultTheme.color_outerspace};
    margin: 3px 0; // Spacing between bars
    transition: background-color 0.3s;
  }

  &:hover .bar {
    background-color: ${defaultTheme.color_sea_green}; // Change color on hover
  }
`;

const NavigationAndSearchWrapper = styled.div`
  column-gap: 20px;
  .search-form {
    @media (max-width: ${breakpoints.lg}) {
      width: 100%;
      max-width: 500px;
    }
    @media (max-width: ${breakpoints.sm}) {
      display: none;
    }
  }

  .input-group {
    min-width: 320px;

    .input-control {
      @media (max-width: ${breakpoints.sm}) {
        display: none;
      }
    }

    @media (max-width: ${breakpoints.xl}) {
      min-width: 160px;
    }

    @media (max-width: ${breakpoints.sm}) {
      min-width: auto;
      grid-template-columns: 100%;
    }
  }

  @media (max-width: ${breakpoints.lg}) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const NavigationMenuWrapper = styled.nav`
  .nav-menu-list {
    margin-left: 20px;

    @media (max-width: ${breakpoints.lg}) {
      flex-direction: column;
    }
  }

  .nav-menu-item {
    margin-right: 20px;
    margin-left: 20px;

    @media (max-width: ${breakpoints.xl}) {
      margin-left: 16px;
      margin-right: 16px;
    }
  }

  .nav-menu-link {
    &.active {
      color: ${defaultTheme.color_outerspace};
      font-weight: 700;
    }

    &:hover {
      color: ${defaultTheme.color_outerspace};
    }
  }

  @media (max-width: ${breakpoints.lg}) {
    position: absolute;
    top: 0;
    right: 0;
    width: 260px;
    background: ${defaultTheme.color_beige};
    height: 100%;
    z-index: 999;
    display: none;
  }
`;

const IconLinksWrapper = styled.div`
  column-gap: 18px;
  .icon-link {
    width: 36px;
    height: 36px;
    border-radius: 6px;

    &.active {
      background-color: ${defaultTheme.color_sea_green};
      img {
        filter: brightness(100);
      }
    }

    &:hover {
      background-color: ${defaultTheme.color_whitesmoke};
    }
  }

  @media (max-width: ${breakpoints.xl}) {
    column-gap: 8px;
  }

  @media (max-width: ${breakpoints.xl}) {
    column-gap: 6px;
  }
`;

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [hasCart, setHasCart] = useState(false);
  
  useEffect(() => {
    const checkCartStatus = () => {
      const cartStatus = localStorage.getItem('hasCart') === 'true';
      setHasCart(cartStatus);
    };

    // Sync state with localStorage on load and changes
    checkCartStatus();

    const storageListener = () => {
      checkCartStatus();
    };

    // Listen for localStorage changes to update state dynamically
    window.addEventListener('storage', storageListener);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the authToken
    localStorage.removeItem('hasCart'); 
    setHasCart(false);
    toast.success("Logout successfully!");
    navigate('/auth/sign_in'); // Redirect to login page
  };

  const handleCartClick = () => {
    const cartStatus = localStorage.getItem('hasCart') === 'true';
    if (cartStatus) {
      navigate('/home/cart');
    } else {
      navigate('/home/empty_cart');
    }
  };

  return (
    <HeaderMainWrapper className="header flex items-center">
      <Container className="container">
        <div className="header-wrap flex items-center justify-between">
          <div className="flex items-center">
            <BurgerIcon
              type="button"
              onClick={() => dispatch(toggleSidebar())}
            >
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </BurgerIcon>
            <SiteBrandWrapper to="/home" className="inline-flex">
              <div className="brand-img-wrap flex items-center justify-center">
                <img
                  className="site-brand-img"
                  src={staticImages.logo}
                  alt="site logo"
                />
              </div>
              <span className="site-brand-text text-outerspace">MEW.</span>
            </SiteBrandWrapper>
          </div>

          <IconLinksWrapper className="flex items-center">
            <Link
              to="/home/account"
              className={`icon-link ${
                location.pathname === "/home/account" ||
                location.pathname === "/home/account/add"
                  ? "active"
                  : ""
              } inline-flex items-center justify-center`}
            >
              <img src={staticImages.user} alt="" />
            </Link>
            <div
              onClick={handleCartClick}
              className={`icon-link ${location.pathname === "/home/cart" ? "active" : ""} inline-flex items-center justify-center`}
            >
              <img src={staticImages.cart} alt="" />
            </div>
            {localStorage.getItem('authToken') && ( // Check if authToken exists
              <LogoutButton 
                onClick={handleLogout} // Handle logout on click
              />
            )}

<NavigationMenuWrapper>
              <ul className="nav-menu-list flex items-center">
                {navMenuData?.map((menu) => {
                  return (
                    <li className="nav-menu-item" key={menu.id}>
                    <Link to={menu.link}>
                      {menu.name}
                    </Link>
                    {/* Shop Now Button */}
                    <button
                      onClick={() => window.location.href = "/home/product"}
                      style={{
                        margin: "10px 0 0 10px", // Moves the button slightly off-center
                        padding: "10px 20px", // Button size
                        backgroundColor: "rgb(16, 185, 176)", // Background color
                        color: "white", // Text color
                        border: "none", // No border
                        borderRadius: "10px", // Rounded corners
                        fontSize: "14px", // Font size
                        fontWeight: "bold", // Bold text
                        cursor: "pointer", // Pointer cursor
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
                        transition: "all 0.3s ease", // Smooth hover effect
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "rgb(13, 148, 139)"; // Slightly darker on hover
                        e.target.style.transform = "translateY(-2px)"; // Lift effect
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "rgb(16, 185, 176)"; // Reset color
                        e.target.style.transform = "translateY(0)"; // Reset lift
                      }}
                    >
                      Shop Now
                    </button>
                  </li>
                  );
                })}
              </ul>
            </NavigationMenuWrapper>
            
          </IconLinksWrapper>
        </div>
      </Container>
    </HeaderMainWrapper>
  );
};

export default Header;