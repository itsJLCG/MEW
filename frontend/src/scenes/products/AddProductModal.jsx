import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
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
    category: "",
    brand: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch categories and brands when the component is mounted
  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const categoryResponse = await axios.get("http://localhost:4000/api/categories/all");
        const brandResponse = await axios.get("http://localhost:4000/api/brands/all");

        setCategories(categoryResponse.data.categories || []); // Adjust the path as necessary
        setBrands(brandResponse.data.brands || []); // Adjust the path as necessary
      } catch (error) {
        console.error("Error fetching categories and brands:", error);
      }
    };
    fetchCategoriesAndBrands();
  }, []);

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
    setLoading(true);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    formData.append('category', product.category); // Add category
    formData.append('brand', product.brand);       // Add brand

    imageFiles.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/products", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newProduct = {
        ...response.data.product,
        images: response.data.product.images || [],
      };

      onProductAdded(newProduct);
      toast.success(response.data.message, { position: "top-right" });
      handleClose();

      setProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
      });
      setImageFiles([]);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error adding product:", errorMessage);
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

          <TextField
            select
            fullWidth
            margin="normal"
            label="Category"
            name="category"
            value={product.category}
            onChange={handleInputChange}
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
            value={product.brand}
            onChange={handleInputChange}
            required
          >
            {brands.map((br) => (
              <MenuItem key={br._id} value={br._id}>
                {br.name}
              </MenuItem>
            ))}
          </TextField>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={imageHandler}
            required
            style={{ marginTop: 8 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2 }}>
            {loading && (
              <Loader 
                style={{ width: '24px', height: '24px', marginRight: '8px' }}
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
