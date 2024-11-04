import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ expectedRole }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUserData = async () => {
      if (authToken) {
        try {
          const response = await axios.get("http://localhost:4000/api/users/all", {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
            },
          });

          const { users } = response.data; // Destructure users from the response
          
          // Here, we assume the token is linked with the user in some way.
  
          const decodedToken = JSON.parse(atob(authToken.split('.')[1])); // Decode JWT to get payload
          const currentUser = users.find(user => user._id === decodedToken.id); // Adjust to your token's structure

          if (currentUser) {
            setRole(currentUser.role); // Set the role from the current user
          } else {
            setRole(null); // If the user is not found, set role to null
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setRole(null); // Handle error by setting role to null
        } finally {
          setLoading(false); // Stop loading after fetching
        }
      } else {
        setLoading(false); // Stop loading if no token
      }
    };

    fetchUserData();
  }, [authToken]);

  // Show a loading indicator while fetching user data
  if (loading) {
    return <div>Loading...</div>; // You can customize this loading state
  }

  // Redirect to sign-in page if no token is found
  if (!authToken) {
    return <Navigate to="/auth/sign_in" replace />;
  }

  // If the user's role doesn't match the expected role, redirect to the appropriate home
  if (role !== expectedRole) {
    return <Navigate to={`/${role === "admin" ? "admin" : "home"}`} replace />;
  }

  // If all checks pass, render the child components
  return <Outlet />;
};

export default ProtectedRoute;
