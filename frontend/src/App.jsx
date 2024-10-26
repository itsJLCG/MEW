import React, { createContext, useState } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 
import { ConfirmProvider } from "material-ui-confirm";

export const ToggledContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  return (
    <ConfirmProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToggledContext.Provider value={values}>
            <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
              <SideBar />
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  maxWidth: "100%",
                }}
              >
                <Navbar />
                <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                  <Outlet />
                </Box>
              </Box>
            </Box>
            <Toaster position="top-right" /> {/* Add Toaster here */}
          </ToggledContext.Provider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </ConfirmProvider>
  );
}

export default App;
