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
import { useFormik } from "formik";
import * as Yup from "yup";

const UpdateCategoryModal = ({ open, handleClose, slug }) => {
  const [category, setCategory] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch category data using the ID
  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:4000/api/categories/${slug}`)
        .then((response) => {
          setCategory(response.data.category);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [slug]);

  // Initialize Formik only when category data is loaded
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);

      // Append new images
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
        handleClose();
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error("Failed to update category", { position: "top-right" });
      } finally {
        setLoading(false);
      }
    },
  });

  const imageHandler = (e) => {
    setNewImages([...e.target.files]);
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

          <div className="inputGroup">
            <label>Current Images:</label>
            {category?.image && category.image.length > 0 ? (
              <Carousel
                sx={{ width: "50%", maxWidth: "150px", margin: "auto" }}
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
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
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
              onChange={imageHandler}
              multiple
              accept="image/*"
              style={{ marginTop: 8 }}
            />
          </div>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mr: 2 }}
            >
              {loading ? "Updating..." : "Update Category"}
            </Button>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                backgroundColor: "#4ccdac",
                color: "white",
                "&:hover": { backgroundColor: "#3cb8a9" },
              }}
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
