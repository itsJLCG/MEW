import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { IconButton, Button } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";

const Products = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products/all");
        const products = response.data.products;

        // Map products into rows
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
        console.log("Error while fetching data", error);
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
      const response = await axios.delete("http://localhost:4000/api/products/${productSlug}");
      setData((prevData) => prevData.filter((row) => row.slug !== productSlug));
      alert(response.data.message); // Show message to user
    } catch (error) {
      console.log(error);
    }
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => deleteProduct(slug)}>
        <Delete style={{ color: "red" }} />
      </IconButton>

      <IconButton href={`/product/update/${slug}`}>
        <Edit style={{ color: "blue" }} />
      </IconButton>
    </Box>
  );

  const columns = [
    { name: 'id', label: 'S.No.', options: { filter: false, sort: true }},
    { name: '_id', label: 'Product _id', options: { filter: false, sort: true }},
    { name: 'name', label: 'Name', options: { filter: true, sort: true }},
    { name: 'description', label: 'Description', options: { filter: true, sort: true }},
    { name: 'price', label: 'Price', options: { filter: true, sort: true }},
    { name: 'stock', label: 'Stock', options: { filter: true, sort: true }},
    { name: 'slug', label: 'Slug', options: { filter: true, sort: true }},
    { name: 'images', label: 'Images', options: { filter: false, sort: false, customBodyRender: (value) => value }},
    { name: 'actions', label: 'Actions', options: { filter: false, sort: false, customBodyRender: (value) => renderActions(value) }}
  ];

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    responsive: "standard",
    download: true,
    print: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20],
    jumpToPage: true
  };

  return (
    <div className="productPage" style={{ padding: '20px' }}>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={() => console.log("Add Product button clicked")}>
          Add Product
        </Button>
      </Box>
      <MUIDataTable title={"Product List"} data={data} columns={columns} options={options} />
    </div>
  );
};

export default Products;