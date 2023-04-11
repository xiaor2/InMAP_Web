import React from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
import Navbar from "scenes/navbar";
import {
  Box,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Button,
  Typography,
} from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
// import { hexToRgba } from "utils/legend.js";
// import { colors } from "utils/colors.js";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoic2hhd25yYW4xODIiLCJhIjoiY2w5NXRvMDRjMmhhYzN3dDUyOGo0ZmdpeCJ9.RuSR6FInH2tUyctzdnilrw";

const INITIAL_VIEW_STATE = {
  latitude: 40.0,
  longitude: -98.0,
  zoom: 2.5,
  bearing: 0,
};

const MAP_STYLE = "mapbox://styles/mapbox/dark-v10";

const Basemap = ({ data }) => {
  const [SOA, setSOA] = React.useState(0);
  const [pNO3, setPNO3] = React.useState(0);
  const [pNH4, setPNH4] = React.useState(0);
  const [pSO4, setPSO4] = React.useState(0);
  const [PM25, setPM25] = React.useState(0);
  const [unit, setUnit] = React.useState("Tons/Year");
  const [location, setLocation] = React.useState(0);

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  const handlePM25Change = (event) => {
    setPM25(event.target.value);
  };

  const handlepSO4Change = (event) => {
    setPSO4(event.target.value);
  };

  const handlepNH4Change = (event) => {
    setPNH4(event.target.value);
  };

  const handlepNO3Change = (event) => {
    setPNO3(event.target.value);
  };

  const handleSOAChange = (event) => {
    setSOA(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.object.id);
  };

  const [layer, setLayer] = React.useState(
    new GeoJsonLayer({
      id: "geojson-layer",
      data,
      pickable: true,
      stroked: false,
      filled: true,
      extruded: true,
      pointType: "circle",
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getFillColor: [160, 160, 180, 200],
      getLineColor: [0, 0, 255, 200],
      getPointRadius: 100,
      getLineWidth: 5,
      getElevation: 30,
      onClick: handleLocationChange,
    })
  );

  const handleSubmit = (event) => {
    setLayer(
      new GeoJsonLayer({
        id: "geojson-layer",
        data,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthUnits: "pixels",
        getFillColor: [255, 160, 180, 200],
        getLineColor: [255, 0, 255, 20],
        getPointRadius: 100,
        getLineWidth: 10,
        onClick: handleLocationChange,
      })
    );
  };

  return (
    <Box>
      <Navbar />
      <Typography variant="h6" mt={4} ml={11} sx={{ fontWeight: "700" }}>
        Place a powerplant
      </Typography>
      <TextField
        id="soa"
        label="SOA"
        variant="filled"
        type="number"
        sx={{ top: "20px", ml: "5%", display: "block", mb: "10px" }}
        value={SOA}
        onChange={handleSOAChange}
      />
      <TextField
        id="pno3"
        label="pNO3"
        variant="filled"
        type="number"
        sx={{ top: "20px", ml: "5%", display: "block", mb: "10px" }}
        value={pNO3}
        onChange={handlepNO3Change}
      />
      <TextField
        id="pnh4"
        label="pNH4"
        variant="filled"
        type="number"
        sx={{ top: "20px", ml: "5%", display: "block", mb: "10px" }}
        value={pNH4}
        onChange={handlepNH4Change}
      />
      <TextField
        id="pso4"
        label="pSO4"
        variant="filled"
        type="number"
        sx={{ top: "20px", ml: "5%", display: "block", mb: "10px" }}
        value={pSO4}
        onChange={handlepSO4Change}
      />
      <TextField
        id="pm25"
        label="PM2.5"
        variant="filled"
        type="number"
        sx={{ top: "20px", ml: "5%", display: "block", mb: "10px" }}
        value={PM25}
        onChange={handlePM25Change}
      />
      <FormControl
        variant="filled"
        sx={{ top: "20px", ml: "5%", minWidth: 220, mb: "10px" }}
      >
        <InputLabel id="demo-simple-select-filled-label">Unit</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={unit}
          onChange={handleUnitChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"Tons/Year"}>Tons/Year</MenuItem>
          <MenuItem value={"Kilograms/Year"}>Kilograms/Year</MenuItem>
          <MenuItem value={"Micrograms/Year"}>Micrograms/Year</MenuItem>
        </Select>
      </FormControl>
      <TextField
        id="location"
        label="Grid Number"
        variant="filled"
        type="number"
        sx={{ top: "20px", ml: "5%", display: "block", mb: "10px" }}
        value={location}
        disabled
      />
      <Button
        size="large"
        variant="contained"
        color="success"
        sx={{
          top: "20px",
          ml: "5%",
          display: "block",
          minWidth: 220,
          mb: "10px",
        }}
        onClick={handleSubmit}
      >
        Apply
      </Button>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
        style={{
          left: "20%",
          top: "100px",
          width: "75%",
          height: "600px",
          display: "absolute",
        }}
        MapProvider
      >
        <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCESS_TOKEN}></Map>
      </DeckGL>
    </Box>
  );
};
export default Basemap;
