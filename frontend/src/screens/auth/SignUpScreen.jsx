import React, { useState } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CheckboxGroup,
  FormGridWrapper,
  FormTitle,
} from "../../styles/form_grid";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import AuthOptions from "../../components/auth/AuthOptions";
import { FormElement, Input } from "../../styles/form";
import { Link } from "react-router-dom";
import { BaseButtonBlack } from "../../styles/button";
import axios from "axios";
import {EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";


//firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../components/firebase/firebase"; // Import Firebase auth

const SignUpScreenWrapper = styled.section`
  form {
    margin-top: 40px;
    .form-elem-text {
      margin-top: -16px;
      display: block;
    }
  }
  .text-space {
    margin: 0 4px;
  }
  .input-wrapper {
    position: relative;
  }
  .input-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  .form-elem-block {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }
  .form-elem-block.full-width {
    grid-column: span 2;
  }
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .form-elem-control-error {
    color: red;
    font-size: 100px; /* Adjust the font size here */
    margin-top: 4px;
  }

 .password-toggle-btn {
  position: absolute;
  right: 4px; /* Aligns closer to the right edge */
  top: 6px; /* Aligns closer to the top of the input field */
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #A020F0;
  font-weight: 500;

  &:hover {
    color: #000000;
  }
}

}
`;

const SignUpScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    address: Yup.string().required("Address is required"),
    zipCode: Yup.string().min(4, "Zip Code must be 4 numbers").required("Zip Code is required"),
    profileImage: Yup.mixed()
      .required("A profile image is required")
      .test("fileSize", "Image size is too large. Max 2MB.", (value) => {
        return value && value.size <= 2 * 1024 * 1024;
      })
      .test("fileType", "Unsupported file format. Allowed: jpeg, png.", (value) => {
        return value && ["image/jpeg", "image/png"].includes(value.type);
      }),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      zipCode: "",
      profileImage: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Firebase authentication - create a user
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const firebaseUser = userCredential.user;

        // Proceed with Axios call to save additional user details on the server
        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("phoneNumber", values.phoneNumber);
        formData.append("address", values.address);
        formData.append("zipCode", values.zipCode);
        if (values.profileImage) {
          formData.append("profileImage", values.profileImage);
        }

        const url = "http://localhost:4000/api/auth/signup";
        await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Registration successful!");
        navigate("/auth/sign_in");

      } catch (error) {
        toast.error(error.message || "Registration failed");
      }
    },
  });

  return (
    <SignUpScreenWrapper>
    
      <FormGridWrapper>
        <Container>
          <div className="form-grid-content">
            <div className="form-grid-left">
              <img
                src={staticImages.form_img2}
                className="object-fit-cover"
                alt=""
              />
            </div>
            <div className="form-grid-right">
              <FormTitle>
                <h3>Sign Up</h3>
                <p className="text-base">
                  Sign up for free to access to in any of our products
                </p>
              </FormTitle>
              <AuthOptions />
              <form onSubmit={formik.handleSubmit}>
                <FormElement className="form-grid">
                  {/* Username */}
                  <div className="form-elem-block">
                    <label htmlFor="username" className="forme-elem-label">
                      Username
                    </label>
                    <div className="input-wrapper">
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter Your Username"
                        className="form-elem-control"
                        style={{
                          borderColor: formik.touched.username && formik.errors.username ? 'red' : formik.touched.username && !formik.errors.username ? 'green' : 'initial',
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                      />
                      {formik.touched.username && formik.errors.username ? (
                        <CloseCircleOutlined className="input-icon" style={{ color: 'red' }} />
                      ) : formik.touched.username && !formik.errors.username ? (
                        <CheckCircleOutlined className="input-icon" style={{ color: 'green' }} />
                      ) : null}
                    </div>
                    {formik.touched.username && formik.errors.username && (
                      <div className="form-elem-error">
                        {formik.errors.username}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-elem-block">
                    <label htmlFor="email" className="forme-elem-label">
                      Email
                    </label>
                    <div className="input-wrapper">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter Your Email"
                        className="form-elem-control"
                        style={{
                          borderColor: formik.touched.email && formik.errors.email ? 'red' : formik.touched.email && !formik.errors.email ? 'green' : 'initial',
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <CloseCircleOutlined className="input-icon" style={{ color: 'red' }} />
                      ) : formik.touched.email && !formik.errors.email ? (
                        <CheckCircleOutlined className="input-icon" style={{ color: 'green' }} />
                      ) : null}
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <div className="form-elem-error">
                        {formik.errors.email}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="form-elem-block">
                    <label htmlFor="password" className="forme-elem-label">
                      Password

                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={togglePasswordVisibility}
                      >
                         {showPassword ? (
                              <EyeInvisibleOutlined style={{ fontSize: '15px' }} />
                            ) : (
                              <EyeTwoTone style={{ fontSize: '15px' }} />
                            )}
                      </button>
                    </label>
                    <div className="input-wrapper">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Your Password"
                        className="form-elem-control"
                        style={{
                          borderColor: formik.touched.password && formik.errors.password ? 'red' : formik.touched.password && !formik.errors.password ? 'green' : 'initial',
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <CloseCircleOutlined className="input-icon" style={{ color: 'red' }} />
                      ) : formik.touched.password && !formik.errors.password ? (
                        <CheckCircleOutlined className="input-icon" style={{ color: 'green' }} />
                      ) : null}
                      
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="form-elem-error">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>

                  {/* First Name */}
                  <div className="form-elem-block">
                    <label htmlFor="firstName" className="forme-elem-label">
                      First Name
                    </label>
                    <div className="input-wrapper">
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter Your First Name"
                        className="form-elem-control"
                        style={{
                          borderColor: formik.touched.firstName && formik.errors.firstName ? 'red' : formik.touched.firstName && !formik.errors.firstName ? 'green' : 'initial',
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                      />
                      {formik.touched.firstName && formik.errors.firstName ? (
                        <CloseCircleOutlined className="input-icon" style={{ color: 'red' }} />
                      ) : formik.touched.firstName && !formik.errors.firstName ? (
                        <CheckCircleOutlined className="input-icon" style={{ color: 'green' }} />
                      ) : null}
                    </div>
                    {formik.touched.firstName && formik.errors.firstName && (
                      <div className="form-elem-error">
                        {formik.errors.firstName}
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="form-elem-block">
                    <label htmlFor="lastName" className="forme-elem-label">
                      Last Name
                    </label>
                    <div className="input-wrapper">
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter Your Last Name"
                        className="form-elem-control"
                        style={{
                          borderColor: formik.touched.lastName && formik.errors.lastName ? 'red' : formik.touched.lastName && !formik.errors.lastName ? 'green' : 'initial',
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                      />
                      {formik.touched.lastName && formik.errors.lastName ? (
                        <CloseCircleOutlined className="input-icon" style={{ color: 'red' }} />
                      ) : formik.touched.lastName && !formik.errors.lastName ? (
                        <CheckCircleOutlined className="input-icon" style={{ color: 'green' }} />
                      ) : null}
                    </div>
                    {formik.touched.lastName && formik.errors.lastName && (
                      <div className="form-elem-error">
                        {formik.errors.lastName}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="form-elem-block">
                    <label htmlFor="phoneNumber" className="forme-elem-label">
                      Phone Number
                    </label>
                    <div className="input-wrapper">
                      <Input
                        id="phoneNumber"
                        type="text"
                        placeholder="Enter Your Phone Number"
                        className="form-elem-control"
                        style={{
                          borderColor: formik.touched.phoneNumber && formik.errors.phoneNumber ? 'red' : formik.touched.phoneNumber && !formik.errors.phoneNumber ? 'green' : 'initial',
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phoneNumber}
                      />
                      {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                        <CloseCircleOutlined className="input-icon" style={{ color: 'red' }} />
                      ) : formik.touched.phoneNumber && !formik.errors.phoneNumber ? (
                        <CheckCircleOutlined className="input-icon" style={{ color: 'green' }} />
                      ) : null}
                    </div>
                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                      <div className="form-elem-error">
                        {formik.errors.phoneNumber}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="form-elem-block">
                    <label htmlFor="address" className="forme-elem-label">
                      Address
                    </label>
                    <div className="input-wrapper">
                      <Input
                        id="address"
                        type="text"
                        placeholder="Enter Your Address"
                        className="form-elem-control"
                        style={{
                          borderColor: formik.touched.address && formik.errors.address ? 'red' : formik.touched.address && !formik.errors.address ? 'green' : 'initial',
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                      />
                      {formik.touched.address && formik.errors.address ? (
                        <CloseCircleOutlined className="input-icon" style={{ color: 'red' }} />
                      ) : formik.touched.address && !formik.errors.address ? (
                        <CheckCircleOutlined className="input-icon" style={{ color: 'green' }} />
                      ) : null}
                    </div>
                    {formik.touched.address && formik.errors.address && (
                      <div className="form-elem-error">
                        {formik.errors.address}
                      </div>
                    )}
                  </div>

                  {/* Zip Code */}
                  <div className="form-elem-block">
                    <label htmlFor="zipCode" className="forme-elem-label">
                      Zip Code
                    </label>
                    <div className="input-wrapper">
                      <Input
                        id="zipCode"
                        type="text"
                        placeholder="Enter Your Zip Code"
                        className="form-elem-control"
                        style={{
                          borderColor: formik.touched.zipCode && formik.errors.zipCode ? 'red' : formik.touched.zipCode && !formik.errors.zipCode ? 'green' : 'initial',
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.zipCode}
                      />
                      {formik.touched.zipCode && formik.errors.zipCode ? (
                        <CloseCircleOutlined className="input-icon" style={{ color: 'red' }} />
                      ) : formik.touched.zipCode && !formik.errors.zipCode ? (
                        <CheckCircleOutlined className="input-icon" style={{ color: 'green' }} />
                      ) : null}
                    </div>
                    {formik.touched.zipCode && formik.errors.zipCode && (
                      <div className="form-elem-error">
                        {formik.errors.zipCode}
                      </div>
                    )}
                  </div>

                  {/* Profile Image */}
                  <div className="form-elem-block full-width">
                    <label htmlFor="profileImage" className="forme-elem-label">
                      Profile Image
                    </label>
                    <Input
                      id="profileImage"
                      type="file"
                      name="profileImage"
                      style={{
                        borderColor: formik.touched.profileImage && formik.errors.profileImage ? 'red' : formik.touched.profileImage && !formik.errors.profileImage ? 'green' : 'initial',
                      }}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "profileImage",
                          event.currentTarget.files[0]
                        );
                      }}
                      accept="image/jpeg, image/png"
                    />
                    {formik.touched.profileImage && formik.errors.profileImage && (
                      <div className="form-elem-error">
                        {formik.errors.profileImage}
                      </div>
                    )}
                  </div>

                  <BaseButtonBlack type="submit">
                    Sign Up
                  </BaseButtonBlack>
                </FormElement>
              </form>
              <p>
                Already have an account?{" "}
                <Link to="/auth/sign_in">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </FormGridWrapper>
    </SignUpScreenWrapper>
  );
};

export default SignUpScreen;
