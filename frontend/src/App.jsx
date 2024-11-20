import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { GlobalStyles } from "./styles/global/GlobalStyles";
import { Toaster } from "react-hot-toast"; 
import { createContext, useState } from "react";
import { Provider } from "react-redux";  // Import Provider
import {store} from "./redux/store"; // Import your Redux store

// Layouts
import BaseLayout from "./components/layout/BaseLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Store Screens
import Home from "./screens/home/HomeScreen";
import ProductList from "./screens/product/ProductListScreen";
import ProductDetails from "./screens/product/ProductDetailsScreen";
import Cart from "./screens/cart/CartScreen";
import CartEmpty from "./screens/cart/CartEmptyScreen";
import Checkout from "./screens/checkout/CheckoutScreen";
import Order from "./screens/user/OrderListScreen";
import OrderDetail from "./screens/user/OrderDetailScreen";
import WishList from "./screens/user/WishListScreen";
import WishListEmpty from "./screens/user/WishListEmptyScreen";
import Confirm from "./screens/user/ConfirmScreen";
import Account from "./screens/user/AccountScreen";
import Address from "./screens/user/AddressScreen";

// Auth Screens
import SignIn from "./screens/auth/SignInScreen";
import SignUp from "./screens/auth/SignUpScreen";
import Reset from "./screens/auth/ResetScreen";
import ChangePassword from "./screens/auth/ChangePasswordScreen";
import CheckMail from "./screens/auth/CheckMailScreen";
import Verification from "./screens/auth/VerificationScreen";
import NotFound from "./screens/error/NotFoundScreen";

// Admin Screens
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
  Products,
  Promos,
  Categories,
  Users,
  Brands,
} from "./scenes";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { ConfirmProvider } from "material-ui-confirm";

export const ToggledContext = createContext(null);


//Protected Route
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  const userRole = "customer";

  return (
  <ConfirmProvider>
    <Provider store={store}> {/* Wrap the entire app with Provider */}
      <ToggledContext.Provider value={values}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles />
            <Toaster position="top-right" />
            <Router>
              <Routes>
              <Route element = {<ProtectedRoute role={userRole} expectedRole="customer" />} >
                {/* Store main screens */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                <Route path="/home" element={<BaseLayout />}>
                    <Route index element={<Home />} />
                    <Route path="product" element={<ProductList />} />
                    <Route path="product/details/:slug" element={<ProductDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="empty_cart" element={<CartEmpty />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="orders" element={<Order />} />
                    <Route path="order_detail" element={<OrderDetail />} />
                    <Route path="wishlist" element={<WishList />} />
                    <Route path="empty_wishlist" element={<WishListEmpty />} />
                    <Route path="confirm" element={<Confirm />} />
                    <Route path="account" element={<Account />} />
                    <Route path="account/add" element={<Address />} />
                  </Route>
              </Route>

                {/* Auth screens */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="sign_in" element={<SignIn />} />
                  <Route path="sign_up" element={<SignUp />} />
                  <Route path="reset" element={<Reset />} />
                  <Route path="change_password" element={<ChangePassword />} />
                  <Route path="check_mail" element={<CheckMail />} />
                  <Route path="verification" element={<Verification />} />
                </Route>

                {/* Admin screens */}
                <Route
                    element={<ProtectedRoute role={userRole} expectedRole="admin" />}
                  >
                <Route
                      path="/admin"
                      element={
                        <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
                          <SideBar />
                          <Box
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                              maxWidth: "100%",
                            }}
                          >
                            <Navbar />
                            <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                              <Outlet />
                            </Box>
                          </Box>
                        </Box>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="team" element={<Team />} />
                      <Route path="products" element={<Products />} />
                      <Route path="promos" element={<Promos />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="users" element={<Users />} />
                      <Route path="brands" element={<Brands />} />
                      <Route path="contacts" element={<Contacts />} />
                      <Route path="invoices" element={<Invoices />} />
                      <Route path="form" element={<Form />} />
                      <Route path="calendar" element={<Calendar />} />
                      <Route path="bar" element={<Bar />} />
                      <Route path="pie" element={<Pie />} />
                      <Route path="stream" element={<Stream />} />
                      <Route path="line" element={<Line />} />
                      <Route path="faq" element={<FAQ />} />
                      <Route path="geography" element={<Geography />} />
                    </Route>
               </Route>

                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </ToggledContext.Provider>
    </Provider>
    </ConfirmProvider>
  );
}

export default App;
