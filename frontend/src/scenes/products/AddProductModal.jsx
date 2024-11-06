import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "../../components/Loader.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddProductModal = ({ open, handleClose, onProductAdded }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const categoryResponse = await axios.get("http://localhost:4000/api/categories/all");
        const brandResponse = await axios.get("http://localhost:4000/api/brands/all");
        setCategories(categoryResponse.data.categories || []);
        setBrands(brandResponse.data.brands || []);
      } catch (error) {
        console.error("Error fetching categories and brands:", error);
      }
    };
    fetchCategoriesAndBrands();
  }, []);

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required").positive("Price must be positive").typeError("Price must be a number"),
    stock: Yup.number().required("Stock is required").min(1, "Stock must be at least 1").typeError("Stock must be an integer"),
    category: Yup.string().required("Please select a category"),
    brand: Yup.string().required("Please select a brand"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    imageFiles.forEach((file) => formData.append("image", file));

    try {
      const response = await axios.post("http://localhost:4000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onProductAdded(response.data.product);
      toast.success(response.data.message, { position: "top-right" });
      handleClose();
      resetForm();
      setImageFiles([]);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      toast.error(errorMessage, { position: "top-right" });
      console.error("Error adding product:", errorMessage);
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
          Add New Product
        </Typography>
        <Formik
          initialValues={{
            name: "",
            description: "",
            price: "",
            stock: "",
            category: "",
            brand: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form style={{ width: "100%" }}>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Product Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                helperText={<ErrorMessage name="name" />}
                error={!!ErrorMessage.name}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                helperText={<ErrorMessage name="description" />}
                error={!!ErrorMessage.description}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Price"
                name="price"
                value={values.price}
                onChange={handleChange}
                helperText={<ErrorMessage name="price" />}
                error={!!ErrorMessage.price}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Stock"
                name="stock"
                value={values.stock}
                onChange={handleChange}
                helperText={<ErrorMessage name="stock" />}
                error={!!ErrorMessage.stock}
              />
              <Field
                as={TextField}
                select
                fullWidth
                margin="normal"
                label="Category"
                name="category"
                value={values.category}
                onChange={handleChange}
                helperText={<ErrorMessage name="category" />}
                error={!!ErrorMessage.category}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Field>
              <Field
                as={TextField}
                select
                fullWidth
                margin="normal"
                label="Brand"
                name="brand"
                value={values.brand}
                onChange={handleChange}
                helperText={<ErrorMessage name="brand" />}
                error={!!ErrorMessage.brand}
              >
                {brands.map((br) => (
                  <MenuItem key={br._id} value={br._id}>
                    {br.name}
                  </MenuItem>
                ))}
              </Field>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange} // Use the existing handler
                required
                style={{ marginTop: 8 }}
              />

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", mt: 2 }}>
                {loading && (
                  <Loader style={{ width: "24px", height: "24px", marginRight: "8px" }} />
                )}
                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 1 }}>
                  {loading ? "Adding..." : "Add Product"}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClose}
                  sx={{ backgroundColor: "#4ccdac", color: "white", "&:hover": { backgroundColor: "#3cb8a9" }, ml: 1 }}
                >
                  Back
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
