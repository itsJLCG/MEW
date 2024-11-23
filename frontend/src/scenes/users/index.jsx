import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, Button } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Box } from "@mui/system";
import { confirm } from "material-ui-confirm";

const Users = () => {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users/all");
        const users = response.data.users.map((user, index) => ({
          id: index + 1,
          _id: user._id,
          email: user.email,
          role: user.role,
          status: user.status,
          verified: user.verified ? "Yes" : "No",
          firebaseUid: user.firebaseUid, // Add firebaseUid
          actions: user._id
        }));
        setData(users);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/users/${userId}`);
      setData((prevData) => prevData.filter((row) => row._id !== userId));
      setDialogMessage(response.data.message || "User deleted successfully");
    } catch (error) {
      setDialogMessage(error.response?.data?.error || "Error deleting user");
    } finally {
      setDialogOpen(true);
    }
  };

  const confirmDeleteUser = (userId) => {
    confirm({ description: "Are you sure you want to delete this user?" })
      .then(() => deleteUser(userId))
      .catch(() => console.log("Delete action canceled"));
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      console.log(`Updating role for user ${userId} to ${newRole}`);
      const response = await axios.put(`http://localhost:4000/api/users/role/${userId}`, { role: newRole });
      setData((prevData) =>
        prevData.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      setDialogMessage(response.data.message || "User role updated successfully");
    } catch (error) {
      console.error("Error updating user role", error);
      setDialogMessage(error.response?.data?.error || "Error updating user role");
    } finally {
      setDialogOpen(true);
    }
  };

  const renderRoleDropdown = (userId, currentRole) => (
    <Select
      value={currentRole}
      onChange={(e) => handleRoleChange(userId, e.target.value)}
    >
      <MenuItem value="admin">Admin</MenuItem>
      <MenuItem value="customer">Customer</MenuItem>
    </Select>
  );

  const renderActions = (id) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => confirmDeleteUser(id)}>
        <Delete style={{ color: "red" }} />
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
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "role",
      label: "Role",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta) => renderRoleDropdown(tableMeta.rowData[1], value),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "verified",
      label: "Verified",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "firebaseUid",
      label: "Firebase UID",
      options: {
        filter: false,
        sort: true,
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

  return (
    <div style={{ margin: "20px" }}>
      <MUIDataTable title={"User List"} data={data} columns={columns} options={options} />

      {/* Dialog for showing delete confirmation messages */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>User Update</DialogTitle>
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