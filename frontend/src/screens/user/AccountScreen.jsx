import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import Title from "../../components/common/Title";
import { FormElement, Input } from "../../styles/form";
import { BaseLinkGreen } from "../../styles/button";
import { Link } from "react-router-dom";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

const AccountScreenWrapper = styled.main`
  .address-list {
    margin-top: 20px;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;

    @media (max-width: ${breakpoints.lg}) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .address-item {
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 25px;
    row-gap: 8px;
  }

  .address-tags {
    gap: 12px;

    li {
      height: 28px;
      border-radius: 8px;
      padding: 2px 12px;
      background-color: ${defaultTheme.color_whitesmoke};
    }
  }

  .address-btns {
    margin-top: 12px;
    .btn-separator {
      width: 1px;
      border-radius: 50px;
      background: ${defaultTheme.color_platinum};
      margin: 0 10px;
    }
  }
`;

const breadcrumbItems = [
  {
    label: "Home",
    link: "/",
  },
  { label: "Account", link: "/account" },
];

const AccountScreen = () => {
  return (
    <AccountScreenWrapper className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <Title titleText={"My Account"} />
            <h4 className="title-sm">Contact Details</h4>
            <form>
              <div className="form-wrapper">
                <FormElement className="form-elem">
                  <label
                    htmlFor=""
                    className="form-label font-semibold text-base"
                  >
                    Your Name
                  </label>
                  <div className="form-input-wrapper flex items-center">
                    <Input
                      type="text"
                      className="form-elem-control text-outerspace font-semibold"
                      value="Richard Doe"
                      readOnly
                    />
                    <button type="button" className="form-control-change-btn">
                      Change
                    </button>
                  </div>
                </FormElement>
                <FormElement className="form-elem">
                  <label
                    htmlFor=""
                    className="form-label font-semibold text-base"
                  >
                    Email Address
                  </label>
                  <div className="form-input-wrapper flex items-center">
                    <Input
                      type="email"
                      className="form-elem-control text-outerspace font-semibold"
                      value="richard@gmail.com"
                      readOnly
                    />
                    <button type="button" className="form-control-change-btn">
                      Change
                    </button>
                  </div>
                </FormElement>
                <FormElement className="form-elem">
                  <label
                    htmlFor=""
                    className="form-label font-semibold text-base"
                  >
                    Phone Number
                  </label>
                  <div className="form-input-wrapper flex items-center">
                    <Input
                      type="text"
                      className="form-elem-control text-outerspace font-semibold"
                      value="+9686 6864 3434"
                      readOnly
                    />
                    <button type="button" className="form-control-change-btn">
                      Change
                    </button>
                  </div>
                </FormElement>
                <FormElement className="form-elem">
                  <label
                    htmlFor=""
                    className="form-label font-semibold text-base"
                  >
                    Password
                  </label>
                  <div className="form-input-wrapper flex items-center">
                    <Input
                      type="password"
                      className="form-elem-control text-outerspace font-semibold"
                      value="Pass Key"
                      readOnly
                    />
                    <button type="button" className="form-control-change-btn">
                      Change
                    </button>
                  </div>
                </FormElement>
              </div>
            </form>
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </AccountScreenWrapper>
  );
};

export default AccountScreen;
