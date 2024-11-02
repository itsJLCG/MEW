import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";
import AddCategoryModal from "./AddCategoryModal"; // Modal for adding category
import UpdateCategoryModal from "./UpdateCategoryModal"; // Modal for updating category
import { confirm } from "material-ui-confirm"; // Import the Confirm component

const Categories = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null); // Unique identifier (slug) for update
  const [dialogOpen, setDialogOpen] = useState(false); // State for the dialog
  const [dialogMessage, setDialogMessage] = useState(""); // Message to display in the dialog

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/categories/all");
        const categories = response.data.categories;

        const rows = categories.map((category, index) => ({
          id: index + 1,
          _id: category._id,
          name: category.name,
          description: category.description,
          slug: category.slug,
          images: handleCategoryImages(category.image),
          actions: category.slug,
        }));

        setData(rows);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleCategoryImages = (imageData) => {
    if (Array.isArray(imageData) && imageData.length) {
      return (
        <Box display="flex" gap={1}>
          {imageData.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Category Image ${index + 1}`}
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          ))}
        </Box>
      );
    } else if (typeof imageData === "string" && imageData.length > 0) {
      return (
        <img
          src={imageData}
          alt="Category"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      );
    }
    return <img src="/default-category.png" alt="Default Category" style={{ width: 50, height: 50 }} />;
  };

  const deleteCategory = async (categorySlug) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/categories/${categorySlug}`);
      setData((prevData) => prevData.filter((row) => row.slug !== categorySlug));
      setDialogMessage(response.data.message || "Category deleted successfully");
    } catch (error) {
      setDialogMessage(error.response?.data?.error || "Error deleting category");
    } finally {
      setDialogOpen(true); // Open dialog to show message
    }
  };

  const confirmDeleteCategory = (categorySlug) => {
    confirm({ description: "Are you sure you want to delete this category?" })
      .then(() => deleteCategory(categorySlug))
      .catch(() => console.log("Delete action canceled"));
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => confirmDeleteCategory(slug)}>
        <Delete style={{ color: "red" }} />
      </IconButton>

      <IconButton onClick={() => { 
        setSelectedSlug(slug); // Set selected category slug
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
      label: "Category ID",
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
        customBodyRender: (value) => value, // Render images
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
    selectableRows: "none",
    responsive: "standard",
    download: true,
    print: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20],
    jumpToPage: true,
  };

  const handleCategoryAdded = (newCategory) => {
    setData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        ...newCategory,
      },
    ]);
  };

  return (
    <div style={{ margin: "20px" }}>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          Add Category
        </Button>
      </Box>
      <MUIDataTable title={"Category List"} data={data} columns={columns} options={options} />
      <AddCategoryModal open={modalOpen} handleClose={() => setModalOpen(false)} onCategoryAdded={handleCategoryAdded} />
      <UpdateCategoryModal open={updateModalOpen} handleClose={() => setUpdateModalOpen(false)} slug={selectedSlug} />

      {/* Dialog for showing delete confirmation messages */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Category Deletion</DialogTitle>
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

export default Categories;
