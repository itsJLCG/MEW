import React, { useState } from 'react';
import "./addbrand.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";
import CRUDHeader from "../../../components/CRUDHeader.jsx";
import { LoaderProvider } from '@agney/react-loading';
import CenteredLoader from '../../../components/CenteredLoader.jsx'; 

const AddBrand = () => {
  const [brand, setBrand] = useState({
    name: "",
    company: "",
    website: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setBrand({ ...brand, [name]: value });
  };

  const imageHandler = (e) => {
    setImageFiles([...e.target.files]);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', brand.name);
    formData.append('company', brand.company);
    formData.append('website', brand.website);
    formData.append('description', brand.description);
    imageFiles.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/brands", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message, { position: "top-right" });
      navigate("/brands/all");
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
      <div className="addBrandContainer">
        <div className="leftSection">
          <h2>Add Brand</h2>
          <div className="buttonGroup">
            <Link to="/brands/all" className="btn btn-secondary">
              <i className="fa-solid fa-backward"></i> Back
            </Link>
            <button type="submit" form="addBrandForm" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <div className="rightSection">
          <form id="addBrandForm" onSubmit={submitForm}>
            <div className="inputGroup">
              <label htmlFor="name">
                <i className="fa-solid fa-brand"></i> Name:
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
              <label htmlFor="company">
                <i className="fa-solid fa-envelope"></i> Company:
              </label>
              <input
                type="company"
                id="company"
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
                onChange={inputHandler}
                name="description"
                autoComplete="off"
                placeholder="Enter your Description"
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
      {loading && <CenteredLoader />}
    </LoaderProvider>
  );
};

export default AddBrand;
