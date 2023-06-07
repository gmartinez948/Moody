import React, { SetStateAction, useEffect } from "react";
import { AppBar, Box, Typography, Button, IconButton } from "@mui/material";
import axios from "axios";

interface AppbarProps {
  setLogin: React.Dispatch<SetStateAction<boolean>>;
}

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Button color="inherit">Login</Button>
      </AppBar>
    </Box>
  );
};

export default Navbar;
