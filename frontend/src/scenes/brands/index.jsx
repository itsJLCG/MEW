// src/scenes/brand/index.jsx
import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";
import AddBrandModal from "./AddBrandModal"; // Import your new modal component
import UpdateBrandModal from "./UpdateBrandModal";
import { confirm } from "material-ui-confirm"; // Import the Confirm component



const Brands = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null); // State to hold the slug of the brand to update
  const [dialogOpen, setDialogOpen] = useState(false); // State for the dialog
  const [dialogMessage, setDialogMessage] = useState(""); // Message to display in the dialog

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/brands/all");
        const brands = response.data.brands;

        // Map the brands into rows
        const rows = brands.map((brand, index) => ({
          id: index + 1,
          _id: brand._id,
          name: brand.name,
          company: brand.company,
          website: brand.website,
          description: brand.description,
          slug: brand.slug,
          images: handleBrandImages(brand.image), // Process images
          actions: brand.slug // Return slug for actions
        }));

        setData(rows);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle rendering brand images
  const handleBrandImages = (imageData) => {
    if (Array.isArray(imageData) && imageData.length) {
      return (
        <Box display="flex" gap={1}>
          {imageData.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Brand Image ${index + 1}`}
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          ))}
        </Box>
      );
    } else if (typeof imageData === "string" && imageData.length > 0) {
      return (
        <img
          src={imageData}
          alt="Brand"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      );
    }
    return <img src="/default-brand.png" alt="Default Brand" style={{ width: 50, height: 50 }} />;
  };

  const deleteBrand = async (brandSlug) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/brands/${brandSlug}`);
      setData((prevData) => prevData.filter((row) => row.slug !== brandSlug));
      setDialogMessage(response.data.message || "Brand deleted successfully");
    } catch (error) {
      setDialogMessage(error.response?.data?.error || "Error deleting brand");
    } finally {
      setDialogOpen(true); // Open dialog to show message
    }
  };

  const confirmDeleteBrand = (brandSlug) => {
    confirm({ description: "Are you sure you want to delete this brand?" })
      .then(() => deleteBrand(brandSlug))
      .catch(() => console.log("Delete action canceled"));
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => confirmDeleteBrand(slug)}>
        <Delete style={{ color: "red" }} />
      </IconButton>
      <IconButton onClick={() => { 
        setSelectedSlug(slug); // Set selected slug
        setUpdateModalOpen(true); // Open update modal
      }}>
        <Edit style={{ color: "blue" }} />
      </IconButton>
    </Box>
  );

  const columns = [
    {
      name: "id",
      label: "S.No.",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "_id",
      label: "Brand ID",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "company",
      label: "Company",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "website",
      label: "Website",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "description",
      label: "Description",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "slug",
      label: "Slug",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "images",
      label: "Images",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => value, // This will render the images
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => renderActions(value),
      },
    },
  ];

  const options = {
    filterType: "checkbox",
    selectableRows: "none", // To remove checkbox column
    responsive: "standard",
    download: true,
    print: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20],
    jumpToPage: true,
  };

  // Callback function to add new brand data
  const handleBrandAdded = (newBrand) => {
    setData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1, // Update the ID accordingly
        ...newBrand,
      },
    ]);
  };

  return (
    <div style={{ margin: "20px" }}>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          Add Brand
        </Button>
      </Box>
      <MUIDataTable title={"Brand List"} data={data} columns={columns} options={options} />
      <AddBrandModal open={modalOpen} handleClose={() => setModalOpen(false)} onBrandAdded={handleBrandAdded} />
      <UpdateBrandModal open={updateModalOpen} handleClose={() => setUpdateModalOpen(false)} slug={selectedSlug} />

      {/* Dialog for showing delete confirmation messages */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Brand Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Brands;
