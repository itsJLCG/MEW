import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IconButton, Button } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";

const Contacts = () => {
  const [data, setData] = useState([]);

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
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => deleteBrand(slug)}>
        <Delete style={{ color: "red" }} />
      </IconButton>

      <IconButton href={`/brand/update/${slug}`}>
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

  return (
    <div style={{ margin: "20px" }}>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Add Brand button clicked")} // Add Brand button action
        >
          Add Brand
        </Button>
      </Box>
      <MUIDataTable
        title={"Brands"}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default Contacts;
