import { IconButton, Typography } from "@mui/material";
import { Web } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import Tutorial from "components/Tutorial";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <FlexBetween padding="1rem 6%" backgroundColor="#C18C5D">
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="white"
          onClick={() => navigate("/")}
          sx={{
            "&:hover": {
              color: "#ECC8AF",
              cursor: "pointer",
            },
          }}
        >
          InMAP
        </Typography>
      </FlexBetween>
      <FlexBetween gap="1.75rem">
        <IconButton onClick={() => navigate("/panel")}>
          <Web sx={{ fontSize: "25px" }}></Web>
        </IconButton>
        <Tutorial />
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;
