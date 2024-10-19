import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { IconButton, Button } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/system";

const Promos = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/promos/all");
        const promos = response.data.promos;

        // Map promos into rows
        const rows = promos.map((promo, index) => ({
          id: index + 1,
          _id: promo._id,
          name: promo.name,
          description: promo.description,
          discount: promo.discount,
          startDate: new Date(promo.startDate).toLocaleDateString(),
          endDate: new Date(promo.endDate).toLocaleDateString(),
          slug: promo.slug,
          images: handlePromoImages(promo.image), // Process images
          actions: promo.slug // For edit/delete actions
        }));

        setData(rows);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  // Function to handle rendering promo images
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
      const response = await axios.delete("http://localhost:4000/api/promos/${promoSlug}");
      setData((prevData) => prevData.filter((row) => row.slug !== promoSlug));
      alert(response.data.message); // Show message to user
    } catch (error) {
      console.log(error);
    }
  };

  const renderActions = (slug) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => deletePromo(slug)}>
        <Delete style={{ color: "red" }} />
      </IconButton>

      <IconButton href={`/promo/update/${slug}`}>
        <Edit style={{ color: "blue" }} />
      </IconButton>
    </Box>
  );

  const columns = [
    { name: 'id', label: 'S.No.', options: { filter: false, sort: true }},
    { name: '_id', label: 'Promo _id', options: { filter: false, sort: true }},
    { name: 'name', label: 'Name', options: { filter: true, sort: true }},
    { name: 'description', label: 'Description', options: { filter: true, sort: true }},
    { name: 'discount', label: 'Discount', options: { filter: true, sort: true }},
    { name: 'startDate', label: 'Start Date', options: { filter: true, sort: true }},
    { name: 'endDate', label: 'End Date', options: { filter: true, sort: true }},
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
    <div className="promoPage" style={{ display: 'flex' }}>
      <div className="promoContent" style={{ flex: '1', padding: '20px' }}>
        <Box mb={2}>
          <Button variant="contained" color="primary" onClick={() => console.log("Add Promo button clicked")}>
            Add Promo
          </Button>
        </Box>
        <MUIDataTable title={"Promo List"} data={data} columns={columns} options={options} />
      </div>
    </div>
  );
};

export default Promos;