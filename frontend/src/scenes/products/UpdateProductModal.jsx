import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Hearts } from '@agney/react-loading';

const UpdateProductModal = ({ open, handleClose, slug }) => {
  const initialProductState = {
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [], // Use array for images
  };

  const [product, setProduct] = useState(initialProductState);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch product data using the slug
  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:4000/api/products/${slug}`) // Ensure URL is correct
        .then((response) => {
          setProduct(response.data.product);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to fetch product data", { position: "top-right" });
        });
    }
  }, [slug]);

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);

    newImages.forEach((file) => {
      formData.append("images", file); // Use "images" for the new images field
    });

    try {
      await axios.put(`http://localhost:4000/api/products/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product updated successfully", { position: "top-right" });
      handleClose(); // Close the modal after updating
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product", { position: "top-right" });
    } finally {
      setLoading(false);
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
          Update Product
        </Typography>
        
        <form onSubmit={submitForm} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Product Name"
            name="name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            name="price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
            type="number"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Stock"
            name="stock"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })}
            required
            type="number"
          />

            <div className="inputGroup">
            <label>Current Images:</label>
            {product.image && product.image.length > 0 ? (
              product.image.map((image, index) => (
                <img
                  key={index}
                  src={image} 
                  alt="product"
                  style={{ width: '100px', margin: '5px' }}
                />
              ))
            ) : (
              <p>No images uploaded</p>
            )}
          </div>

          <div className="inputGroup">
            <label htmlFor="images">Upload New Images:</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={(e) => setNewImages([...e.target.files])}
              multiple 
              accept="image/*"
              style={{ marginTop: 8 }}
            />
          </div>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 2 }}>
              {loading ? "Updating..." : "Update Product"}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleClose} 
              sx={{ backgroundColor: '#4ccdac', color: 'white', '&:hover': { backgroundColor: '#3cb8a9' } }}
            >
              Back
            </Button>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Hearts color="#4ccdac" height="100" width="100" />
            </Box>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateProductModal;
