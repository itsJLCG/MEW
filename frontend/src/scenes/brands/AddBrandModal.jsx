import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast
import { Hearts } from '@agney/react-loading'; // Import the Hearts loader

const AddBrandModal = ({ open, handleClose, onBrandAdded }) => {
  const [brand, setBrand] = useState({
    name: "",
    company: "",
    website: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrand((prevBrand) => ({
      ...prevBrand,
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
    formData.append('name', brand.name);
    formData.append('company', brand.company);
    formData.append('website', brand.website);
    formData.append('description', brand.description);

    // Append image files to FormData
    imageFiles.forEach((file) => {
      formData.append('image', file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/brands", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onBrandAdded(response.data.brand); // Callback to update the parent component
      toast.success(response.data.message, { position: "top-right" }); // Success notification
      handleClose(); // Close the modal after adding
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      toast.error(errorMessage, { position: "top-right" }); // Error notification
      console.error("Error adding brand:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // Ensure contents are stacked vertically
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
          transform: 'translate(-50%, -50%)', // Centering the modal
        }}
      >
        {/* Title positioned at the top */}
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Add New Brand
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}> {/* Ensure form takes full width */}
          <TextField
            fullWidth
            margin="normal"
            label="Brand Name"
            name="name"
            value={brand.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Company"
            name="company"
            value={brand.company}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Website"
            name="website"
            value={brand.website}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={brand.description}
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
          
          {/* Button container to align buttons to the right */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 2 }}>
              {loading ? "Adding..." : "Add Brand"}
            </Button>

            <Button 
              variant="contained" // Change to contained for solid color
              onClick={handleClose} 
              sx={{ backgroundColor: '#4ccdac', color: 'white', '&:hover': { backgroundColor: '#3cb8a9' } }} // Customize color
            >
              Back
            </Button>
          </Box>

          {/* Show loader when adding */}
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

export default AddBrandModal;
