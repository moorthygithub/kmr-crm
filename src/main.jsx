import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider and createTheme
import './index.css';

// Create a theme instance
const theme = createTheme({
  // You can customize your theme here
  // For example, setting the primary color
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}> {/* Wrap App with ThemeProvider */}
      <App />
    </ThemeProvider>
  </StrictMode>
);
