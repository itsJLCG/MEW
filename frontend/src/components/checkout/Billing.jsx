import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import CheckoutSummary from "./CheckoutSummary";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import PropTypes from "prop-types";
import { BaseButtonGreen } from "../../styles/button"; // Import BaseButtonGreen
import { toast } from "react-hot-toast";
import axios from "axios";

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
        color: ${defaultTheme.color_outerspace};

        &.required {
          border-color: red;
        }
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

        &:focus {
          border-color: ${defaultTheme.color_sea_green};
        }

         &.required {
          border-color: red;
        }

        &::placeholder {
          font-size: 12px;
        }
      }

      .error {
        color: red;
        font-size: 12px;
        margin-top: 4px;
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
  }
`;

const Billing = ({ cartItems, setBillingDetails }) => {
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    zipCode: "",
    phoneNumber: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage
        const response = await axios.get("http://localhost:4000/api/auth/customer-details", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const { firstName, lastName, address, zipCode, phoneNumber } = response.data.customer;
        setInitialValues({ firstName, lastName, address, zipCode, phoneNumber, country: "", city: "" });
      } catch (error) {
        console.error("Error fetching customer details:", error);
        toast.error("Failed to fetch customer details");
      }
    };

    fetchCustomerDetails();
  }, []);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      address: Yup.string().required("Street Address is required"),
      zipCode: Yup.string().required("Zip Code is required"),
      phoneNumber: Yup.string().required("Phone Number is required"),
      country: Yup.string().required("Country is required"),
      city: Yup.string().required("City is required"),
    }),
    onSubmit: (values) => {
      setBillingDetails(values);
      toast.success("Billing details saved successfully");
    },
  });

  return (
    <BillingOrderWrapper className="billing-and-order grid items-start">
      <BillingDetailsWrapper>
        <h4 className="text-xxl font-bold text-outerspace">Billing Details</h4>
        <form className="checkout-form" onSubmit={formik.handleSubmit}>
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label htmlFor="firstName" className="text-base font-semibold">
                First Name*
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First Name"
                className="form-control"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="error">{formik.errors.firstName}</div>
              ) : null}
            </div>
            <div className="input-elem">
              <label htmlFor="lastName" className="text-base font-semibold">
                Last Name*
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last Name"
                className="form-control"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="error">{formik.errors.lastName}</div>
              ) : null}
            </div>
          </div>
          <div className="input-elem">
            <label htmlFor="address" className="text-base font-semibold">
              Street Address*
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="House number and street name"
              className="form-control"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.address && formik.errors.address ? (
              <div className="error">{formik.errors.address}</div>
            ) : null}
          </div>
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label htmlFor="zipCode" className="text-base font-semibold">
                Zip Code*
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                placeholder="Postal Code"
                className="form-control"
                value={formik.values.zipCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.zipCode && formik.errors.zipCode ? (
                <div className="error">{formik.errors.zipCode}</div>
              ) : null}
            </div>
            <div className="input-elem">
              <label htmlFor="phoneNumber" className="text-base font-semibold">
                Phone Number*
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                placeholder="Phone Number"
                className="form-control"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="error">{formik.errors.phoneNumber}</div>
              ) : null}
            </div>
          </div>
          <div className="input-elem-group elem-col-2">
            <div className="input-elem">
              <label htmlFor="country" className="text-base font-semibold">
                Country / Region*
              </label>
              <input
                id="country"
                name="country"
                type="text"
                placeholder="Country / Region"
                className="form-control"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.country && formik.errors.country ? (
                <div className="error">{formik.errors.country}</div>
              ) : null}
            </div>
            <div className="input-elem">
              <label htmlFor="city" className="text-base font-semibold">
                City*
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Town / City"
                className="form-control"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.city && formik.errors.city ? (
                <div className="error">{formik.errors.city}</div>
              ) : null}
            </div>
          </div>
          <BaseButtonGreen type="submit">Save Billing Details</BaseButtonGreen>
        </form>
      </BillingDetailsWrapper>
      <CheckoutSummary cartItems={cartItems} />
    </BillingOrderWrapper>
  );
};

Billing.propTypes = {
  cartItems: PropTypes.array.isRequired,
  setBillingDetails: PropTypes.func.isRequired,
};

export default Billing;