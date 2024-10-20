import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from '../../components/Loader.jsx'; // Adjust the path if necessary

const AddProductModal = ({ open, handleClose, onProductAdded }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const imageHandler = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state immediately upon submission
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stock', product.stock);

    // Append image files to FormData
    imageFiles.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/products", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Ensure the response contains image URLs
      const newProduct = {
        ...response.data.product,
        images: response.data.product.images || [], // Assuming this is the correct path to images in response
      };

      onProductAdded(newProduct); // Callback to update the parent component
      toast.success(response.data.message, { position: "top-right" }); // Success notification
      handleClose(); // Close the modal after adding

      // Reset the form fields after submission
      setProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
      });
      setImageFiles([]); // Clear the image files
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      toast.error(errorMessage, { position: "top-right" }); // Error notification
      console.error("Error adding product:", errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: 400,
          margin: "auto",
          borderRadius: 2,
          top: '50%',
          left: '50%',
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Add New Product
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Product Name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Stock"
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={imageHandler}
            required
            style={{ marginTop: 8 }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2 }}>
            {/* Loader to the left of the Add Product button */}
            {loading && (
              <Loader 
                style={{ width: '24px', height: '24px', marginRight: '8px' }} // Set size and margin for spacing
              />
            )}
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 1 }}>
              {loading ? "Adding..." : "Add Product"}
            </Button>
            
            <Button 
              variant="contained"
              onClick={handleClose}
              sx={{ backgroundColor: '#4ccdac', color: 'white', '&:hover': { backgroundColor: '#3cb8a9' }, ml: 1 }}
            >
              Back
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
