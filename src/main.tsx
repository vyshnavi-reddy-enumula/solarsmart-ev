import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import { StationDataProvider } from './context/StationDataContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RoleProvider>
        <StationDataProvider>
          <App />
        </StationDataProvider>
      </RoleProvider>
    </ThemeProvider>
  </React.StrictMode>
);
