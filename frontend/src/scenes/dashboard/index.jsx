import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from '../../assets/images/logos.png';

import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Header,
  StatBox,
} from "../../components";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
  BarChartOutlined,
  BrandingWatermark,
  CalendarTodayOutlined,
  Category,
  ContactsOutlined,
  DashboardOutlined,
  Discount,
  DonutLargeOutlined,
  HelpOutlineOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  ProductionQuantityLimits,
  ReceiptOutlined,
  TimelineOutlined,
  WavesOutlined,
} from "@mui/icons-material";
import { tokens } from "../../theme";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");

  const [userCount, setUserCount] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    // Fetch the number of users
    axios.get("http://localhost:4000/api/users/all")
      .then(response => {
        console.log("Users response:", response.data); // Debugging step
        setUserCount(response.data.users.length); // Adjusted to use response.data.users
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setUserCount(0); // Set to 0 if there's an error
      });

    // Fetch the number of brands
    axios.get("http://localhost:4000/api/brands/all")
      .then(response => {
        console.log("Brands response:", response.data); // Debugging step
        setBrandCount(response.data.brands.length); // Adjusted to use response.data.brands
      })
      .catch(error => {
        console.error("Error fetching brands:", error);
        setBrandCount(0); // Set to 0 if there's an error
      });

    // Fetch the number of categories
    axios.get("http://localhost:4000/api/categories/all")
      .then(response => {
        console.log("Categories response:", response.data); // Debugging step
        setCategoryCount(response.data.categories.length); // Adjusted to use response.data.categories
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
        setCategoryCount(0); // Set to 0 if there's an error
      });

    // Fetch the number of products
    axios.get("http://localhost:4000/api/products/all")
      .then(response => {
        console.log("Products response:", response.data); // Debugging step
        setProductCount(response.data.products.length); // Adjusted to use response.data.products
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setProductCount(0); // Set to 0 if there's an error
      });
  }, []);

  return (
    <Box m="20px">
  <Box display="flex" justifyContent="space-between">
    <Header title="MEWBOARD" subtitle="Welcome to MEW dashboard" />
  </Box>

  {/* GRID & CHARTS */}
  <Box
    display="grid"
    gridTemplateColumns={
      isXlDevices
        ? "repeat(12, 1fr)"
        : isMdDevices
        ? "repeat(6, 1fr)"
        : "repeat(3, 1fr)"
    }
    gridAutoRows="140px"
    gap="20px"
  >
    {/* Statistic Items */}
    <Box
      gridColumn="span 3"
      bgcolor={colors.primary[400]}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <StatBox
        title={userCount} // Displaying user count
        subtitle="Number of Users"
        icon={
          <PeopleAltOutlined
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
          />
        }
      />
    </Box>
    <Box
      gridColumn="span 3"
      backgroundColor={colors.primary[400]}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <StatBox
        title={brandCount} // Displaying brand count
        subtitle="Number of Brands"
        icon={
          <BrandingWatermark
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
          />
        }
      />
    </Box>
    <Box
      gridColumn="span 3"
      backgroundColor={colors.primary[400]}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <StatBox
        title={categoryCount} // Displaying category count
        subtitle="Number of Categories"
        icon={
          <Category
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
          />
        }
      />
    </Box>
    <Box
      gridColumn="span 3"
      backgroundColor={colors.primary[400]}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <StatBox
        title={productCount} // Displaying product count
        subtitle="Number of Products"
        icon={
          <ProductionQuantityLimits
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
          />
        }
      />
    </Box>

    {/* Logo/Image Section */}
    <Box
      gridColumn="span 6" // Half the width of the grid
      backgroundColor={colors.primary[400]}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="300px"
      borderRadius="10px"
    >
      <img
        src={logo}
        alt="Logo"
        style={{
          width: "100%", // Image takes up most of the box width
          height: "250px",
          objectFit: "contain",
          margin: "10px", // Minimal space between image and box
        }}
      />
</Box>

<Box
      gridColumn="span 6" // Half the width of the grid
      backgroundColor={colors.primary[400]}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="300px"
      borderRadius="10px"
    >
      <p>CHARTS HERE</p>
</Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
