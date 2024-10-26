import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import Loader from '../../components/Loader.jsx'; // Adjust the path if necessary

const AddPromoModal = ({ open, handleClose, onPromoAdded }) => {
  const [loading, setLoading] = useState(false);

  // Define validation schema with Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Promo name is required"),
    description: Yup.string().required("Description is required"),
    discount: Yup.number()
      .required("Discount is required")
      .min(1, "Discount must be at least 1%")
      .max(100, "Discount cannot exceed 100%"),
    startDate: Yup.date()
      .required("Start date is required")
      .typeError("Invalid date format"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date cannot be before start date")
      .typeError("Invalid date format"),
    images: Yup.mixed().required("At least one image is required"),
  });

  // Formik hook setup
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      discount: "",
      startDate: "",
      endDate: "",
      images: [],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("discount", values.discount);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);

      values.images.forEach((file) => {
        formData.append("image", file);
      });

      try {
        const response = await axios.post("http://localhost:4000/api/promos", formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const newPromo = response.data.promo;
        onPromoAdded(newPromo);
        toast.success(response.data.message, { position: "top-right" });
        handleClose();
        resetForm();
      } catch (error) {
        const errorMessage = error.response?.data?.error || "An error occurred";
        toast.error(errorMessage, { position: "top-right" });
        console.error("Error adding promo:", errorMessage);
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
          Add New Promo
        </Typography>
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            label="Promo Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Discount (%)"
            name="discount"
            type="number"
            value={formik.values.discount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.discount && Boolean(formik.errors.discount)}
            helperText={formik.touched.discount && formik.errors.discount}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Start Date"
            name="startDate"
            type="date"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Date"
            name="endDate"
            type="date"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => {
              const files = Array.from(event.target.files);
              formik.setFieldValue("images", files);
            }}
            onBlur={formik.handleBlur}
            required
            style={{ marginTop: 8 }}
          />
          {formik.touched.images && formik.errors.images && (
            <Typography variant="caption" color="error">
              {formik.errors.images}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2 }}>
            {loading && (
              <Loader 
                style={{ width: '24px', height: '24px', marginRight: '8px' }}
              />
            )}
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 1 }}>
              {loading ? "Adding..." : "Add Promo"}
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

export default AddPromoModal;
