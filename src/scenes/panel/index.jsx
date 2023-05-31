import React from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import Map, { NavigationControl } from "react-map-gl";
import Navbar from "scenes/navbar";
import {
  Box,
  // TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  // Button,
  Slider,
  Typography,
} from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import data from "pollutant.js";
import { counties } from "counties.js"

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoic2hhd25yYW4xODIiLCJhIjoiY2w5NXRvMDRjMmhhYzN3dDUyOGo0ZmdpeCJ9.RuSR6FInH2tUyctzdnilrw";

const INITIAL_VIEW_STATE = {
  latitude: 40.0,
  longitude: -115.0,
  zoom: 2.5,
  bearing: 0,
};

const MAP_STYLE = "mapbox://styles/mapbox/dark-v10";

const Panel = () => {
  const [County, setCounty] = React.useState(0);

  const handleCountyChange = (event) => {
    setCounty(event.target.value);
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
    })
  );

  return (
    <Box>
      <Navbar />
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
        style={{
          left: "5%",
          top: "100px",
          width: "90%",
          height: "550px",
          position: "absolute",
        }}
      >
        <Map
          mapStyle={MAP_STYLE}
          initialViewState={INITIAL_VIEW_STATE}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        >
          <div style={{ margin: 10, position: "absolute", zIndex: 1 }}>
            <NavigationControl />
          </div>
        </Map>
      </DeckGL>

      <Box
        sx={{
          padding: "15px",
          marginLeft: "5%",
          position: "absolute",
          backgroundColor: "white",
          height: "550px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "700",
            mb: "10px",
          }}
        >
          Pollutant Reduction
        </Typography>
        <FormControl variant="filled" sx={{ minWidth: 220, mb: "10px" }}>
          <InputLabel id="demo-simple-select-filled-label">County</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={County}
            onChange={handleCountyChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {counties.features.map((feature, i) => {
              return <MenuItem key={i} value={i}>{feature.properties.NAME}</MenuItem>
            })}
          </Select>
        </FormControl>
        <Slider
          sx={{
            width: 220,
            mb: "10px",
            display: "block",
          }}
          defaultValue={100}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
};
export default Panel;
