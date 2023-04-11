import React from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
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

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoic2hhd25yYW4xODIiLCJhIjoiY2w5NXRvMDRjMmhhYzN3dDUyOGo0ZmdpeCJ9.RuSR6FInH2tUyctzdnilrw";

const INITIAL_VIEW_STATE = {
  latitude: 40.0,
  longitude: -115.0,
  zoom: 2.5,
  bearing: 0,
};

const MAP_STYLE = "mapbox://styles/mapbox/dark-v10";

const Panel = ({ data }) => {
  const [Country, setCountry] = React.useState("Tons/Year");

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
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
        MapProvider
      >
        <Map mapStyle={MAP_STYLE} mapboxAccessToken={MAPBOX_ACCESS_TOKEN}></Map>
        <Box
          sx={{
            paddingRight: "30px",
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
              value={Country}
              onChange={handleCountryChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Champaign"}>Champaign</MenuItem>
              <MenuItem value={"Rantoul"}>Rantoul</MenuItem>
              <MenuItem value={"Chicago"}>Chicago</MenuItem>
              <MenuItem value={"Springfield"}>Springfield</MenuItem>
              <MenuItem value={"Bloomington"}>Bloomington</MenuItem>
            </Select>
          </FormControl>
          <Slider
            sx={{
              width: 220,
              mb: "10px",
              display: "block",
            }}
            defaultValue={50}
            aria-label="Default"
            valueLabelDisplay="auto"
          />
        </Box>
      </DeckGL>
    </Box>
  );
};
export default Panel;
