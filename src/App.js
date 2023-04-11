import "./App.css";
import Basemap from "scenes/map";
import Panel from "scenes/panel";
import pollutant from "pollutant.js";
import React from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Box>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Basemap data={pollutant} />} />
          <Route path="/panel" element={<Panel data={pollutant} />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
