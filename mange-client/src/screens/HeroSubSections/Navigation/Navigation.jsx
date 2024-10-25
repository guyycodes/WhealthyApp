import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Button, CssBaseline, IconButton, Menu, MenuItem, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TypewriterEffect component for animating text
const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => { 
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsTyping(!isTyping);
        setIndex(isTyping ? text.length : 0);
      }, 1000); // Pause for 1 second before changing direction
      return () => clearTimeout(pauseTimer);
    }

    if (isTyping && index <= text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, index));
        setIndex((prevIndex) => prevIndex + 1);
      }, 100); // Adjust typing speed
      return () => clearTimeout(timer);
    } else if (!isTyping && index > 0) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, index - 1));
        setIndex((prevIndex) => prevIndex - 1);
      }, 50); // Adjust untyping speed
      return () => clearTimeout(timer);
    } else {
      setIsPaused(true);
    }
  }, [index, text, isTyping, isPaused]);

  return (
    <Typography
      variant="body1"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        color: '#d4af37',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        minHeight: '20px', // Prevent layout shift
        minWidth: '20ch', // Ensure consistent width
      }}
    >
      {displayText}
    </Typography>
  );
};

// Main Navigation component
export const Navigation = () => {
  // State for managing the mobile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const scrollNow = (location) =>{
    // Scroll now
    (() => {
      window.scrollTo({
        top: location,
        behavior: 'smooth',
      });
    })();
  }

    /**
   * Handles routing based on the clicked link.
   *
   * @function
   * @param {string} clickedText - The text of the clicked link
   */
    const handleRouting = (route) => {
      navigate(route);
      handleClose(); // Close the menu if open
    };

   // Handler for opening the mobile menu
   const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handler for closing the mobile menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const embossedText = {
    color: '#d4af37',
    margin: '0 15px',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 500,
    fontFamily: "var(--heading-2-font-family)",
    textShadow: '-1px -1px 1px rgba(255,255,255,.1), 1px 1px 1px rgba(0,0,0,.9)',
    position: 'relative',
    '&:after': {
      content: '"Home"',
      position: 'absolute',
      top: '1px',
      left: '1px',
      zIndex: -1,
      color: 'rgba(0,0,0,0.3)',
    }
  };

  const animatedBackgroundStyle = `
    @keyframes colorChange {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
  `;

  const inspiringMessage = "Embrace wellness, nourish yourself, elevate your life.";

  return (
    <>
      <CssBaseline />
      <style>{animatedBackgroundStyle}</style>
      <AppBar position="static" style={{
        background: 'linear-gradient(45deg, #1e1e1e, #d4af37, #1e1e1e)',
        backgroundSize: '200% 200%',
        animation: 'colorChange 10s ease infinite',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '10px 0',
        borderRadius: '25px',
      }}>
        <Toolbar style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '0 24px',
        }}>
          {/* Logo */}
          <Typography variant="h5" style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: '#d4af37',
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '2px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}>
            <span style={{ fontSize: '32px', marginRight: '10px' }}>M</span>ANGE
          </Typography>

          {/* Centered Typewriter Effect */}
          {!isMobile && (
                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    justifyContent: 'center',
                    overflow: 'hidden', // Hide overflow
                    padding: '0 10px', // Add some padding
                  }}>
              <TypewriterEffect text={inspiringMessage} />
            </div>
          )}

          {/* Navigation Buttons */}
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                aria-label="menu"
                onClick={handleMenu}
                style={{ color: 'var(--black-800-333333)' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleRouting('/')}>Home</MenuItem>
                <MenuItem onClick={() => handleRouting('/login')}>Join</MenuItem>
                <MenuItem onClick={() => scrollNow(600)}>Learn</MenuItem>
              </Menu>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={() => handleRouting('/')}
                color="inherit" 
                sx={embossedText}
              >Home
              </Button>
              <Button 
                color="inherit" 
                onClick={() => handleRouting('/login')}
                sx={embossedText}
              >Join
              </Button>
              <Button 
                variant="contained" 
                onClick={() => scrollNow(600)}
                sx={{
                  color: '#1e1e1e',
                  borderRadius: '5px',
                  background: '#d4af37',
                  boxShadow: '0 4px 6px rgba(212, 175, 55, 0.3)',
                  border:'.5px solid var(--black)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  padding: '8px 20px',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease',
                  fontFamily: "var(--heading-5-font-family)",
                }}
              >
                Learn
              </Button>
            </div>
          )}
        </Toolbar>

        {/* Typewriter Effect for Mobile */}
        {isMobile && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '10px 0',
            overflow: 'hidden', // Hide overflow
          }}>
            <TypewriterEffect text={inspiringMessage} />
          </div>
        )}
      </AppBar>
    </>
  );
};