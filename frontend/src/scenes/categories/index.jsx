import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IconButton, Button } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";

const Categories = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/categories/all");
        const categories = response.data.categories;

        // Map the categories into rows
        const rows = categories.map((category, index) => ({
          id: index + 1,
          _id: category._id,
          name: category.name,
          description: category.description,
          slug: category.slug,
          images: handleCategoryImages(category.image), // Process images
          actions: category.slug // For edit/delete actions
        }));

        setData(rows);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  // Function to handle rendering category images
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
      const response = await axios.delete("http://localhost:4000/api/categories/${categorySlug}");
      setData((prevData) => prevData.filter((row) => row.slug !== categorySlug));
      alert(response.data.message); // Show message to user
    } catch (error) {
      console.error(error);
    }
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => deleteCategory(slug)}>
        <Delete style={{ color: "red" }} />
      </IconButton>

      <IconButton href={`/category/update/${slug}`}>
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

  return (
    <div style={{ margin: "20px" }}>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Add Category button clicked")} // Add Category button action
        >
          Add Category
        </Button>
      </Box>
      <MUIDataTable
        title={"Category List"}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default Categories;