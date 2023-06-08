import React, { SetStateAction, useEffect } from "react";
import { AppBar, Box, Typography, Button, IconButton } from "@mui/material";
import axios from "axios";

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Button>Log In to Spotify</Button>
      </AppBar>
    </Box>
  );
};

export default Navbar;
