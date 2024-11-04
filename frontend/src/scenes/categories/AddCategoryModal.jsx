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
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddCategoryModal = ({ open, handleClose, onCategoryAdded }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Formik and Yup setup
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true); // Start loader

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);

      // Append image files
      imageFiles.forEach((file) => {
        formData.append("image", file);
      });

      try {
        const response = await axios.post("http://localhost:4000/api/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        onCategoryAdded(response.data.category); // Update the category list
        toast.success(response.data.message, { position: "top-right" });

        // Reset form and image inputs
        formik.resetForm();
        setImageFiles([]);
        handleClose(); // Close the modal
      } catch (error) {
        const errorMessage = error.response?.data?.error || "An error occurred";
        toast.error(errorMessage, { position: "top-right" });
      } finally {
        setLoading(false); // Stop loader
      }
    },
  });

  // Image input handler
  const imageHandler = (e) => {
    setImageFiles([...e.target.files]);
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
        
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={imageHandler}
            style={{ marginTop: 8 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2 }}>
            {/* Loader to the left of the Add Category button */}
            {loading && (
              <Loader 
                style={{ width: '24px', height: '24px', marginRight: '8px' }} // Set size and margin for spacing
              />
            )}
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 1 }}>
              {loading ? "Adding..." : "Add Category"}
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

export default AddCategoryModal;