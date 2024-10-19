import React, { useEffect, useState } from "react";
import "./update.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CRUDHeader from "../../../components/CRUDHeader.jsx"; 
import { LoaderProvider } from '@agney/react-loading';
import CenteredLoader from '../../../components/CenteredLoader.jsx'; 

const UpdateBrand = () => {
  const brands = {
    name: "",
    company: "",
    website: "",
    description: "",
    image: [], // Single 'image' field for multiple images
  };

  const { slug } = useParams();
  const [brand, setBrand] = useState(brands);
  const [newImages, setNewImages] = useState([]); // Store selected images
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Handle input change for form fields
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setBrand({ ...brand, [name]: value });
  };

  // Handle multiple image file selection
  const imageHandler = (e) => {
    setNewImages([...e.target.files]); // Store all selected images in an array
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/brands/${slug}`)
      .then((response) => {
        setBrand(response.data.brand);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [slug]);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData();
    formData.append("name", brand.name);
    formData.append("company", brand.company);
    formData.append("website", brand.website);
    formData.append("description", brand.description);

    newImages.forEach((file) => {
      formData.append("image", file); 
    });

    await axios
      .put(`http://localhost:4000/api/brands/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Brand updated successfully", { position: "top-right" });
        navigate("/brands/all");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  return (
    <LoaderProvider>
      {/* Header */}
      <CRUDHeader />
      <div className="updateBrandContainer">
        {/* Left Section */}
        <div className="leftSections">
          <h2>Update Brand</h2>
          <div className="buttonGroup">
            <Link to="/brands/all" className="btn btn-secondary">
              <i className="fa-solid fa-backward"></i> Back
            </Link>
            <button type="submit" form="updateBrandForm" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="rightSections">
          <form id="updateBrandForm" onSubmit={submitForm}>
            <div className="inputGroup">
              <label htmlFor="name">
                <i className="fa-solid fa-brand"></i> Name:
              </label>
              <input
                type="text"
                id="name"
                value={brand.name}
                onChange={inputHandler}
                name="name"
                autoComplete="off"
                placeholder="Enter your Name"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="company">
                <i className="fa-solid fa-envelope"></i> Company:
              </label>
              <input
                type="company"
                id="company"
                value={brand.company}
                onChange={inputHandler}
                name="company"
                autoComplete="off"
                placeholder="Enter your Company"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="website">
                <i className="fa-solid fa-location-dot"></i> Website:
              </label>
              <input
                type="text"
                id="website"
                value={brand.address}
                onChange={inputHandler}
                name="website"
                autoComplete="off"
                placeholder="Enter your Website"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="description">
                <i className="fa-solid fa-location-dot"></i> Description:
              </label>
              <input
                type="text"
                id="description"
                value={brand.address}
                onChange={inputHandler}
                name="description"
                autoComplete="off"
                placeholder="Enter your Description"
                required
              />
            </div>

            <div className="inputGroup">
              <label>Current Images:</label>
              {brand.image && brand.image.length > 0 ? (
                brand.image.map((image, index) => (
                  <img
                    key={index}
                    src={image} 
                    alt="brand"
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
                multiple 
                accept="image/*" 
              />
            </div>
          </form>
        </div>
      </div>
      {loading && <CenteredLoader />}
    </LoaderProvider>
  );
};

export default UpdateBrand;
