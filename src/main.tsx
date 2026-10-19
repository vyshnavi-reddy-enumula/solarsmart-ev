import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import { AccountProvider } from './context/AccountContext';
import { StationDataProvider } from './context/StationDataContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RoleProvider>
        <StationDataProvider>
          <AccountProvider>
            <App />
          </AccountProvider>
        </StationDataProvider>
      </RoleProvider>
    </ThemeProvider>
  </React.StrictMode>
);
