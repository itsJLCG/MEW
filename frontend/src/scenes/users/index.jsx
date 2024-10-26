import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";
import AddUserModal from "./AddUserModal"; // Import your new modal component
import UpdateUserModal from "./UpdateUserModal";
import { confirm } from "material-ui-confirm"; // Import the Confirm component

const Users = () => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null); // State to hold the slug of the user to update
  const [dialogOpen, setDialogOpen] = useState(false); // State for the dialog
  const [dialogMessage, setDialogMessage] = useState(""); // Message to display in the dialog

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users/all");
        const users = response.data.users.map((user, index) => ({
          id: index + 1,
          _id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          slug: user.slug,
          images: handleUserImages(user.image), // Process images
          actions: user.slug // Return slug for actions
        }));
        setData(users);
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
      setDialogMessage(response.data.message || "User deleted successfully");
    } catch (error) {
      setDialogMessage(error.response?.data?.error || "Error deleting user");
    } finally {
      setDialogOpen(true); // Open dialog to show message
    }
  };

  const confirmDeleteUser = (userSlug) => {
    confirm({ description: "Are you sure you want to delete this user?" })
      .then(() => deleteUser(userSlug))
      .catch(() => console.log("Delete action canceled"));
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => confirmDeleteUser(slug)}>
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

  // Callback function to add new user data
  const handleUserAdded = (newUser) => {
    setData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1, // Update the ID accordingly
        ...newUser,
      },
    ]);
  };

  return (
    <div style={{ margin: "20px" }}>
      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          Add User
        </Button>
      </Box>
      <MUIDataTable title={"User List"} data={data} columns={columns} options={options} />
      <AddUserModal open={modalOpen} handleClose={() => setModalOpen(false)} onUserAdded={handleUserAdded} />
      <UpdateUserModal open={updateModalOpen} handleClose={() => setUpdateModalOpen(false)} slug={selectedSlug} />

      {/* Dialog for showing delete confirmation messages */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>User Deletion</DialogTitle>
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

export default Users;
