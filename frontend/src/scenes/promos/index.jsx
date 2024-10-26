import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import AddPromoModal from "./AddPromoModal";
import UpdatePromoModal from "./UpdatePromoModal";
import { confirm } from "material-ui-confirm"; // Import the Confirm component

const Promos = () => {
  const [data, setData] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false); // State for the dialog
  const [dialogMessage, setDialogMessage] = useState(""); // Message to display in the dialog

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/promos/all");
        const promos = response.data.promos;

        const rows = promos.map((promo, index) => ({
          id: index + 1,
          _id: promo._id,
          name: promo.name,
          description: promo.description,
          discount: promo.discount,
          startDate: new Date(promo.startDate).toLocaleDateString(),
          endDate: new Date(promo.endDate).toLocaleDateString(),
          slug: promo.slug,
          images: handlePromoImages(promo.image),
          actions: promo.slug
        }));

        setData(rows);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handlePromoImages = (imageData) => {
    if (Array.isArray(imageData) && imageData.length) {
      return (
        <Box display="flex" gap={1}>
          {imageData.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Promo Image ${index + 1}`}
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          ))}
        </Box>
      );
    } else if (typeof imageData === "string" && imageData.length > 0) {
      return (
        <img
          src={imageData}
          alt="Promo"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      );
    }
    return <img src="/default-promo.png" alt="Default Promo" style={{ width: 50, height: 50 }} />;
  };

  const deletePromo = async (promoSlug) => {
    try {
      await axios.delete(`http://localhost:4000/api/promos/${promoSlug}`);
      setData((prevData) => prevData.filter((row) => row.slug !== promoSlug));
      setDialogMessage("Promo deleted successfully");
    } catch (error) {
      setDialogMessage(error.response?.data?.error || "Error deleting promo");
    } finally {
      setDialogOpen(true); // Open dialog to show message
    }
  };

  const confirmDeletePromo = (promoSlug) => {
    confirm({ description: "Are you sure you want to delete this promo?" })
      .then(() => deletePromo(promoSlug))
      .catch(() => console.log("Delete action canceled"));
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => confirmDeletePromo(slug)}>
        <Delete style={{ color: "red" }} />
      </IconButton>
      <IconButton onClick={() => handleOpenUpdateModal(slug)}>
        <Edit style={{ color: "blue" }} />
      </IconButton>
    </Box>
  );

  const handleOpenUpdateModal = (slug) => {
    setSelectedSlug(slug);
    setOpenUpdateModal(true);
  };

  const handlePromoAdded = (newPromo) => {
    setData((prevData) => [...prevData, newPromo]);
  };

  const handlePromoUpdated = () => {
    axios.get("http://localhost:4000/api/promos/all").then((response) => {
      const promos = response.data.promos;
      const rows = promos.map((promo, index) => ({
        id: index + 1,
        _id: promo._id,
        name: promo.name,
        description: promo.description,
        discount: promo.discount,
        startDate: new Date(promo.startDate).toLocaleDateString(),
        endDate: new Date(promo.endDate).toLocaleDateString(),
        slug: promo.slug,
        images: handlePromoImages(promo.image),
        actions: promo.slug
      }));
      setData(rows);
    });
  };

  const columns = [
    { name: "id", label: "S.No.", options: { filter: false, sort: true } },
    { name: "_id", label: "Promo _id", options: { filter: false, sort: true } },
    { name: "name", label: "Name", options: { filter: true, sort: true } },
    { name: "description", label: "Description", options: { filter: true, sort: true } },
    { name: "discount", label: "Discount", options: { filter: true, sort: true } },
    { name: "startDate", label: "Start Date", options: { filter: true, sort: true } },
    { name: "endDate", label: "End Date", options: { filter: true, sort: true } },
    { name: "slug", label: "Slug", options: { filter: true, sort: true } },
    { name: "images", label: "Images", options: { filter: false, sort: false } },
    { name: "actions", label: "Actions", options: { filter: false, sort: false, customBodyRender: (value) => renderActions(value) } },
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
    <div className="promoPage" style={{ display: "flex" }}>
      <div className="promoContent" style={{ flex: "1", padding: "20px" }}>
        <Box mb={2}>
          <Button variant="contained" color="primary" onClick={() => setOpenAddModal(true)}>
            Add Promo
          </Button>
        </Box>
        <MUIDataTable title={"Promo List"} data={data} columns={columns} options={options} />
        <AddPromoModal open={openAddModal} handleClose={() => setOpenAddModal(false)} onPromoAdded={handlePromoAdded} />
        <UpdatePromoModal open={openUpdateModal} handleClose={() => setOpenUpdateModal(false)} slug={selectedSlug} onPromoUpdated={handlePromoUpdated} />

        {/* Dialog for showing delete confirmation messages */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Promo Deletion</DialogTitle>
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
    </div>
  );
};

export default Promos;
