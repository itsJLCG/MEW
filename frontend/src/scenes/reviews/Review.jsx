import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import MUIDataTable from "mui-datatables";
import { confirm } from "material-ui-confirm"; // Import the Confirm component

const Reviews = () => {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/reviews/reviewAll/list");
        const reviews = response.data.data;

        const rows = reviews.map((review, index) => ({
          id: index + 1,
          _id: review._id,
          productId: review.productId,
          reviewText: review.reviewText,
          rating: review.rating,
          user: review.user,
          createdAt: new Date(review.createdAt).toLocaleString(),
          updatedAt: new Date(review.updatedAt).toLocaleString(),
          actions: review._id,
        }));

        setData(rows);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchData();
  }, []);

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:4000/api/reviews/review/delete/${reviewId}`);
      setData((prevData) => prevData.filter((row) => row._id !== reviewId));
      setDialogMessage("Review deleted successfully");
    } catch (error) {
      setDialogMessage(error.response?.data?.error || "Error deleting review");
    } finally {
      setDialogOpen(true);
    }
  };

  const confirmDeleteReview = (reviewId) => {
    confirm({
      description: "Are you sure you want to delete this review?",
      confirmationText: "Delete",
      cancellationText: "Cancel",
    })
      .then(() => {
        deleteReview(reviewId); // Call the delete function after confirmation
      })
      .catch(() => {
        console.log("Deletion cancelled");
      });
  };

  const renderActions = (reviewId) => (
    <Box display="flex" gap={1}>
      <IconButton onClick={() => confirmDeleteReview(reviewId)}>
        <Delete style={{ color: "red" }} />
      </IconButton>
    </Box>
  );

  const columns = [
    { name: "id", label: "S.No.", options: { filter: false, sort: true } },
    { name: "_id", label: "Review ID", options: { filter: false, sort: true } },
    { name: "productId", label: "Product ID", options: { filter: true, sort: true } },
    { name: "reviewText", label: "Review Text", options: { filter: true, sort: false } },
    { name: "rating", label: "Rating", options: { filter: true, sort: true } },
    { name: "user", label: "User ID", options: { filter: true, sort: true } },
    { name: "createdAt", label: "Created At", options: { filter: false, sort: true } },
    { name: "updatedAt", label: "Updated At", options: { filter: false, sort: true } },
    {
      name: "actions",
      label: "Actions",
      options: { filter: false, sort: false, customBodyRender: (value) => renderActions(value) },
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
    <div className="reviewPage" style={{ display: "flex" }}>
      <div className="reviewContent" style={{ flex: "1", padding: "20px" }}>
        <MUIDataTable title={"Review List"} data={data} columns={columns} options={options} />

        {/* Dialog for showing delete confirmation messages */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Review Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <button onClick={() => setDialogOpen(false)}>Close</button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Reviews;
