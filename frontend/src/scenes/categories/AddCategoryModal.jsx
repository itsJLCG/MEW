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
import { Hearts } from "@agney/react-loading";

const AddCategoryModal = ({ open, handleClose, onCategoryAdded }) => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
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
    formData.append("name", category.name);
    formData.append("description", category.description);

    // Append image files
    imageFiles.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onCategoryAdded(response.data.category); // Callback to update the category list
      toast.success(response.data.message, { position: "top-right" });
      handleClose(); // Close modal
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      toast.error(errorMessage, { position: "top-right" });
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
          Add New Category
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            name="name"
            value={category.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={category.description}
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

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 2 }}>
              {loading ? "Adding..." : "Add Category"}
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

export default AddCategoryModal;
