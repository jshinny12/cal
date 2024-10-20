import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            href="/"
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CAL
          </Typography>
          <Button color="inherit" href="/">Home</Button>
          <Button color="inherit" href="/Calendar">Calendar</Button>

          {
            !isLoggedIn ? 
            <Button color="inherit" href="/login">Login</Button> :
            <Button color="inherit" onClick={() => {
              onLogout();
              navigate('/');
            }}>
              Logout
            </Button>
          }
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}
