import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { FilterProvider } from "./context/FilterContext.jsx";
import { SiteConfigProvider } from "./context/SiteConfigContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SiteConfigProvider>
          <ThemeProvider>
            <FilterProvider>
              <AppRoutes />
              <ToastContainer />
            </FilterProvider>
          </ThemeProvider>
        </SiteConfigProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
