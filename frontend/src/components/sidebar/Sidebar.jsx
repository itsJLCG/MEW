import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { SiteBrandWrapper } from "../../styles/header";
import { staticImages } from "../../utils/images";
import { Input, InputGroupWrapper } from "../../styles/form";
import { sideMenuData } from "../../data/data";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsSidebarOpen,
  toggleSidebar,
} from "../../redux/slices/sidebarSlice";
// import "bootstrap-icons/font/bootstrap-icons.css";
const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover .line {
    background-color: ${defaultTheme.color_sea_green};
  }

  .line {
    position: absolute;
    width: 20px;
    height: 2px;
    background-color: ${defaultTheme.color_outerspace};
    transition: background-color 0.3s;
  }

  .line1 {
    transform: rotate(45deg);
  }

  .line2 {
    transform: rotate(-45deg);
  }
`;

const SideNavigationWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  z-index: 999;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  padding: 16px;
  transform: translateX(-100%);
  transition: ${defaultTheme.default_transition};

  &.show {
    display: block;
    transform: translateX(0);
  }

  .sidebar-close-btn {
    position: absolute;
    right: 16px;
    top: 16px;
    &:hover {
      color: ${defaultTheme.color_sea_green};
    }
  }

  .sidenav-search-form {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin-top: 20px;

    .input-group {
      min-width: 100%;
      column-gap: 0;
    }
  }

  .sidenav-menu-list {
    gap: 14px;
    margin: 20px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 24px 0;

    li {
      padding: 5px 5px 5px 12px;
      border-radius: 4px;
      transition: ${defaultTheme.default_transition};

      &:hover {
        background: rgba(0, 0, 0, 0.05);

        a {
          span {
            color: ${defaultTheme.color_sea_green};
          }
        }
      }
    }

    a {
      column-gap: 16px;
      &.active {
        color: ${defaultTheme.color_sea_green};
      }
    }
  }

  @media (max-width: ${breakpoints.xs}) {
    width: 100%;
  }
`;

const Sidebar = () => {
  const location = useLocation();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const dispatch = useDispatch();


 
  return (
    <SideNavigationWrapper
      className={`bg-white h-full ${isSidebarOpen ? "show" : ""}`}
    >
      <CloseButton onClick={() => dispatch(toggleSidebar())}>
        <span className="line line1"></span>
        <span className="line line2"></span>
      </CloseButton>
      <div className="sidenav-head">
        <SiteBrandWrapper to="/home" className="inline-flex">
          <div className="brand-img-wrap flex items-center justify-center">
            <img className="site-brand-img" src={staticImages.logo} />
          </div>
          <span className="site-brand-text text-outerspace">MEW</span>
        </SiteBrandWrapper>
        <form className="sidenav-search-form">
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
        <ul className="sidenav-menu-list grid">
          {sideMenuData?.map((menu) => (
            <li key={menu.id}>
              <Link
                to={menu.menuLink}
                className={`flex items-center text-gray ${
                  location.pathname === menu.menuLink ? "active" : ""
                }`}
              >
                <span className="text-xxl">
                  <i className={`bi bi-${menu.iconName}`}></i>
                </span>
                <span className="text-lg font-medium">{menu.menuText}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SideNavigationWrapper>
  );
};

export default Sidebar;
