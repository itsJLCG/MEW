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
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from '../../components/Loader.jsx'; // Adjust the path if necessary

const AddUserModal = ({ open, handleClose, onUserAdded }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("User name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      address: Yup.string()
        .required("Address is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true); // Start loading state immediately upon submission
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('address', values.address);

      // Append image files to FormData
      imageFiles.forEach((file) => {
        formData.append('image', file);
      });

      try {
        const response = await axios.post("http://localhost:4000/api/users", formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Ensure the response contains image URLs
        const newUser = {
          ...response.data.user,
          images: response.data.user.images || [], // Assuming this is the correct path to images in response
        };

        onUserAdded(newUser); // Callback to update the parent component
        toast.success(response.data.message, { position: "top-right" }); // Success notification
        handleClose(); // Close the modal after adding

        // Reset the form fields after submission
        formik.resetForm();
        setImageFiles([]); // Clear the image files
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred';
        toast.error(errorMessage, { position: "top-right" }); // Error notification
        console.error("Error adding user:", errorMessage);
      } finally {
        setLoading(false); // Reset loading state
      }
    },
  });

  const imageHandler = (e) => {
    setImageFiles([...e.target.files]);
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
          Add New User
        </Typography>
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="User Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={imageHandler}
            style={{ marginTop: 8 }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2 }}>
            {/* Loader to the left of the Add User button */}
            {loading && (
              <Loader 
                style={{ width: '24px', height: '24px', marginRight: '8px' }} // Set size and margin for spacing
              />
            )}
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 1 }}>
              {loading ? "Adding..." : "Add User"}
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

export default AddUserModal;
