import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Hearts } from '@agney/react-loading';

const UpdateProductModal = ({ open, handleClose, slug }) => {
  const initialProductState = {
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
    category: "", // To store category ID
    brand: "", // To store brand ID
  };

  const [product, setProduct] = useState(initialProductState);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch product data using the slug
  useEffect(() => {
    const fetchProductData = async () => {
      if (slug) {
        try {
          const response = await axios.get(`http://localhost:4000/api/products/${slug}`);
          setProduct(response.data.product); // Ensure the product data includes category and brand IDs
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch product data", { position: "top-right" });
        }
      }
    };

    const fetchCategoriesAndBrands = async () => {
      try {
        const categoryResponse = await axios.get("http://localhost:4000/api/categories/all");
        const brandResponse = await axios.get("http://localhost:4000/api/brands/all");

        setCategories(categoryResponse.data.categories || []);
        setBrands(brandResponse.data.brands || []);
      } catch (error) {
        console.error("Error fetching categories and brands:", error);
      }
    };

    fetchProductData();
    fetchCategoriesAndBrands();
  }, [slug]);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("category", product.category);
    formData.append("brand", product.brand);

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.put(`http://localhost:4000/api/products/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product updated successfully", { position: "top-right" });
      handleClose();
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

          <TextField
            select
            fullWidth
            margin="normal"
            label="Category"
            name="category"
            value={product.category} // Should hold the ID of the category
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Brand"
            name="brand"
            value={product.brand} // Should hold the ID of the brand
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
            required
          >
            {brands.map((br) => (
              <MenuItem key={br._id} value={br._id}>
                {br.name}
              </MenuItem>
            ))}
          </TextField>

          <div className="inputGroup">
          <label>Current Images:</label>
          {product.image && product.image.length > 0 ? (
            <Carousel 
              sx={{ width: '50%', maxWidth: '150px', margin: 'auto' }} 
              autoPlay={false}
              navButtonsAlwaysVisible={true}
              animation="slide"
              indicators={false}
            >
              {product.image.map((image, index) => (
                <img
                  key={index}
                  src={image} 
                  alt={`product-${index}`}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
                />
              ))}
            </Carousel>
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
