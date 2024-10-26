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
import { Hearts } from '@agney/react-loading';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UpdateBrandModal = ({ open, handleClose, slug }) => {
  const [brandImages, setBrandImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch brand data using the slug
  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:4000/api/brands/${slug}`)
        .then((response) => {
          const { name, company, website, description, image } = response.data.brand;
          formik.setValues({ name, company, website, description });
          setBrandImages(image || []);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [slug]);

  // Formik and Yup setup
  const formik = useFormik({
    initialValues: {
      name: '',
      company: '',
      website: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Brand name is required'),
      company: Yup.string().required('Company name is required'),
      website: Yup.string().url('Invalid URL format').required('Website is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("company", values.company);
      formData.append("website", values.website);
      formData.append("description", values.description);
      newImages.forEach((file) => {
        formData.append("image", file);
      });

      try {
        await axios.put(`http://localhost:4000/api/brands/${slug}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Brand updated successfully", { position: "top-right" });
        handleClose();
      } catch (error) {
        console.error("Error updating brand:", error);
        toast.error("Failed to update brand", { position: "top-right" });
      } finally {
        setLoading(false);
      }
    },
  });

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

          <div className="inputGroup">
            <label>Current Images:</label>
            {brandImages.length > 0 ? (
              <Carousel
                sx={{ width: '50%', maxWidth: '150px', margin: 'auto' }}
                autoPlay={false}
                navButtonsAlwaysVisible
                animation="slide"
                indicators={false}
              >
                {brandImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`brand-${index}`}
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
