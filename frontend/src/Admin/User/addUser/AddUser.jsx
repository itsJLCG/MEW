import React, { useState } from 'react';
import "./adduser.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";
import CRUDHeader from "../../../components/CRUDHeader.jsx";
import { LoaderProvider } from '@agney/react-loading';
import CenteredLoader from '../../../components/CenteredLoader.jsx'; 

const AddUser = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const imageHandler = (e) => {
    setImageFiles([...e.target.files]);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('address', user.address);
    imageFiles.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/users", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message, { position: "top-right" });
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      toast.error(errorMessage, { position: "top-right" });
      console.error('Error uploading data:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoaderProvider>
      <CRUDHeader />
      <div className="addUserContainer">
        <div className="leftSection">
          <h2>Add User</h2>
          <div className="buttonGroup">
            <Link to="/" className="btn btn-secondary">
              <i className="fa-solid fa-backward"></i> Back
            </Link>
            <button type="submit" form="addUserForm" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <div className="rightSection">
          <form id="addUserForm" onSubmit={submitForm}>
            <div className="inputGroup">
              <label htmlFor="name">
                <i className="fa-solid fa-user"></i> Name:
              </label>
              <input
                type="text"
                id="name"
                onChange={inputHandler}
                name="name"
                autoComplete="off"
                placeholder="Enter your Name"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="email">
                <i className="fa-solid fa-envelope"></i> Email:
              </label>
              <input
                type="email"
                id="email"
                onChange={inputHandler}
                name="email"
                autoComplete="off"
                placeholder="Enter your Email"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="address">
                <i className="fa-solid fa-location-dot"></i> Address:
              </label>
              <input
                type="text"
                id="address"
                onChange={inputHandler}
                name="address"
                autoComplete="off"
                placeholder="Enter your Address"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="image">
                <i className="fa-solid fa-image"></i> Images:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={imageHandler}
                multiple
                accept="image/*"
              />
            </div>
          </form>
        </div>
      </div>
      {loading && <CenteredLoader />} {/* Displaying the centered loader */}
    </LoaderProvider>
  );
};

export default AddUser;
