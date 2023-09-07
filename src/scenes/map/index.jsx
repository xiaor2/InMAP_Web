import React from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { Map, Marker } from "react-map-gl";
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
import icon from "icon.png";
import { getZarr } from "utils/getZarr.js";
import { slice } from "zarr";
import useMediaQuery from "@mui/material/useMediaQuery";
import { hexToRgba } from "utils/legend.js";
import { colors } from "utils/colors.js";
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

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
  // let initialMarker = [
  //   {latitude: 40, longitude: -100}, 
  //   {latitude: 40, longitude: -110}
  // ];
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const isMinimumScreens = useMediaQuery("(max-width:550px)");
  const [SOA, setSOA] = React.useState(0.0);
  const [pNO3, setPNO3] = React.useState(0.0);
  const [pNH4, setPNH4] = React.useState(0.0);
  const [pSO4, setPSO4] = React.useState(0.0);
  const [PM25, setPM25] = React.useState(0.0);
  const [unit, setUnit] = React.useState(0.0);
  const [location, setLocation] = React.useState(0);
  const [disable, setDisable] = React.useState(false);
  // const [lable, setLable] = React.useState(initialMarker);
  const [marker, setMarker] = React.useState([]);
  const [lable, setLable] = React.useState([]);
  const [total, setTotal] = React.useState(0.0);    // Total concentration of PM2.5
  const [PWAvg, setPWAvg] = React.useState(0.0);    // Population-weighted Average concentration of PM2.5
  const [deathsK, setDeathsK] = React.useState(0.0);    // Total number of deaths
  const [deathsL, setDeathsL] = React.useState(0.0);    // Assume a 14% increase in morality rate for every 10 μg/m³ increase in PM2.5 concentration
  let max = 0;

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


  const handleMarker = (LngLat) => {
    setMarker({
      latitude: LngLat.coordinate[1],
      longitude: LngLat.coordinate[0]
    });
    console.log(marker);
    // console.log(LngLat.coordinate);
  };


  const options = {
    pickable: true,
    stroked: false,
    filled: true,
    extruded: true,
    pointType: "circle",
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    // getFillColor: (data) => [255, 255 * data.properties.TotalPM25, 0, 200],
    getFillColor: (data) => {
      // let index =
      //   Math.round(data.properties.TotalPM25) > 255
      //     ? 255
      //     : Math.round(data.properties.TotalPM25);

      let index = max === 0 ? 0 : Math.round((data.properties.TotalPM25-0)/(max - 0) * 255)
      let color = hexToRgba(colors[index], 150);
      return color;
    },
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
    console.log(unit)
    Store.addNotification({
      title: "Rendering...",
      message: "Please wait for a few seconds to see the results.",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true
      }
    });
    setDisable(true);

    const SOA_cloud = await getZarr("SOA");
    console.log("SOA", SOA_cloud);
    const pNH4_cloud = await getZarr("pNH4");
    const pNO3_cloud = await getZarr("pNO3");
    const pSO4_cloud = await getZarr("pSO4");
    const PM25_cloud = await getZarr("PrimaryPM25");
    console.log("PM25", PM25_cloud);
    const Pop_could = await getZarr("TotalPop");
    console.log("population", Pop_could);
    const MR_could = await getZarr("MortalityRate");
    console.log("death", MR_could);

    let SOA_curr = await SOA_cloud
      .get([0, location, slice(null, 52411)])
      .then(async (data) => await data.data);
    let pNO3_curr = await pNO3_cloud
      .get([0, location, slice(null, 52411)])
      .then(async (data) => await data.data);
    let pNH4_curr = await pNH4_cloud
      .get([0, location, slice(null, 52411)])
      .then(async (data) => await data.data);
    let pSO4_curr = await pSO4_cloud
      .get([0, location, slice(null, 52411)])
      .then(async (data) => await data.data);
    let PM25_curr = await PM25_cloud
      .get([0, location, slice(null, 52411),])
      .then(async (data) => await data.data);
    let Pop_curr = await Pop_could
      .get([slice(null, 52411),])
      .then(async (data) => await data.data);
    console.log("pop", Pop_curr);
    let MR_curr = await MR_could
      .get([slice(null, 52411),])
      .then(async (data) => await data.data);
    console.log("death", MR_curr);

    let tmpTotal = 0;
    let weightedSum = 0;
    let totalPop = 0;
    let tmpDsk = 0;
    let tmpDsL = 0;
    for (let i = 0; i < 52411; i++) {
      let curr =
        unit *
        (SOA_curr[i] * SOA +
          pNO3_curr[i] * pNO3 +
          pNH4_curr[i] * pNH4 +
          pSO4_curr[i] * pSO4 +
          PM25_curr[i] * PM25);
      
      data.features[i].properties.TotalPM25 += curr;
      tmpTotal += data.features[i].properties.TotalPM25;
      totalPop += Pop_curr[i];
      // console.log("population/grid: " + Pop_curr[i]);
      weightedSum += data.features[i].properties.TotalPM25 * Pop_curr[i];
      tmpDsk += (Math.exp(Math.log(1.06)/10 * curr) - 1) * Pop_curr[i] * 1.0465819687408728 * MR_curr[i] / 100000 * 1.025229357798165;
      tmpDsL += (Math.exp(Math.log(1.14)/10 * curr) - 1) * Pop_curr[i] * 1.0465819687408728 * MR_curr[i] / 100000 * 1.025229357798165;

      if (data.features[i].properties.TotalPM25 > max) {
        console.log(data.features[i].properties.TotalPM25);
        max = data.features[i].properties.TotalPM25;
        console.log("max", max);
      }
    }
    setTotal(total+tmpTotal);
    setPWAvg(weightedSum/totalPop);
    setDeathsK(deathsK+tmpDsk);
    setDeathsL(deathsL+tmpDsL);
    console.log("population sum",totalPop)
    id = id + "1";
    console.log(id);
    setLayer(
      new GeoJsonLayer({
        id,
        data,
        ...options,
      })
    );
    setLable((label) => [...label, {
      latitude: marker.latitude,
      longitude: marker.longitude
    }]);
    setDisable(false);
  };

  const handleReset = async () => {
    for (let i = 0; i < 52411; i++) {
      data.features[i].properties.TotalPM25 = 0;
    }
    setSOA(0.0);
    setPNO3(0.0);
    setPNH4(0,0);
    setPSO4(0.0);
    setPM25(0.0);
    setUnit(0.0);
    setLocation(0.0);
    setMarker([]);
    setLable([]);
    setTotal(0.0);
    setPWAvg(0.0);
    setDeathsK(0.0);
    setDeathsL(0.0);
    id = id + "1";
    setLayer(
      new GeoJsonLayer({
        id,
        data,
        ...options,
        getFillColor: [0, 0, 0, 150]
      })
    );
    console.log('done');
  };
  
  return (
    <Box>
      <Navbar />
      <ReactNotifications />
      {isNonMobileScreens ? (
        <Box>
          <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            getTooltip={({ object }) =>
              object && {
                html: `<div>TotalPM2.5: ${
                  (object.properties.TotalPM25).toPrecision(3)
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
              top: "120px",
              width: "90%",
              height: "550px",
              position: "absolute",
            }}
            onClick={handleMarker}
            MapProvider
          >
            <Map
              mapStyle={MAP_STYLE}
              mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            >
              {Array.isArray(lable) ?
                lable.map((l) => (
                  <Marker longitude={l.longitude} latitude={l.latitude} anchor="bottom">
                    <img width="30" height="30" src={icon} alt="lightning-bolt"/>
                  </Marker>
                ))
                : null
              }
              {marker.longitude !== undefined ?
                <Marker longitude={marker.longitude} latitude={marker.latitude} color="Gainsboro"/>
                : null
              }
            </Map>
          </DeckGL>
          <Box
            sx={{
              padding: "15px",
              marginLeft: "5%",
              position: "absolute",
              backgroundColor: "white",
              height: "600px",
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
              fullWidth
              sx={{ display: "block", mb: "10px" }}
              value={SOA}
              onChange={handleSOAChange}
            />
            <TextField
              id="pno3"
              label="pNO3"
              variant="filled"
              type="number"
              fullWidth
              sx={{ display: "block", mb: "10px" }}
              value={pNO3}
              onChange={handlepNO3Change}
            />
            <TextField
              id="pnh4"
              label="pNH4"
              variant="filled"
              type="number"
              fullWidth
              sx={{ display: "block", mb: "10px" }}
              value={pNH4}
              onChange={handlepNH4Change}
            />
            <TextField
              id="pso4"
              label="pSO4"
              variant="filled"
              type="number"
              fullWidth
              sx={{ display: "block", mb: "10px" }}
              value={pSO4}
              onChange={handlepSO4Change}
            />
            <TextField
              id="pm25"
              label="PM2.5"
              variant="filled"
              type="number"
              fullWidth
              sx={{ display: "block", mb: "10px" }}
              value={PM25}
              onChange={handlePM25Change}
            />
            <FormControl variant="filled" sx={{ minWidth: 220, mb: "10px" }}>
              <InputLabel id="demo-simple-select-filled-label" required>Unit</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={unit}
                onChange={handleUnitChange}
              >
                <MenuItem value={0}>
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
              fullWidth
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
              disabled={unit === 0 || disable}
            >
              Apply
            </Button>
            <Button
              size="large"
              variant="contained"
              color="info"
              sx={{
                display: "block",
                minWidth: 220,
                mb: "10px",
              }}
              onClick={handleReset}
              // disabled={disable}
            >
              Reset
            </Button>
          </Box>
          <Box
            sx={{
              padding: "12px",
              marginLeft: "23%",
              top: "140px",
              position: "absolute",
              backgroundColor: "white",
              height: "110px",
              lineHeight: 1.7,
              boxShadow: 3,
              opacity: [0.9, 0.8, 0.8],
              borderRadius: 1,
              '&:hover': {
                opacity: [0.95, 0.95, 0.95],
              },
            }}
          >
            <Typography
              variant="h7"
              sx={{
                fontWeight: "500",
                color: "dark-grey",
                mb: "10px",
              }}
              display="block"
            >
              ▪ Total PM2.5 concentration: {total.toPrecision(4)} μg/m³<br/>
              ▪ Population-Weighted average PM2.5: {PWAvg.toPrecision(4)} μg/m³<br/>
              ▪ Total Number of Death (6%↑): {deathsK.toPrecision(4)}<br/>
              ▪ Total Number of Death (14%↑): {deathsL.toPrecision(4)}<br/>
            </Typography>
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
