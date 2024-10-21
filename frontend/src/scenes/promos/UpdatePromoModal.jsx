import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import Carousel from "react-material-ui-carousel";
import { toast } from "react-hot-toast";
import { Hearts } from '@agney/react-loading'; 

const UpdatePromoModal = ({ open, handleClose, slug, onPromoUpdated }) => {
  const initialPromoState = {
    name: "",
    description: "",
    discount: "",
    startDate: "",
    endDate: "",
    image: [],
  };

  const [promo, setPromo] = useState(initialPromoState);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:4000/api/promos/${slug}`)
        .then((response) => {
          const fetchedPromo = response.data.promo;
          setPromo({
            ...fetchedPromo,
            startDate: new Date(fetchedPromo.startDate).toISOString().split('T')[0], 
            endDate: new Date(fetchedPromo.endDate).toISOString().split('T')[0],     
          });
        })
        .catch((error) => console.log(error));
    }
  }, [slug]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", promo.name);
    formData.append("description", promo.description);
    formData.append("discount", promo.discount);
    formData.append("startDate", promo.startDate);
    formData.append("endDate", promo.endDate);

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
          Update Promo
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
          <div className="inputGroup">
            <label>Current Images:</label>
            {promo.image && promo.image.length > 0 ? (
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
