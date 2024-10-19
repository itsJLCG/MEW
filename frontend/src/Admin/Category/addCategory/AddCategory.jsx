import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import './addCategory.css'; // Custom styling for the form
import CRUDHeader from "../../../components/CRUDHeader.jsx"; 
import { LoaderProvider } from '@agney/react-loading';
import CenteredLoader from '../../../components/CenteredLoader.jsx'; 

const AddCategory = () => {
  const initialCategoryState = {
    name: "",
    description: "",
    image: [], // Multiple images support
  };

  const [category, setCategory] = useState(initialCategoryState);
  const [newImages, setNewImages] = useState([]); // For handling image uploads
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes for name and description
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Handle image uploads
  const imageHandler = (e) => {
    setNewImages([...e.target.files]); // Store selected images
  };

  // Submit the form data
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("description", category.description);

    // Append each image file to the form data
    newImages.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category added successfully!", { position: "top-right" });
      setCategory(initialCategoryState); // Reset the form after submission
      navigate("/categories/all"); // Redirect to the categories list page
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoaderProvider>
      {/* Header */}
      <CRUDHeader />
      <div className="addCategoryContainer">
        <div className="leftSections">
          <h2>Add Category</h2>
          <div className="buttonGroup">
            <Link to="/categories/all" className="btn btn-secondary">
              <i className="fa-solid fa-backward"></i> Back
            </Link>
            <button
              type="submit"
              form="addCategoryForm"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="rightSections">
          <form id="addCategoryForm" onSubmit={submitForm}>
            <div className="inputGroup">
              <label htmlFor="name">
                <i className="fa-solid fa-tags"></i> Name:
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
                <i className="fa-solid fa-file-alt"></i> Description:
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
              <label htmlFor="images">
                <i className="fa-solid fa-image"></i> Upload Images:
              </label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={imageHandler}
                multiple
                accept="image/*" // Ensure only image files are selected
              />
            </div>
          </form>
        </div>
      </div>

      {/* Loading spinner */}
      {loading && <CenteredLoader />}
    </LoaderProvider>
  );
};

export default AddCategory;
