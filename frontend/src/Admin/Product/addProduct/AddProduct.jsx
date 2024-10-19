import React, { useState } from 'react';
import "./addproduct.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";
import CRUDHeader from "../../../components/CRUDHeader.jsx";
import { LoaderProvider } from '@agney/react-loading';
import CenteredLoader from '../../../components/CenteredLoader.jsx'; 

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const imageHandler = (e) => {
    setImageFiles([...e.target.files]);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    imageFiles.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/products", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message, { position: "top-right" });
      navigate("/products/all");
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
      <div className="addProductContainer">
        <div className="leftSection">
          <h2>Add Product</h2>
          <div className="buttonGroup">
            <Link to="/products/all" className="btn btn-secondary">
              <i className="fa-solid fa-backward"></i> Back
            </Link>
            <button type="submit" form="addProductForm" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <div className="rightSection">
          <form id="addProductForm" onSubmit={submitForm}>
            <div className="inputGroup">
              <label htmlFor="name">
                <i className="fa-solid fa-product"></i> Name:
              </label>
              <input
                type="text"
                id="name"
                onChange={inputHandler}
                name="name"
                autoComplete="off"
                placeholder="Enter Product Name"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="description">
                <i className="fa-solid fa-envelope"></i> Description:
              </label>
              <input
                type="text"
                id="description"
                onChange={inputHandler}
                name="description"
                autoComplete="off"
                placeholder="Enter Product Description"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="price">
                <i className="fa-solid fa-tag"></i> Price:
              </label>
              <input
                type="number"
                id="price"
                onChange={inputHandler}
                name="price"
                autoComplete="off"
                placeholder="Enter Product Price"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="stock">
                <i className="fa-solid fa-box"></i> Stock:
              </label>
              <input
                type="number"
                id="stock"
                onChange={inputHandler}
                name="stock"
                autoComplete="off"
                placeholder="Enter Product Stock"
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

export default AddProduct;
