import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";
import AddProductModal from "./AddProductModal";
import UpdateProductModal from "./UpdateProductModal";
import { confirm } from "material-ui-confirm"; // Import the Confirm component

const Products = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // State for the dialog
  const [dialogMessage, setDialogMessage] = useState(""); // Message to display in the dialog

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
          axios.get("http://localhost:4000/api/products/all"),
          axios.get("http://localhost:4000/api/categories/all"),
          axios.get("http://localhost:4000/api/brands/all"),
        ]);

        const products = productsResponse.data.products;
        const categories = categoriesResponse.data.categories; 
        const brands = brandsResponse.data.brands; 

        // Create a mapping for categories and brands by ID
        const categoryMap = Object.fromEntries(categories.map((category) => [category._id, category.name]));
        const brandMap = Object.fromEntries(brands.map((brand) => [brand._id, brand.name]));

        // Map the products into rows, including category and brand names
        const rows = products.map((product, index) => ({
          id: index + 1,
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          slug: product.slug,
          categoryName: categoryMap[product.category] || 'Unknown',
          brandName: brandMap[product.brand] || 'Unknown',
          images: handleProductImages(product.image),
          actions: product.slug,
        }));

        setData(rows);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle rendering product images
  const handleProductImages = (imageData) => {
    if (Array.isArray(imageData) && imageData.length) {
      return (
        <Box display="flex" gap={1}>
          {imageData.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product Image ${index + 1}`}
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          ))}
        </Box>
      );
    } else if (typeof imageData === "string" && imageData.length > 0) {
      return (
        <img
          src={imageData}
          alt="Product"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      );
    }
    return <img src="/default-product.png" alt="Default Product" style={{ width: 50, height: 50 }} />;
  };

  const deleteProduct = async (productSlug) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/products/${productSlug}`);
      setData((prevData) => prevData.filter((row) => row.slug !== productSlug));
      setDialogMessage(response.data.message || "Product deleted successfully");
    } catch (error) {
      setDialogMessage(error.response?.data?.error || "Error deleting product");
    } finally {
      setDialogOpen(true); // Open dialog to show message
    }
  };

  const confirmDeleteProduct = (productSlug) => {
    confirm({ description: "Are you sure you want to delete this product?" })
      .then(() => deleteProduct(productSlug))
      .catch(() => console.log("Delete action canceled"));
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => confirmDeleteProduct(slug)}>
        <Delete style={{ color: "red" }} />
      </IconButton>

      <IconButton onClick={() => { 
        setSelectedSlug(slug);
        setUpdateModalOpen(true);
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
      label: "Product ID",
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
      name: "price",
      label: "Price",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "stock",
      label: "Stock",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "categoryName",
      label: "Category Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "brandName",
      label: "Brand Name",
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
        customBodyRender: (value) => value, 
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

  const handleProductAdded = (newProduct) => {
    setData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        ...newProduct,
      },
    ]);
  };

  return (
    <div style={{ margin: "20px" }}>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          Add Product
        </Button>
      </Box>
      <MUIDataTable title={"Product List"} data={data} columns={columns} options={options} />
      <AddProductModal open={modalOpen} handleClose={() => setModalOpen(false)} onProductAdded={handleProductAdded} />
      <UpdateProductModal open={updateModalOpen} handleClose={() => setUpdateModalOpen(false)} slug={selectedSlug} />

      {/* Dialog for showing delete confirmation messages */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Product Deletion</DialogTitle>
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

export default Products;
