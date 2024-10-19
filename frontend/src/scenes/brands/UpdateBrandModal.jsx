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

const UpdateBrandModal = ({ open, handleClose, slug }) => { // Add slug here
  const initialBrandState = {
    name: "",
    company: "",
    website: "",
    description: "",
    image: [], // Use array for images
  };

  const [brand, setBrand] = useState(initialBrandState);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch brand data using the slug
  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:4000/api/brands/${slug}`) // Ensure URL is correct
        .then((response) => {
          setBrand(response.data.brand);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [slug]);

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", brand.name);
    formData.append("company", brand.company);
    formData.append("website", brand.website);
    formData.append("description", brand.description);

    newImages.forEach((file) => {
      formData.append("image", file);
    });

    try {
      await axios.put(`http://localhost:4000/api/brands/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Brand updated successfully", { position: "top-right" });
      handleClose(); // Close the modal after updating
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error("Failed to update brand", { position: "top-right" });
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
          Update Brand
        </Typography>
        
        <form onSubmit={submitForm} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Brand Name"
            name="name"
            value={brand.name}
            onChange={(e) => setBrand({ ...brand, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Company"
            name="company"
            value={brand.company}
            onChange={(e) => setBrand({ ...brand, company: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Website"
            name="website"
            value={brand.website}
            onChange={(e) => setBrand({ ...brand, website: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={brand.description}
            onChange={(e) => setBrand({ ...brand, description: e.target.value })}
            required
          />

          <div className="inputGroup">
            <label>Current Images:</label>
            {brand.image && brand.image.length > 0 ? (
              brand.image.map((image, index) => (
                <img
                  key={index}
                  src={image} 
                  alt="brand"
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
              {loading ? "Updating..." : "Update Brand"}
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

export default UpdateBrandModal;
