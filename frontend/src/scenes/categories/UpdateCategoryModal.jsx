import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import Carousel from "react-material-ui-carousel";
import { toast } from "react-hot-toast";
import { Hearts } from "@agney/react-loading";

const UpdateCategoryModal = ({ open, handleClose, slug }) => { // Change slug to id for categories
  const initialCategoryState = {
    name: "",
    description: "",
    image: [], // Use array for images
  };

  const [category, setCategory] = useState(initialCategoryState);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch category data using the ID
  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:4000/api/categories/${slug}`) // Ensure URL is correct
        .then((response) => {
          setCategory(response.data.category);
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
    formData.append("name", category.name);
    formData.append("description", category.description);

    newImages.forEach((file) => {
      formData.append("image", file);
    });

    try {
      await axios.put(`http://localhost:4000/api/categories/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Category updated successfully", { position: "top-right" });
      handleClose(); // Close the modal after updating
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: 400,
          margin: "auto",
          borderRadius: 2,
          top: "50%",
          left: "50%",
          position: "absolute",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Update Category
        </Typography>
        
        <form onSubmit={submitForm} style={{ width: "100%" }}>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            name="name"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={category.description}
            onChange={(e) => setCategory({ ...category, description: e.target.value })}
            required
          />

          <div className="inputGroup">
          <label>Current Images:</label>
          {category.image && category.image.length > 0 ? (
            <Carousel 
              sx={{ width: '50%', maxWidth: '150px', margin: 'auto' }} 
              autoPlay={false}
              navButtonsAlwaysVisible={true}
              animation="slide"
              indicators={false}
            >
              {category.image.map((image, index) => (
                <img
                  key={index}
                  src={image} 
                  alt={`category-${index}`}
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

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 2 }}>
              {loading ? "Updating..." : "Update Category"}
            </Button>
            <Button 
              variant="contained" 
              onClick={handleClose} 
              sx={{ backgroundColor: "#4ccdac", color: "white", "&:hover": { backgroundColor: "#3cb8a9" } }}
            >
              Back
            </Button>
          </Box>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Hearts color="#4ccdac" height="100" width="100" />
            </Box>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default UpdateCategoryModal;
