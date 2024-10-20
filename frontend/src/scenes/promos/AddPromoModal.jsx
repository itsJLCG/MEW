import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Hearts } from '@agney/react-loading'; 

const AddPromoModal = ({ open, handleClose, onPromoAdded }) => {
  const initialPromoState = {
    name: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    image: [],
  };

  const [promo, setPromo] = useState(initialPromoState);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", promo.name);
    formData.append("description", promo.description);
    formData.append("discount", promo.discount);
    formData.append("startDate", promo.startDate);
    formData.append("endDate", promo.endDate);

    images.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const response = await axios.post("http://localhost:4000/api/promos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Promo added successfully", { position: "top-right" });
      onPromoAdded(response.data.promo); // Trigger callback to update the table
      handleClose();
    } catch (error) {
      console.error("Error adding promo:", error);
      toast.error("Failed to add promo", { position: "top-right" });
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
          Add Promo
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            fullWidth
            margin="normal"
            label="Promo Name"
            value={promo.name}
            onChange={(e) => setPromo({ ...promo, name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={promo.description}
            onChange={(e) => setPromo({ ...promo, description: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Discount"
            value={promo.discount}
            onChange={(e) => setPromo({ ...promo, discount: e.target.value })}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Start Date"
            type="date"
            value={promo.startDate}
            onChange={(e) => setPromo({ ...promo, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Date"
            type="date"
            value={promo.endDate}
            onChange={(e) => setPromo({ ...promo, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
            style={{ margin: "10px 0" }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ mr: 2 }}>
              {loading ? "Adding..." : "Add Promo"}
            </Button>

            <Button 
              variant="contained" // Change to contained for solid color
              onClick={handleClose} 
              sx={{ backgroundColor: '#4ccdac', color: 'white', '&:hover': { backgroundColor: '#3cb8a9' } }} // Customize color
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

export default AddPromoModal;
