import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IconButton, Button } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";

const Team = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users/all");
        const users = response.data.users;

        // Map the users into rows
        const rows = users.map((user, index) => ({
          id: index + 1,
          _id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          slug: user.slug,
          images: handleUserImages(user.image), // Process images
          actions: user.slug // Return slug for actions
        }));

        setData(rows);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  // Function to handle rendering user images
  const handleUserImages = (imageData) => {
    if (Array.isArray(imageData) && imageData.length) {
      return (
        <Box display="flex" gap={1}>
          {imageData.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`User Image ${index + 1}`}
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          ))}
        </Box>
      );
    } else if (typeof imageData === "string" && imageData.length > 0) {
      return (
        <img
          src={imageData}
          alt="User"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      );
    }
    return <img src="/default-user.png" alt="Default User" style={{ width: 50, height: 50 }} />;
  };

  const deleteUser = async (userSlug) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/users/${userSlug}`);
      setData((prevData) => prevData.filter((row) => row.slug !== userSlug));
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => deleteUser(slug)}>
        <Delete style={{ color: "red" }} />
      </IconButton>

      <IconButton href={`/user/update/${slug}`}>
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
      label: "User ID",
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
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "address",
      label: "Address",
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
          onClick={() => console.log("Add User button clicked")} // Add User button action
        >
          Add User
        </Button>
      </Box>
      <MUIDataTable
        title={"Team Members"}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default Team;
