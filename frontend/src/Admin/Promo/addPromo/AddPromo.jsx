import React, { useState } from 'react';
import "./addpromo.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";
import CRUDHeader from "../../../components/CRUDHeader.jsx";
import { LoaderProvider } from '@agney/react-loading';
import CenteredLoader from '../../../components/CenteredLoader.jsx'; 

const AddPromo = () => {
  const [promo, setPromo] = useState({
    name: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setPromo({ ...promo, [name]: value });
  };

  const imageHandler = (e) => {
    setImageFiles([...e.target.files]);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', promo.name);
    formData.append('description', promo.description);
    formData.append('discount', promo.discount);
    formData.append('startDate', promo.startDate);
    formData.append('endDate', promo.endDate);

    // Append selected images to formData
    imageFiles.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/promos", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message, { position: "top-right" });
      navigate("/promos/all");
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
      <div className="addPromoContainer">
        <div className="leftSection">
          <h2>Add Promo</h2>
          <div className="buttonGroup">
            <Link to="/promos/all" className="btn btn-secondary">
              <i className="fa-solid fa-backward"></i> Back
            </Link>
            <button type="submit" form="addPromoForm" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <div className="rightSection">
          <form id="addPromoForm" onSubmit={submitForm}>
            <div className="inputGroup">
              <label htmlFor="name">
                <i className="fa-solid fa-tag"></i> Name:
              </label>
              <input
                type="text"
                id="name"
                onChange={inputHandler}
                name="name"
                autoComplete="off"
                placeholder="Enter Promo Name"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="description">
                <i className="fa-solid fa-info-circle"></i> Description:
              </label>
              <input
                type="text"
                id="description"
                onChange={inputHandler}
                name="description"
                autoComplete="off"
                placeholder="Enter Promo Description"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="discount">
                <i className="fa-solid fa-percentage"></i> Discount:
              </label>
              <input
                type="number"
                id="discount"
                onChange={inputHandler}
                name="discount"
                autoComplete="off"
                placeholder="Enter Discount Percentage"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="startDate">
                <i className="fa-solid fa-calendar"></i> Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                onChange={inputHandler}
                name="startDate"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="endDate">
                <i className="fa-solid fa-calendar-check"></i> End Date:
              </label>
              <input
                type="date"
                id="endDate"
                onChange={inputHandler}
                name="endDate"
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

export default AddPromo;
