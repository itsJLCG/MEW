import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IconButton, Button } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";
import AddProductModal from "./AddProductModal"; // Import your new modal component
import UpdateProductModal from "./UpdateProductModal";

const Products = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null); // State to hold the slug of the product to update

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products/all");
        const products = response.data.products;

        // Map the products into rows
        const rows = products.map((product, index) => ({
          id: index + 1,
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          slug: product.slug,
          images: handleProductImages(product.image), // Process images
          actions: product.slug // For edit/delete actions
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
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => deleteProduct(slug)}>
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

  // Callback function to add new product data
  const handleProductAdded = (newProduct) => {
    setData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1, // Update the ID accordingly
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
    </div>
  );
};

export default Products;
