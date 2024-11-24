import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Hearts } from '@agney/react-loading';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const UpdateProductModal = ({ open, handleClose, slug, onProductUpdated }) => {
  const initialProductState = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "", // To store category ID
    brand: "", // To store brand ID
  };

  const [product, setProduct] = useState(initialProductState);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch product data using the slug
  useEffect(() => {
    const fetchProductData = async () => {
      if (slug) {
        try {
          const response = await axios.get(`http://localhost:4000/api/products/${slug}`);
          setProduct(response.data.product); // Ensure the product data includes category and brand IDs
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch product data", { position: "top-right" });
        }
      }
    };

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

    fetchProductData();
    fetchCategoriesAndBrands();
  }, [slug]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required")
      .positive("Price must be positive"),
    stock: Yup.number()
      .typeError("Stock must be an integer")
      .required("Stock is required")
      .min(1, "Stock must be at least 1"),
    category: Yup.string().required("Please select a category"),
    brand: Yup.string().required("Please select a brand"),
  });

  const submitForm = async (values, { resetForm }) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("category", values.category);
    formData.append("brand", values.brand);

    newImages.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const response = await axios.put(`http://localhost:4000/api/products/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onProductUpdated(response.data.product); 
      toast.success("Product updated successfully", { position: "top-right" });
      handleClose();
      resetForm();
      window.location.reload(); // Reload the page after a successful update
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product", { position: "top-right" });
    } finally {
      setLoading(false);
    }
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
          Update Product
        </Typography>
        
        <Formik
          initialValues={product}
          validationSchema={validationSchema}
          onSubmit={submitForm}
          enableReinitialize
        >
          {({ values, handleChange, errors, touched }) => (
            <Form style={{ width: '100%' }}>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Product Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name ? <span style={{ color: 'red', fontSize: '14px' }}>{errors.name}</span> : null}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: touched.name && errors.name ? 'red' : 'default',
                    },
                    '&:hover fieldset': {
                      borderColor: touched.name && errors.name ? 'red' : 'default',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: touched.name && errors.name ? 'red' : 'default',
                    },
                  },
                }}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                error={touched.description && !!errors.description}
                helperText={touched.description && errors.description ? <span style={{ color: 'red', fontSize: '14px' }}>{errors.description}</span> : null}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: touched.description && errors.description ? 'red' : 'default',
                    },
                    '&:hover fieldset': {
                      borderColor: touched.description && errors.description ? 'red' : 'default',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: touched.description && errors.description ? 'red' : 'default',
                    },
                  },
                }}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Price"
                name="price"
                value={values.price}
                onChange={handleChange}
                error={touched.price && !!errors.price}
                helperText={touched.price && errors.price ? <span style={{ color: 'red', fontSize: '14px' }}>{errors.price}</span> : null}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: touched.price && errors.price ? 'red' : 'default',
                    },
                    '&:hover fieldset': {
                      borderColor: touched.price && errors.price ? 'red' : 'default',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: touched.price && errors.price ? 'red' : 'default',
                    },
                  },
                }}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                label="Stock"
                name="stock"
                value={values.stock}
                onChange={handleChange}
                error={touched.stock && !!errors.stock}
                helperText={touched.stock && errors.stock ? <span style={{ color: 'red', fontSize: '14px' }}>{errors.stock}</span> : null}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: touched.stock && errors.stock ? 'red' : 'default',
                    },
                    '&:hover fieldset': {
                      borderColor: touched.stock && errors.stock ? 'red' : 'default',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: touched.stock && errors.stock ? 'red' : 'default',
                    },
                  },
                }}
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
                error={touched.category && !!errors.category}
                helperText={touched.category && errors.category ? <span style={{ color: 'red', fontSize: '14px' }}>{errors.category}</span> : null}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: touched.category && errors.category ? 'red' : 'default',
                    },
                    '&:hover fieldset': {
                      borderColor: touched.category && errors.category ? 'red' : 'default',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: touched.category && errors.category ? 'red' : 'default',
                    },
                  },
                }}
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
                error={touched.brand && !!errors.brand}
                helperText={touched.brand && errors.brand ? <span style={{ color: 'red', fontSize: '14px' }}>{errors.brand}</span> : null}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: touched.brand && errors.brand ? 'red' : 'default',
                    },
                    '&:hover fieldset': {
                      borderColor: touched.brand && errors.brand ? 'red' : 'default',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: touched.brand && errors.brand ? 'red' : 'default',
                    },
                  },
                }}
              >
                {brands.map((br) => (
                  <MenuItem key={br._id} value={br._id}>
                    {br.name}
                  </MenuItem>
                ))}
              </Field>

              <div className="inputGroup">
                <label>Current Images:</label>
                {product.image && product.image.length > 0 ? (
                  <Carousel 
                    sx={{ width: '50%', maxWidth: '150px', margin: 'auto' }} 
                    autoPlay={false}
                    navButtonsAlwaysVisible={true}
                    animation="slide"
                    indicators={false}
                  >
                    {product.image.map((image, index) => (
                      <img
                        key={index}
                        src={image} 
                        alt={`product-${index}`}
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
                  {loading ? "Updating..." : "Update Product"}
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
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default UpdateProductModal;