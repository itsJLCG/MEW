import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import Carousel from "react-material-ui-carousel";
import { toast } from "react-hot-toast";
import { Hearts } from '@agney/react-loading'; 
import { useFormik } from "formik";
import * as Yup from "yup";

const UpdatePromoModal = ({ open, handleClose, slug, onPromoUpdated }) => {
  const [promo, setPromo] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:4000/api/promos/${slug}`)
        .then((response) => {
          const fetchedPromo = response.data.promo;
          setPromo({
            name: fetchedPromo.name,
            description: fetchedPromo.description,
            discount: fetchedPromo.discount,
            startDate: new Date(fetchedPromo.startDate).toISOString().split('T')[0],
            endDate: new Date(fetchedPromo.endDate).toISOString().split('T')[0],
            image: fetchedPromo.image,
          });
        })
        .catch((error) => console.log(error));
    }
  }, [slug]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: promo || {
      name: "",
      description: "",
      discount: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Promo name is required"),
      description: Yup.string().required("Description is required"),
      discount: Yup.number()
        .min(0, "Discount must be a positive number")
        .max(100, "Discount cannot exceed 100")
        .required("Discount is required"),
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), "End date cannot be before start date")
        .required("End date is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("discount", values.discount);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);

      newImages.forEach((file) => {
        formData.append("image", file);
      });

      try {
        await axios.put(`http://localhost:4000/api/promos/${slug}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Promo updated successfully", { position: "top-right" });
        onPromoUpdated(); // Callback to update table data
        handleClose();
      } catch (error) {
        console.error("Error updating promo:", error);
        toast.error("Failed to update promo", { position: "top-right" });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "background.paper",
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
        <Typography variant="h6" gutterBottom>
          Update Promo
        </Typography>
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
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
            label="Discount"
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
            InputLabelProps={{ shrink: true }}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
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
            InputLabelProps={{ shrink: true }}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
          />
          <div className="inputGroup">
            <label>Current Images:</label>
            {promo?.image && promo.image.length > 0 ? (
              <Carousel
                sx={{ width: '50%', maxWidth: '150px', margin: 'auto' }}
                autoPlay={false}
                navButtonsAlwaysVisible={true}
                animation="slide"
                indicators={false}
              >
                {promo.image.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`promo-${index}`}
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
              {loading ? "Updating..." : "Update Promo"}
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

export default UpdatePromoModal;
