import React, { useEffect, useState } from "react";
import "./update.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CRUDHeader from "../../../components/CRUDHeader.jsx"; 
import { LoaderProvider } from '@agney/react-loading';
import CenteredLoader from '../../../components/CenteredLoader.jsx'; 

const UpdateCategory = () => {
  const categories = {
    name: "",
    description: "",
    image: [], // Single 'image' field for multiple images
  };

  const { slug } = useParams();
  const [category, setCategory] = useState(categories);
  const [newImages, setNewImages] = useState([]); // Store selected images
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Handle input change for form fields
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Handle multiple image file selection
  const imageHandler = (e) => {
    setNewImages([...e.target.files]); // Store all selected images in an array
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/categories/${slug}`)
      .then((response) => {
        setCategory(response.data.category);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [slug]);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("description", category.description);

    newImages.forEach((file) => {
      formData.append("image", file); 
    });

    await axios
      .put(`http://localhost:4000/api/categories/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Category updated successfully", { position: "top-right" });
        navigate("/categories/all");
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
      <div className="updateCategoryContainer">
        {/* Left Section */}
        <div className="leftSections">
          <h2>Update Category</h2>
          <div className="buttonGroup">
            <Link to="/categories/all" className="btn btn-secondary">
              <i className="fa-solid fa-backward"></i> Back
            </Link>
            <button type="submit" form="updateCategoryForm" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="rightSections">
          <form id="updateCategoryForm" onSubmit={submitForm}>
            <div className="inputGroup">
              <label htmlFor="name">
                <i className="fa-solid fa-brand"></i> Name:
              </label>
              <input
                type="text"
                id="name"
                value={category.name}
                onChange={inputHandler}
                name="name"
                autoComplete="off"
                placeholder="Enter Category Name"
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
                value={category.description}
                onChange={inputHandler}
                name="description"
                autoComplete="off"
                placeholder="Enter Category Description"
                required
              />
            </div>

            <div className="inputGroup">
              <label>Current Images:</label>
              {category.image && category.image.length > 0 ? (
                category.image.map((image, index) => (
                  <img
                    key={index}
                    src={image} 
                    alt="category"
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

export default UpdateCategory;
