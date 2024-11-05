import React, { useState } from "react";
import styled from "styled-components";
import { FormGridWrapper, FormTitle } from "../../styles/form_grid";
import { Container } from "../../styles/styles";
import { staticImages } from "../../utils/images";
import AuthOptions from "../../components/auth/AuthOptions";
import { Link } from "react-router-dom";
import { BaseButtonBlack } from "../../styles/button";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

import axios from 'axios';
import {EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';

//firebase
import { signInWithEmailAndPassword  } from "firebase/auth";
import { auth } from "../../components/firebase/firebase"; // Import Firebase auth

const SignInScreenWrapper = styled.section`
  .form-separator {
    margin: 32px 0;
    display: flex;
    align-items: center;
    column-gap: 18px;

    @media (max-width: ${breakpoints.lg}) {
      margin: 24px 0;
    }

    .separator-text {
      border-radius: 50%;
      min-width: 36px;
      height: 36px;
      background-color: ${defaultTheme.color_purple};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
    }

    .separator-line {
      width: 100%;
      height: 1px;
      background-color: ${defaultTheme.color_platinum};
    }
  }

  form {
    margin-top: 24px;

    .form-elem-text {
      margin-top: -16px;
      display: block;
    }
  }

  .form-grid-content {
    display: flex;
    gap: 40px;

    @media (max-width: ${breakpoints.lg}) {
      flex-direction: column;
      gap: 20px;
    }

    .form-grid-left {
      flex: 1;
      img {
        width: 100%;
        height: auto;
        object-fit: cover;
      }
    }

    .form-grid-right {
      flex: 1;
      max-width: 400px;
    }
  }

  .account-rel-text {
    margin-top: 16px;
    font-size: 14px;
  }

  .custom-input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    position: relative;
  }
   .custom-input-wrapper {
   position: relative;
  }
  .custom-input-wrapper-error {
    color: red;
    font-size: 15px; /* Adjust the font size here */
  }
  .input-icon {
    position: absolute;
    right: 10px;
    top: 70%;
    transform: translateY(-50%);
  }

  .custom-input-label {
    font-size: 14px;
    font-weight: 500;
  }

  .custom-input {
    padding: 12px;
    border: 1px solid ${defaultTheme.color_platinum};
    border-radius: 4px;
    width: 100%;
    font-size: 16px;
    transition: border-color 0.3s;

    &:focus {
      border-color: ${defaultTheme.color_purple};
      outline: none;
    }
  }

  .password-toggle-btn {
  position: absolute;
  right: 4px; /* Adjust based on your design needs */
  top: 8px; /* Move to the top of the input field */
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: ${defaultTheme.color_purple};
  font-weight: 500;

  &:hover {
    color: ${defaultTheme.color_black};
  }
}

`;


const SignInScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

   // Yup validation schema
   const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const firebaseUser = userCredential.user;

        const url = 'http://localhost:4000/api/auth/login';
        const { data } = await axios.post(url, {
          email: values.email,
          password: values.password,
        }, {
          headers: { 'Content-Type': 'application/json' }
        });

        console.log("Response data:", data);
        
        const user = data.user || data.users; // Adjust to match the response structure
        if (!user.verified) {
          toast.error('Account not verified. Please check your email.');
          setLoading(false);
          return;
        }
        const { customerId } = data; // Corrected from `response.data` to `data`

        localStorage.setItem('authToken', data.token);
        console.log(customerId)
         // After setting authToken and customerId in localStorage
         if (customerId) {
          try {
            const cartResponse = await axios.get(`http://localhost:4000/api/cart/${customerId}`);
            const hasCart = cartResponse.data && cartResponse.data.cartItems.length > 0;
            
            // Store cart status in localStorage for access in Header
            localStorage.setItem('hasCart', hasCart);
          } catch (error) {
            console.error("Error fetching cart data:", error);
          }
        }

        toast.success('Login successful!');
        navigate('/home');

       
      } catch (err) {
        // Log error details to help with debugging
        console.error("Login error:", err);

        if (err.response) {
          console.error("Error response:", err.response);
          // Backend returned an error response (e.g., 401, 500)
          if (err.response.status === 401) {
            toast.error('Invalid email or password');
          } else {
            toast.error(`Login failed: ${err.response.data?.message || 'Please try again.'}`);
          }
        } else if (err.request) {
          // No response from the backend (network issue, CORS issue, etc.)
          console.error("No response from backend:", err.request);
          toast.error('No response from server. Please check your network or CORS settings.');
        } else {
          // Other errors (e.g., request setup issue)
          console.error("Error setting up request:", err.message);
          toast.error('Login failed. Please try again.');
        }

        setError('Invalid email or password');
        setLoading(false);
      }
    },
  });

  

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };


  return (
    <SignInScreenWrapper>
      <FormGridWrapper>
        <Container>
          <div className="form-grid-content">
            {/* Left Side with Image */}
            <div className="form-grid-left">
              <img src={staticImages.form_img1} className="object-fit-cover" alt="Sign In" />
            </div>

            {/* Right Side with Form */}
            <div className="form-grid-right">
              <FormTitle>
                <h3>Sign In</h3>
              </FormTitle>

              <AuthOptions />

              <div className="form-separator flex items-center justify-center">
                <span className="separator-line"></span>
                <span className="separator-text">OR</span>
                <span className="separator-line"></span>
              </div>

              <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Email or Username */}
                <div className="custom-input-wrapper">
                  <label htmlFor="email" className="custom-input-label">
                    Email Address
                  </label>
                  <input
                    type="text"
                    id="email"
                    placeholder="Enter your email"
                    name="email"
                    className="custom-input"
                    style={{
                      borderColor: formik.touched.email && formik.errors.email ? 'red' : formik.touched.email && !formik.errors.email ? 'green' : 'initial',
                    }}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                   {formik.touched.email && formik.errors.email ? (
                        <CloseCircleOutlined className="input-icon" style={{ color: 'red' }} />
                      ) : formik.touched.email && !formik.errors.email ? (
                        <CheckCircleOutlined className="input-icon" style={{ color: 'green' }} />
                      ) : null}
                </div>
                {formik.touched.email && formik.errors.email && (
                          <div className="custom-input-wrapper-error">
                            {formik.errors.email}
                          </div>
                        )}

                {/* Password */}
                <div className="custom-input-wrapper">
                  <label htmlFor="password" className="custom-input-label">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    name="password"
                    className="custom-input"
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
                </div>
                {formik.touched.password && formik.errors.password && (
                      <div className="custom-input-wrapper-error">
                        {formik.errors.password}
                      </div>
                    )}

                {/* Forgot Password */}
                <Link to="/reset" className="form-elem-text text-end font-medium">
                  Forgot your password?
                </Link>

                {/* Sign In Button */}
                <BaseButtonBlack type="submit" className="form-submit-btn">
                  Sign In
                </BaseButtonBlack>
              </form>

              {/* Sign Up Link */}
              <p className="flex flex-wrap account-rel-text">
                Don&apos;t have an account?
                <Link to="/auth/sign_up" className="font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </FormGridWrapper>
    </SignInScreenWrapper>
  );
};

export default SignInScreen;
