import "./App.css";
import Basemap from "scenes/map";
import Panel from "scenes/panel";
import React from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Basemap />} />
          <Route path="/panel" element={<Panel />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
