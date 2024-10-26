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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UpdateUserModal = ({ open, handleClose, slug }) => {
  const initialUserState = {
    name: "",
    email: "",
    address: "",
    image: [],
  };

  const [user, setUser] = useState(initialUserState);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user data using the slug
  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:4000/api/users/${slug}`)
        .then((response) => {
          setUser(response.data.user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [slug]);

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('User name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    address: Yup.string()
      .required('Address is required'),
  });

  // Handle form submission
  const submitForm = async (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("address", values.address);

    newImages.forEach((file) => {
      formData.append("image", file);
    });

    try {
      await axios.put(`http://localhost:4000/api/users/${slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("User updated successfully", { position: "top-right" });
      handleClose(); // Close the modal after updating
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user", { position: "top-right" });
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
          Update User
        </Typography>
        
        <Formik
          initialValues={user}
          validationSchema={validationSchema}
          onSubmit={submitForm}
          enableReinitialize
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <Field name="name">
                {({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="normal"
                    label="User Name"
                    error={!!(field.touched && field.error)}
                    helperText={<ErrorMessage name="name" />}
                  />
                )}
              </Field>

              <Field name="email">
                {({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="normal"
                    label="Email"
                    error={!!(field.touched && field.error)}
                    helperText={<ErrorMessage name="email" />}
                  />
                )}
              </Field>

              <Field name="address">
                {({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="normal"
                    label="Address"
                    error={!!(field.touched && field.error)}
                    helperText={<ErrorMessage name="address" />}
                  />
                )}
              </Field>

              <div className="inputGroup">
                <label>Current Images:</label>
                {user.image && user.image.length > 0 ? (
                  <Carousel 
                    sx={{ width: '50%', maxWidth: '150px', margin: 'auto' }} 
                    autoPlay={false}
                    navButtonsAlwaysVisible={true}
                    animation="slide"
                    indicators={false}
                  >
                    {user.image.map((image, index) => (
                      <img
                        key={index}
                        src={image} 
                        alt={`user-${index}`}
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
                  onChange={(e) => {
                    setNewImages([...e.target.files]);
                    setFieldValue("images", e.target.files);
                  }}
                  multiple 
                  accept="image/*"
                  style={{ marginTop: 8 }}
                />
              </div>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || loading} sx={{ mr: 2 }}>
                  {loading ? "Updating..." : "Update User"}
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

export default UpdateUserModal;
