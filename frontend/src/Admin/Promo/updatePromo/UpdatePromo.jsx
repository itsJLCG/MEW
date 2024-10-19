import React, { useEffect, useState } from "react";
import "./update.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CRUDHeader from "../../../components/CRUDHeader.jsx"; 
import { LoaderProvider } from '@agney/react-loading';
import CenteredLoader from '../../../components/CenteredLoader.jsx'; 

const UpdatePromo = () => {
  const initialPromo = {
    name: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    image: [], // Single 'image' field for multiple images
  };

  const { slug } = useParams();
  const [promo, setPromo] = useState(initialPromo);
  const [newImages, setNewImages] = useState([]); // Store selected images
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Handle input change for form fields
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setPromo({ ...promo, [name]: value });
  };

  // Handle multiple image file selection
  const imageHandler = (e) => {
    setNewImages([...e.target.files]); // Store all selected images in an array
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/promos/${slug}`)
      .then((response) => {
        const fetchedPromo = response.data.promo;
  
        // Format dates to YYYY-MM-DD
        const formattedStartDate = fetchedPromo.startDate ? new Date(fetchedPromo.startDate).toISOString().split("T")[0] : "";
        const formattedEndDate = fetchedPromo.endDate ? new Date(fetchedPromo.endDate).toISOString().split("T")[0] : "";
  
        setPromo({
          ...fetchedPromo,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [slug]);
  

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData();
    formData.append("name", promo.name);
    formData.append("description", promo.description);
    formData.append("discount", promo.discount);
    formData.append("startDate", promo.startDate);
    formData.append("endDate", promo.endDate);

    newImages.forEach((file) => {
      formData.append("image", file); 
    });

    await axios
      .put(`http://localhost:4000/api/promos/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Promo updated successfully", { position: "top-right" });
        navigate("/promos/all");
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
      <div className="updatePromoContainer">
        {/* Left Section */}
        <div className="leftSections">
          <h2>Update Promo</h2>
          <div className="buttonGroup">
            <Link to="/promos/all" className="btn btn-secondary">
              <i className="fa-solid fa-backward"></i> Back
            </Link>
            <button type="submit" form="updatePromoForm" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="rightSections">
          <form id="updatePromoForm" onSubmit={submitForm}>
            <div className="inputGroup">
              <label htmlFor="name">
                <i className="fa-solid fa-promo"></i> Name:
              </label>
              <input
                type="text"
                id="name"
                value={promo.name}
                onChange={inputHandler}
                name="name"
                autoComplete="off"
                placeholder="Enter Promo Name"
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
                value={promo.description}
                onChange={inputHandler}
                name="description"
                autoComplete="off"
                placeholder="Enter Promo Description"
                required
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="discount">
                <i className="fa-solid fa-percent"></i> Discount:
              </label>
              <input
                type="number"
                id="discount"
                value={promo.discount}
                onChange={inputHandler}
                name="discount"
                autoComplete="off"
                placeholder="Enter Discount Percentage"
                required
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="startDate">
                <i className="fa-solid fa-calendar-day"></i> Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={promo.startDate}
                onChange={inputHandler}
                name="startDate"
                required
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="endDate">
                <i className="fa-solid fa-calendar-day"></i> End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={promo.endDate}
                onChange={inputHandler}
                name="endDate"
                required
              />
            </div>

            <div className="inputGroup">
              <label>Current Images:</label>
              {promo.image && promo.image.length > 0 ? (
                promo.image.map((image, index) => (
                  <img
                    key={index}
                    src={image} 
                    alt="promo"
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

export default UpdatePromo;
