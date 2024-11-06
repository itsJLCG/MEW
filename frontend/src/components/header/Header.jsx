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
  const [hasCart, setHasCart] = useState(localStorage.getItem('hasCart') === 'true');

  useEffect(() => {
    const updateHasCart = () => {
      const cartStatus = localStorage.getItem('hasCart') === 'true';
      console.log("Updating hasCart to:", cartStatus);
      setHasCart(cartStatus);
    };

    // Listen for local storage changes within the same tab
    window.addEventListener('storage', updateHasCart);

    // Update `hasCart` on component load to capture any initial state
    updateHasCart();

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', updateHasCart);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the authToken
    localStorage.removeItem('hasCart'); 
    setHasCart(false);
    toast.success("Logout successfully!");
    navigate('/auth/sign_in'); // Redirect to login page
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
          <NavigationAndSearchWrapper className="flex items-center">
            <NavigationMenuWrapper>
              <ul className="nav-menu-list flex items-center">
                {navMenuData?.map((menu) => {
                  return (
                    <li className="nav-menu-item" key={menu.id}>
                      <Link
                        to={menu.menuLink}
                        className="nav-menu-link text-base font-medium text-gray"
                      >
                        {menu.menuText}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuWrapper>
            <form className="search-form">
              <InputGroupWrapper className="input-group">
                <span className="input-icon flex items-center justify-center text-xl text-gray">
                  <i className="bi bi-search"></i>
                </span>
                <Input
                  type="text"
                  className="input-control w-full"
                  placeholder="Search"
                />
              </InputGroupWrapper>
            </form>
          </NavigationAndSearchWrapper>

          <IconLinksWrapper className="flex items-center">
            <Link
              to="/home/wishlist"
              className={`icon-link ${
                location.pathname === "/home/wishlist" ? "active" : ""
              } inline-flex items-center justify-center`}
            >
              <img src={staticImages.heart} alt="" />
            </Link>
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
            <Link
              to={hasCart ? "/home/cart" : "/home/empty_cart"}
              className={`icon-link ${location.pathname === "/home/cart" ? "active" : ""} inline-flex items-center justify-center`}
            >
              <img src={staticImages.cart} alt="" />
            </Link>
            {localStorage.getItem('authToken') && ( // Check if authToken exists
              <LogoutButton 
                onClick={handleLogout} // Handle logout on click
              />
            )}
          </IconLinksWrapper>
        </div>
      </Container>
    </HeaderMainWrapper>
  );
};

export default Header;
