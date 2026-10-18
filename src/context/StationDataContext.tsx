import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  StationDataState,
  DataSourceMode,
  StationOperationalStatus,
} from '../types/station';

interface StationDataContextType {
  state: StationDataState;
  setDataSourceMode: (mode: DataSourceMode) => void;
  setOperationalStatus: (status: StationOperationalStatus) => void;
  simulateStateChange: (updates: Partial<StationDataState>) => void;
  isStale: boolean;
  secondsSinceLastHeartbeat: number | null;
  refreshTelemetry: () => void;
}

const DEFAULT_STALE_THRESHOLD_SECONDS = 10;

// Baseline initial state: Live Hardware mode starts in disconnected/standby
// to protect data integrity and avoid claiming unverified connectivity.
const initialStationState: StationDataState = {
  stationId: 'base-01',
  stationName: 'SolarSmart Base 01',
  operationalStatus: 'available',
  dataSourceMode: 'demo', // Defaults to demo for initial shell development, clearly labelled
  connectionStatus: 'connected',
  hardware: {
    esp32Gateway: true,
    arduinoLocal: true,
    ina219Sensor: true,
    rc522Reader: true,
    irVehicleSensor: false, // Marked uninstalled per hardware review
  },
  latestReadings: {
    voltage: null,
    current: null,
    power: null,
    vehicleDetected: null,
    solarActive: null,
    timestamp: null,
  },
  lastHeartbeat: new Date(),
  staleThresholdSeconds: DEFAULT_STALE_THRESHOLD_SECONDS,
  isLoading: false,
  errorMessage: null,
};

const StationDataContext = createContext<StationDataContextType | undefined>(undefined);

export const StationDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StationDataState>(initialStationState);
  const [secondsSinceLastHeartbeat, setSecondsSinceLastHeartbeat] = useState<number | null>(0);

  // Watchdog timer to track freshness and evaluate stale threshold
  useEffect(() => {
    const timer = setInterval(() => {
      if (state.lastHeartbeat) {
        const diffSeconds = Math.floor((Date.now() - state.lastHeartbeat.getTime()) / 1000);
        setSecondsSinceLastHeartbeat(diffSeconds);

        // Auto-update connection status to stale if threshold exceeded
        if (
          diffSeconds >= state.staleThresholdSeconds &&
          state.connectionStatus === 'connected' &&
          state.dataSourceMode === 'live'
        ) {
          setState((prev) => ({
            ...prev,
            connectionStatus: 'stale',
          }));
        }
      } else {
        setSecondsSinceLastHeartbeat(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [state.lastHeartbeat, state.staleThresholdSeconds, state.connectionStatus, state.dataSourceMode]);

  const setDataSourceMode = useCallback((mode: DataSourceMode) => {
    setState((prev) => {
      if (mode === 'live') {
        // When switching to Live mode, truthfully reflect that physical ESP32 gateway is not yet integrated
        return {
          ...prev,
          dataSourceMode: 'live',
          connectionStatus: 'unavailable',
          hardware: {
            esp32Gateway: false,
            arduinoLocal: false,
            ina219Sensor: false,
            rc522Reader: false,
            irVehicleSensor: false,
          },
          latestReadings: {
            voltage: null,
            current: null,
            power: null,
            vehicleDetected: null,
            solarActive: null,
            timestamp: null,
          },
          lastHeartbeat: null,
          errorMessage: 'Physical ESP32 gateway not detected. Live hardware telemetry will appear once controller is connected.',
        };
      } else {
        // When in Demo mode, provide clear mock status for UI testing
        return {
          ...prev,
          dataSourceMode: 'demo',
          connectionStatus: 'connected',
          hardware: {
            esp32Gateway: true,
            arduinoLocal: true,
            ina219Sensor: true,
            rc522Reader: true,
            irVehicleSensor: false,
          },
          lastHeartbeat: new Date(),
          errorMessage: null,
        };
      }
    });
  }, []);

  const setOperationalStatus = useCallback((status: StationOperationalStatus) => {
    setState((prev) => ({
      ...prev,
      operationalStatus: status,
      lastHeartbeat: new Date(),
    }));
  }, []);

  const simulateStateChange = useCallback((updates: Partial<StationDataState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
      lastHeartbeat: updates.lastHeartbeat !== undefined ? updates.lastHeartbeat : prev.lastHeartbeat,
    }));
  }, []);

  const refreshTelemetry = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lastHeartbeat: new Date(),
      connectionStatus: prev.dataSourceMode === 'demo' ? 'connected' : prev.connectionStatus,
    }));
  }, []);

  const isStale =
    secondsSinceLastHeartbeat !== null &&
    secondsSinceLastHeartbeat >= state.staleThresholdSeconds &&
    state.connectionStatus !== 'disconnected';

  return (
    <StationDataContext.Provider
      value={{
        state,
        setDataSourceMode,
        setOperationalStatus,
        simulateStateChange,
        isStale,
        secondsSinceLastHeartbeat,
        refreshTelemetry,
      }}
    >
      {children}
    </StationDataContext.Provider>
  );
};

export const useStationData = (): StationDataContextType => {
  const context = useContext(StationDataContext);
  if (!context) {
    throw new Error('useStationData must be used within a StationDataProvider');
  }
  return context;
};
