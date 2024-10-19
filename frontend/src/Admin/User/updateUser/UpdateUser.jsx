import React, { useEffect, useState } from "react";
import "./update.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CRUDHeader from "../../../components/CRUDHeader.jsx"; 
import { LoaderProvider } from '@agney/react-loading';
import CenteredLoader from '../../../components/CenteredLoader.jsx'; 

const UpdateUser = () => {
  const users = {
    name: "",
    email: "",
    address: "",
    image: [], // Single 'image' field for multiple images
  };

  const { slug } = useParams();
  const [user, setUser] = useState(users);
  const [newImages, setNewImages] = useState([]); // Store selected images
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Handle input change for form fields
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle multiple image file selection
  const imageHandler = (e) => {
    setNewImages([...e.target.files]); // Store all selected images in an array
  };

  useEffect(() => {
    // Fetch the user data including the images by slug
    axios
      .get(`http://localhost:4000/api/users/${slug}`)
      .then((response) => {
        setUser(response.data.user); // Set user data including the images
      })
      .catch((error) => {
        console.log(error);
      });
  }, [slug]);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on form submission

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("address", user.address);

    // Append each selected image to the formData
    newImages.forEach((file) => {
      formData.append("image", file); // Use 'image' key for multiple files
    });

    await axios
      .put(`http://localhost:4000/api/users/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("User updated successfully", { position: "top-right" });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false); // Reset loading state after submission
      });
  };

  return (
    <LoaderProvider>
      {/* Header */}
      <CRUDHeader />
      <div className="updateUserContainer">
        {/* Left Section */}
        <div className="leftSections">
          <h2>Update User</h2>
          <div className="buttonGroup">
            <Link to="/" className="btn btn-secondary">
              <i className="fa-solid fa-backward"></i> Back
            </Link>
            <button type="submit" form="updateUserForm" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="rightSections">
          <form id="updateUserForm" onSubmit={submitForm}>
            <div className="inputGroup">
              <label htmlFor="name">
                <i className="fa-solid fa-user"></i> Name:
              </label>
              <input
                type="text"
                id="name"
                value={user.name}
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
                value={user.email}
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
                value={user.address}
                onChange={inputHandler}
                name="address"
                autoComplete="off"
                placeholder="Enter your Address"
                required
              />
            </div>

            <div className="inputGroup">
              <label>Current Images:</label>
              {user.image && user.image.length > 0 ? (
                user.image.map((image, index) => (
                  <img
                    key={index}
                    src={image} 
                    alt="user"
                  />
                ))
              ) : (
                <p>No images uploaded</p>
              )}
            </div>

            <div className="inputGroup">
              <label htmlFor="images">
                <i className="fa-solid fa-image"></i> Upload New Images:
              </label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={imageHandler}
                multiple // Allow multiple file selection
                accept="image/*" // Accept only image files
              />
            </div>
          </form>
        </div>
      </div>
      {loading && <CenteredLoader />} {/* Displaying the centered loader */}
    </LoaderProvider>
  );
};

export default UpdateUser;
