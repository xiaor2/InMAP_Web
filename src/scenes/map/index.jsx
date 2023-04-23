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
import pollutant from "pollutant.js";
import { getZarr } from "utils/getZarr.js";
import { slice } from "zarr";
import useMediaQuery from "@mui/material/useMediaQuery";
// import { hexToRgba } from "utils/legend.js";
// import { colors } from "utils/colors.js";

// console.log(pollutant);

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoic2hhd25yYW4xODIiLCJhIjoiY2w5NXRvMDRjMmhhYzN3dDUyOGo0ZmdpeCJ9.RuSR6FInH2tUyctzdnilrw";

const INITIAL_VIEW_STATE = {
  latitude: 40.0,
  longitude: -115.0,
  zoom: 2.5,
  bearing: 0,
};

const MOBILE_INITIAL_VIEW_STATE = {
  latitude: 40.0,
  longitude: -98.0,
  zoom: 1,
  bearing: 0,
};

const MAP_STYLE = "mapbox://styles/mapbox/dark-v10";

let id = "id";
let data = pollutant;

const Basemap = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const isMinimumScreens = useMediaQuery("(max-width:550px)");
  const [SOA, setSOA] = React.useState(0);
  const [pNO3, setPNO3] = React.useState(0);
  const [pNH4, setPNH4] = React.useState(0);
  const [pSO4, setPSO4] = React.useState(0);
  const [PM25, setPM25] = React.useState(0);
  const [unit, setUnit] = React.useState(0);
  const [location, setLocation] = React.useState(0);
  const [disable, setDisable] = React.useState(false);

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
    setLocation(parseInt(event.object.id));
  };

  const options = {
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    pointType: "circle",
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: (data) => [255, 255 * data.properties.TotalPM25, 0, 200],
    getLineColor: [0, 0, 255, 200],
    getPointRadius: 100,
    getLineWidth: 5,
    getElevation: 30,
    onClick: handleLocationChange,
  };

  const [layer, setLayer] = React.useState(
    new GeoJsonLayer({
      id,
      data,
      ...options,
    })
  );

  const handleSubmit = async () => {
    setDisable(true);
    const SOA_cloud = await getZarr("SOA");
    const pNH4_cloud = await getZarr("pNH4");
    const pNO3_cloud = await getZarr("pNO3");
    const pSO4_cloud = await getZarr("pSO4");
    const PM25_cloud = await getZarr("PrimaryPM25");
    console.log(typeof location);
    let SOA_curr = await SOA_cloud.get([0, location, slice(null, 52411)]).then(
      async (data) => await data.data
    );
    let pNO3_curr = await pNO3_cloud
      .get([0, location, slice(null, 52411)])
      .then(async (data) => await data.data);
    let pNH4_curr = await pNH4_cloud
      .get([0, location, slice(null, 52411)])
      .then(async (data) => await data.data);
    let pSO4_curr = await pSO4_cloud
      .get([0, location, slice(null, 52411)])
      .then(async (data) => await data.data);
    let PM25_curr = await PM25_cloud.get([
      0,
      location,
      slice(null, 52411),
    ]).then(async (data) => await data.data);
    for (let i = 0; i < 52411; i++) {
      let curr =
        unit *
        (SOA_curr[i] * SOA +
          pNO3_curr[i] * pNO3 +
          pNH4_curr[i] * pNH4 +
          pSO4_curr[i] * pSO4 +
          PM25_curr[i] * PM25);
      data.features[i].properties.TotalPM25 += curr;
    }
    id = id + "1";
    setLayer(
      new GeoJsonLayer({
        id,
        data,
        ...options,
      })
    );
    setDisable(false);
  };

  return (
    <Box>
      <Navbar />
      {isNonMobileScreens ? (
        <Box>
          <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            getTooltip={({ object }) =>
              object && {
                html: `<div>TotalPM25: ${
                  Math.round(object.properties.TotalPM25 * 100) / 100
                } μg/m³</div>`,
                style: {
                  backgroundColor: "grey",
                  fontSize: "1em",
                  color: "white",
                  padding: "5px",
                },
              }
            }
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
            <Map
              mapStyle={MAP_STYLE}
              mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            ></Map>
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
              Place a powerplant
            </Typography>
            <TextField
              id="soa"
              label="SOA"
              variant="filled"
              type="number"
              sx={{
                display: "block",
                mb: "10px",
              }}
              value={SOA}
              onChange={handleSOAChange}
            />
            <TextField
              id="pno3"
              label="pNO3"
              variant="filled"
              type="number"
              sx={{ display: "block", mb: "10px" }}
              value={pNO3}
              onChange={handlepNO3Change}
            />
            <TextField
              id="pnh4"
              label="pNH4"
              variant="filled"
              type="number"
              sx={{ display: "block", mb: "10px" }}
              value={pNH4}
              onChange={handlepNH4Change}
            />
            <TextField
              id="pso4"
              label="pSO4"
              variant="filled"
              type="number"
              sx={{ display: "block", mb: "10px" }}
              value={pSO4}
              onChange={handlepSO4Change}
            />
            <TextField
              id="pm25"
              label="PM2.5"
              variant="filled"
              type="number"
              sx={{ display: "block", mb: "10px" }}
              value={PM25}
              onChange={handlePM25Change}
            />
            <FormControl variant="filled" sx={{ minWidth: 220, mb: "10px" }}>
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
                <MenuItem value={28766.639}>Tons/Year</MenuItem>
                <MenuItem value={31.7098}>Kilograms/Year</MenuItem>
                <MenuItem value={1}>Micrograms/Year</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="location"
              label="Grid Number"
              variant="filled"
              type="number"
              sx={{ display: "block", mb: "10px" }}
              value={location}
              disabled
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
              disabled={disable}
            >
              Apply
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <DeckGL
            initialViewState={MOBILE_INITIAL_VIEW_STATE}
            getTooltip={({ object }) =>
              object && {
                html: `<div>TotalPM25: ${
                  Math.round(object.properties.TotalPM25 * 100) / 100
                } μg/m³</div>`,
                style: {
                  backgroundColor: "grey",
                  fontSize: "1em",
                  color: "white",
                  padding: "5px",
                },
              }
            }
            controller={true}
            layers={[layer]}
            style={{
              left: "5%",
              top: isMinimumScreens ? "680px" : "420px",
              width: "90%",
              height: "550px",
              position: "absolute",
            }}
            MapProvider
          >
            <Map
              mapStyle={MAP_STYLE}
              mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            ></Map>
          </DeckGL>
          <Box
            sx={{
              padding: "15px",
              marginLeft: "5%",
              position: "absolute",
              backgroundColor: "white",
              height: "300px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "700",
                mb: "10px",
              }}
            >
              Place a powerplant
            </Typography>
            <Box>
              <TextField
                id="soa"
                label="SOA"
                variant="filled"
                type="number"
                sx={{
                  mb: "10px",
                  mr: "10px",
                }}
                value={SOA}
                onChange={handleSOAChange}
              />
              <TextField
                id="pno3"
                label="pNO3"
                variant="filled"
                type="number"
                sx={{ mb: "10px" }}
                value={pNO3}
                onChange={handlepNO3Change}
              />
            </Box>
            <Box>
              <TextField
                id="pnh4"
                label="pNH4"
                variant="filled"
                type="number"
                sx={{ mb: "10px", mr: "10px" }}
                value={pNH4}
                onChange={handlepNH4Change}
              />
              <TextField
                id="pso4"
                label="pSO4"
                variant="filled"
                type="number"
                sx={{ mb: "10px" }}
                value={pSO4}
                onChange={handlepSO4Change}
              />
            </Box>
            <Box>
              <TextField
                id="pm25"
                label="PM2.5"
                variant="filled"
                type="number"
                sx={{ mb: "10px", mr: "10px" }}
                value={PM25}
                onChange={handlePM25Change}
              />
              <FormControl variant="filled" sx={{ minWidth: 220, mb: "10px" }}>
                <InputLabel id="demo-simple-select-filled-label">
                  Unit
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={unit}
                  onChange={handleUnitChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={28766.639}>Tons/Year</MenuItem>
                  <MenuItem value={31.7098}>Kilograms/Year</MenuItem>
                  <MenuItem value={1}>Micrograms/Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                id="location"
                label="Grid Number"
                variant="filled"
                type="number"
                sx={{ mb: "10px", mr: "10px" }}
                value={location}
                disabled
              />
              <Button
                size="large"
                variant="contained"
                color="success"
                sx={{
                  minWidth: 220,
                  minHeight: 55,
                  mb: "10px",
                }}
                onClick={handleSubmit}
                disabled={disable}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export default Basemap;
