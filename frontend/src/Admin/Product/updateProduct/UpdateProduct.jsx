import React, { useEffect, useState } from "react";
import "./update.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CRUDHeader from "../../../components/CRUDHeader.jsx"; 
import { LoaderProvider } from '@agney/react-loading';
import CenteredLoader from '../../../components/CenteredLoader.jsx'; 

const UpdateProduct = () => {
  const productFields = {
    name: "",
    description: "",
    price: "",
    stock: "",
    image: [], // Single 'image' field for multiple images
  };

  const { slug } = useParams();
  const [product, setProduct] = useState(productFields);
  const [newImages, setNewImages] = useState([]); // Store selected images
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Handle input change for form fields
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle multiple image file selection
  const imageHandler = (e) => {
    setNewImages([...e.target.files]); // Store all selected images in an array
  };

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/products/${slug}`)
      .then((response) => {
        setProduct(response.data.product);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [slug]);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);

    newImages.forEach((file) => {
      formData.append("image", file); 
    });

    await axios
      .put(`http://localhost:4000/api/products/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Product updated successfully", { position: "top-right" });
        navigate("/products/all");
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
      <div className="updateProductContainer">
        {/* Left Section */}
        <div className="leftSections">
          <h2>Update Product</h2>
          <div className="buttonGroup">
            <Link to="/products/all" className="btn btn-secondary">
              <i className="fa-solid fa-backward"></i> Back
            </Link>
            <button type="submit" form="updateProductForm" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="rightSections">
          <form id="updateProductForm" onSubmit={submitForm}>
            <div className="inputGroup">
              <label htmlFor="name">
                <i className="fa-solid fa-product"></i> Name:
              </label>
              <input
                type="text"
                id="name"
                value={product.name}
                onChange={inputHandler}
                name="name"
                autoComplete="off"
                placeholder="Enter Product Name"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="description">
                <i className="fa-solid fa-info"></i> Description:
              </label>
              <input
                type="text"
                id="description"
                value={product.description}
                onChange={inputHandler}
                name="description"
                autoComplete="off"
                placeholder="Enter Product Description"
                required
              />
            </div>
            <div className="inputGroup">
              <label htmlFor="price">
                <i className="fa-solid fa-dollar-sign"></i> Price:
              </label>
              <input
                type="text"
                id="price"
                value={product.price}
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
                type="text"
                id="stock"
                value={product.stock}
                onChange={inputHandler}
                name="stock"
                autoComplete="off"
                placeholder="Enter Product Stock"
                required
              />
            </div>

            <div className="inputGroup">
              <label>Current Images:</label>
              {product.image && product.image.length > 0 ? (
                product.image.map((image, index) => (
                  <img
                    key={index}
                    src={image} 
                    alt="product"
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

export default UpdateProduct;
