import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container } from "../../styles/styles";
import Breadcrumb from "../../components/common/Breadcrumb";
import { UserContent, UserDashboardWrapper } from "../../styles/user";
import UserMenu from "../../components/user/UserMenu";
import Title from "../../components/common/Title";
import { BaseButtonGreen } from "../../styles/button";
import { Link } from "react-router-dom";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import axios from "axios";
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Avatar } from '@mui/material';

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

  .error {
    color: red;
  }

  .invalid {
    border-color: red;
  }
`;

const breadcrumbItems = [
  {
    label: "Home",
    link: "/",
  },
  { label: "Account", link: "/account" },
];

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  address: Yup.string().required('Address is required'),
  zipCode: Yup.string().required('Zip code is required'),
});

const AccountScreen = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    address: "",
    zipCode: "",
    profileImage: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const { user, customer } = response.data;
        setUserData({
          username: user.username,
          email: user.email,
          phoneNumber: customer.phoneNumber,
          firstName: customer.firstName,
          lastName: customer.lastName,
          address: customer.address,
          zipCode: customer.zipCode,
          profileImage: customer.profileImage.url,
        });
        setPreviewImage(customer.profileImage.url);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFieldValue("profileImage", file);
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      await axios.put("http://localhost:4000/api/auth/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <AccountScreenWrapper className="page-py-spacing">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <UserDashboardWrapper>
          <UserMenu />
          <UserContent>
            <Title titleText={"My Account"} />
            <h4 className="title-sm">Contact Details</h4>
            <Formik
              initialValues={userData}
              validationSchema={validationSchema}
              onSubmit={handleUpdateProfile}
              enableReinitialize
            >
              {({ setFieldValue, errors, touched }) => (
                <Form>
                  <div className="form-wrapper">
                    <Field name="username">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="User Name"
                          variant="outlined"
                          fullWidth
                          error={touched.username && Boolean(errors.username)}
                          helperText={touched.username && errors.username}
                          margin="normal"
                        />
                      )}
                    </Field>
                    <Field name="email">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Email Address"
                          variant="outlined"
                          fullWidth
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          margin="normal"
                        />
                      )}
                    </Field>
                    <Field name="phoneNumber">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Phone Number"
                          variant="outlined"
                          fullWidth
                          error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                          helperText={touched.phoneNumber && errors.phoneNumber}
                          margin="normal"
                        />
                      )}
                    </Field>
                    <Field name="firstName">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="First Name"
                          variant="outlined"
                          fullWidth
                          error={touched.firstName && Boolean(errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                          margin="normal"
                        />
                      )}
                    </Field>
                    <Field name="lastName">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Last Name"
                          variant="outlined"
                          fullWidth
                          error={touched.lastName && Boolean(errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                          margin="normal"
                        />
                      )}
                    </Field>
                    <Field name="address">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Address"
                          variant="outlined"
                          fullWidth
                          error={touched.address && Boolean(errors.address)}
                          helperText={touched.address && errors.address}
                          margin="normal"
                        />
                      )}
                    </Field>
                    <Field name="zipCode">
                      {({ field }) => (
                        <TextField
                          {...field}
                          label="Zip Code"
                          variant="outlined"
                          fullWidth
                          error={touched.zipCode && Boolean(errors.zipCode)}
                          helperText={touched.zipCode && errors.zipCode}
                          margin="normal"
                        />
                      )}
                    </Field>
                    <div className="form-elem">
                      <label htmlFor="profileImage" className="form-label font-semibold text-base">
                        Profile Image
                      </label>
                      <div className="form-input-wrapper flex items-center">
                        {previewImage && (
                          <Avatar
                            src={previewImage}
                            alt="Profile"
                            sx={{ width: 100, height: 100, marginRight: 2 }}
                          />
                        )}
                        <input
                          type="file"
                          name="profileImage"
                          className="form-elem-control text-outerspace font-semibold"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Save
                  </Button>
                </Form>
              )}
            </Formik>
          </UserContent>
        </UserDashboardWrapper>
      </Container>
    </AccountScreenWrapper>
  );
};

export default AccountScreen;