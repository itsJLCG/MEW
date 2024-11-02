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

const AddBrandModal = ({ open, handleClose, onBrandAdded }) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Validation schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Brand Name is required"),
    company: Yup.string().required("Company is required"),
    website: Yup.string().url("Enter a valid URL").required("Website is required"),
    description: Yup.string().required("Description is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      company: "",
      website: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('company', values.company);
      formData.append('website', values.website);
      formData.append('description', values.description);

      imageFiles.forEach((file) => {
        formData.append('image', file);
      });

      try {
        const response = await axios.post("http://localhost:4000/api/brands", formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newBrand = {
          ...response.data.brand,
          images: response.data.brand.images || [],
        };

        onBrandAdded(newBrand);
        toast.success(response.data.message, { position: "top-right" });
        handleClose();
        formik.resetForm();
        setImageFiles([]);
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred';
        toast.error(errorMessage, { position: "top-right" });
        console.error("Error adding brand:", errorMessage);
      } finally {
        setLoading(false);
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
          Add New Brand
        </Typography>
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Brand Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Company"
            name="company"
            value={formik.values.company}
            onChange={formik.handleChange}
            error={formik.touched.company && Boolean(formik.errors.company)}
            helperText={formik.touched.company && formik.errors.company}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Website"
            name="website"
            value={formik.values.website}
            onChange={formik.handleChange}
            error={formik.touched.website && Boolean(formik.errors.website)}
            helperText={formik.touched.website && formik.errors.website}
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
              {loading ? "Adding..." : "Add Brand"}
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

export default AddBrandModal;
