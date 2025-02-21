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
import { EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';

//firebase
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../components/firebase/firebase"; // Import Firebase auth
import { getMessaging, getToken, deleteToken } from "firebase/messaging";
import { messaging } from "../../components/firebase/firebase";

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
  const [hasCart, setHasCart] = useState(false);

  const navigate = useNavigate();

  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const onLoginSuccess = async (customerId) => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered with scope:', registration.scope);

        // Delete existing FCM token
        const existingToken = await getToken(messaging, { vapidKey: 'BIq1zeTLBmpI13o48c2ZzQdeEWB_fS5c_ED5lje65DRxAqNVPxmWoMMqcqq5g5q3zc6hyXa4TwhTU2Dj5-GPG1E', serviceWorkerRegistration: registration });
        if (existingToken) {
          await deleteToken(messaging);
          console.log('Existing FCM token deleted');
        }

        // Request a new FCM token
        const fcmToken = await getToken(messaging, { vapidKey: 'BIq1zeTLBmpI13o48c2ZzQdeEWB_fS5c_ED5lje65DRxAqNVPxmWoMMqcqq5g5q3zc6hyXa4TwhTU2Dj5-GPG1E', serviceWorkerRegistration: registration });

        if (fcmToken) {
          console.log('New FCM Token:', fcmToken);

          // Send FCM token to backend
          await axios.post(`http://localhost:4000/api/auth/store-fcm-token`, { customerId, fcmToken }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
          });

          console.log('FCM token stored successfully');
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
    }
  };

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
        localStorage.setItem('customerId', customerId); // Store customerId in localStorage
        console.log(customerId)

        await onLoginSuccess(customerId);

        // After setting authToken and customerId in localStorage
        if (customerId) {
          try {
            const cartResponse = await axios.get(`http://localhost:4000/api/cart/${customerId}`);
            const hasCart = cartResponse.data && cartResponse.data.cartItems.length > 0;

            // Store cart status in localStorage for access in Header
            // Update localStorage with cart status
            localStorage.setItem('hasCart', hasCart);
            setHasCart(hasCart); // Update local state if needed

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

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send the user information to your backend to create or update the user record
      const url = 'http://localhost:4000/api/auth/google-login';
      const { data } = await axios.post(url, {
        email: user.email,
        firebaseUid: user.uid,
      });

      // Store the token and customerId in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('customerId', data.customerId);

      // Handle FCM token storage
      await onLoginSuccess(data.customerId);

      // Show toast notification to update profile
      toast.success('Login successful! Please update your profile.');

      navigate('/home');
    } catch (error) {
      console.error("Google sign-in failed", error);
      toast.error(error.message || "Google sign-in failed");
    }
  };

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

              <AuthOptions handleGoogleSignUp={handleGoogleSignIn} />

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