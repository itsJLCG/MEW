import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ProtectedRoute = ({ expectedRole }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");

  const MySwal = withReactContent(Swal);
  
    useEffect(() => {
      const fetchUserData = async () => {
        if (authToken) {
          try {
            MySwal.fire({
              title: "Loading...",
              text: "Please Wait Patiently...",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
  
            const response = await axios.get("http://localhost:4000/api/users/all", {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
  
            const { users } = response.data;
            const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
            const currentUser = users.find(user => user._id === decodedToken.id);
  
            if (currentUser) {
              setRole(currentUser.role);
            } else {
              setRole(null);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setRole(null);
          } finally {
            setLoading(false);
            Swal.close(); // Close the SweetAlert loading modal
          }
        } else {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, [authToken]);
  
    // If still loading, the SweetAlert will display, so no need for additional loading UI
    if (loading) return null;
  
    if (!authToken) {
      return <Navigate to="/auth/sign_in" replace />;
    }
  
    if (role !== expectedRole) {
      return <Navigate to={`/${role === "admin" ? "admin" : "home"}`} replace />;
    }
  
    return <Outlet />;
  };
  
  export default ProtectedRoute;