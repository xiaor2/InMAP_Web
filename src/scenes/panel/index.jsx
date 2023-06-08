import React from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import Map from "react-map-gl";
import Navbar from "scenes/navbar";
import {
  Box,
  // TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Button,
  Slider,
  Typography,
} from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import data from "pollutant.js";
import { counties } from "counties.js";
import { hexToRgba } from "utils/legend.js";
import { colors } from "utils/colors.js";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoic2hhd25yYW4xODIiLCJhIjoiY2w5NXRvMDRjMmhhYzN3dDUyOGo0ZmdpeCJ9.RuSR6FInH2tUyctzdnilrw";

const INITIAL_VIEW_STATE = {
  latitude: 40.0,
  longitude: -115.0,
  zoom: 2.5,
  bearing: 0,
};

const MAP_STYLE = "mapbox://styles/mapbox/dark-v10";

let id = 1;

const Panel = () => {
  const [County, setCounty] = React.useState(0);
  const [percent, setPercent] = React.useState(100);

  const handleCountyChange = (event) => {
    setCounty(event.target.value);
  };

  const handleSubmit = (event) => {
    setLayer(
      new GeoJsonLayer({
        id,
        data,
        ...options,
      })
    );
    id++;
  };

  const options = {
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    pointType: "circle",
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: () => {
      let index = Math.round((255 * percent) / 100);
      let color = hexToRgba(colors[index], 150);
      return color;
    },
    getLineColor: [0, 0, 255, 200],
    getPointRadius: 100,
    getLineWidth: 5,
    getElevation: 30,
  };

  const [layer, setLayer] = React.useState(
    new GeoJsonLayer({
      id: "geojson-layer",
      data,
      ...options,
    })
  );

  const handlePercentChange = (event) => {
    setPercent(event.target.value);
  };

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
          {/* <div style={{ margin: 10, position: "absolute", zIndex: 1 }}>
            <NavigationControl />
          </div> */}
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
              return (
                <MenuItem key={i} value={i}>
                  {feature.properties.NAME}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Slider
          onChange={handlePercentChange}
          sx={{
            width: 220,
            mb: "10px",
            display: "block",
          }}
          defaultValue={percent}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
        <Button
          size="large"
          variant="contained"
          color="success"
          sx={{
            display: "block",
            minWidth: 220,
            mb: "10px",
          }}
          onClick={handleSubmit}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};
export default Panel;
