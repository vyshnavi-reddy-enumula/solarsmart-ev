import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  StationDataState,
  DataSourceMode,
  StationOperationalStatus,
  HardwareLinkStatus,
  TelemetryReadings,
} from '../types/station';

interface StationDataContextType {
  state: StationDataState;
  setDataSourceMode: (mode: DataSourceMode) => void;
  setOperationalStatus: (status: StationOperationalStatus) => void;
  simulateStateChange: (updates: Partial<StationDataState>) => void;
  /** Demo only: force the simulated heartbeat to go stale. */
  simulateStale: () => void;
  /** Demo only: clear a forced stale condition and refresh the simulated heartbeat. */
  refreshTelemetry: () => void;
  simulatedStale: boolean;
  isStale: boolean;
  secondsSinceLastHeartbeat: number | null;
}

const DEFAULT_STALE_THRESHOLD_SECONDS = 10;
const DEMO_TICK_MS = 3000;

// Demo fixture. These values are SIMULATED and must always be labelled as such in the UI.
// Vehicle presence and solar state stay null: no sensor for them is confirmed.
const makeDemoReadings = (): TelemetryReadings => {
  const voltage = 4.92; // V
  const current = 380; // mA
  return {
    voltage,
    current,
    power: Number(((voltage * current) / 1000).toFixed(2)), // derived P = V x I
    vehicleDetected: null,
    solarActive: null,
    timestamp: new Date(),
  };
};

const EMPTY_READINGS: TelemetryReadings = {
  voltage: null,
  current: null,
  power: null,
  vehicleDetected: null,
  solarActive: null,
  timestamp: null,
};

const DEMO_HARDWARE: HardwareLinkStatus = {
  esp32Gateway: 'simulated',
  arduinoLocal: 'simulated',
  ina219Sensor: 'simulated',
  rc522Reader: 'simulated',
  irVehicleSensor: 'unavailable', // presence sensor is not integrated
};

const LIVE_HARDWARE: HardwareLinkStatus = {
  esp32Gateway: 'unavailable',
  arduinoLocal: 'unavailable',
  ina219Sensor: 'unavailable',
  rc522Reader: 'unavailable',
  irVehicleSensor: 'unavailable',
};

const initialStationState: StationDataState = {
  stationId: 'base-01',
  stationName: 'SolarSmart Base 01',
  operationalStatus: 'available', // simulated while in demo mode
  dataSourceMode: 'demo',
  connectionStatus: 'connected', // simulated link while in demo mode
  hardware: DEMO_HARDWARE,
  latestReadings: makeDemoReadings(),
  lastHeartbeat: new Date(),
  staleThresholdSeconds: DEFAULT_STALE_THRESHOLD_SECONDS,
  isLoading: false,
  errorMessage: null,
};

const StationDataContext = createContext<StationDataContextType | undefined>(undefined);

export const StationDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StationDataState>(initialStationState);
  const [simulatedStale, setSimulatedStale] = useState(false);
  const [secondsSinceLastHeartbeat, setSecondsSinceLastHeartbeat] = useState<number | null>(0);

  // Simulated heartbeat (demo only). Pauses while a stale condition is being simulated.
  useEffect(() => {
    if (state.dataSourceMode !== 'demo' || simulatedStale) return;
    const timer = setInterval(() => {
      setState((prev) =>
        prev.dataSourceMode === 'demo'
          ? { ...prev, lastHeartbeat: new Date(), connectionStatus: 'connected', latestReadings: makeDemoReadings() }
          : prev
      );
    }, DEMO_TICK_MS);
    return () => clearInterval(timer);
  }, [state.dataSourceMode, simulatedStale]);

  // Live mode: poll the backend. Only values the API actually returns are shown;
  // if the API is unreachable the station is reported as unavailable, never as connected.
  useEffect(() => {
    if (state.dataSourceMode !== 'live') return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/station/base-01');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = await res.json();
        if (cancelled) return;
        const toDate = (v: string | null) => (v ? new Date(v) : null);
        setSimulatedStale(false);
        setState((prev) =>
          prev.dataSourceMode !== 'live'
            ? prev
            : {
                ...prev,
                operationalStatus: d.operationalStatus,
                connectionStatus: d.connectionStatus,
                hardware: d.hardware,
                latestReadings: { ...d.latestReadings, timestamp: toDate(d.latestReadings.timestamp) },
                // Use the server's age, not its clock, so a wrong laptop clock cannot fake freshness.
                lastHeartbeat: d.secondsSinceHeartbeat === null ? null : new Date(Date.now() - d.secondsSinceHeartbeat * 1000),
                staleThresholdSeconds: d.staleThresholdSeconds,
                errorMessage:
                  d.connectionStatus === 'unavailable'
                    ? 'The backend is running but the station has not sent any data yet.'
                    : null,
              }
        );
      } catch {
        if (cancelled) return;
        setState((prev) =>
          prev.dataSourceMode !== 'live'
            ? prev
            : {
                ...prev,
                operationalStatus: 'unknown',
                connectionStatus: 'unavailable',
                hardware: LIVE_HARDWARE,
                latestReadings: EMPTY_READINGS,
                lastHeartbeat: null,
                errorMessage: 'Cannot reach the backend. Start the server and try again.',
              }
        );
      }
    };
    load();
    const timer = setInterval(load, 2000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [state.dataSourceMode]);

  // Freshness watchdog: evaluates the stale threshold for whichever source is active.
  useEffect(() => {
    const timer = setInterval(() => {
      if (!state.lastHeartbeat) {
        setSecondsSinceLastHeartbeat(null);
        return;
      }
      const diff = Math.floor((Date.now() - state.lastHeartbeat.getTime()) / 1000);
      setSecondsSinceLastHeartbeat(diff);
      if (diff >= state.staleThresholdSeconds && state.connectionStatus === 'connected') {
        setState((prev) => ({ ...prev, connectionStatus: 'stale' }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [state.lastHeartbeat, state.staleThresholdSeconds, state.connectionStatus]);

  const setDataSourceMode = useCallback((mode: DataSourceMode) => {
    setSimulatedStale(false);
    setState((prev) =>
      mode === 'live'
        ? {
            ...prev,
            dataSourceMode: 'live',
            operationalStatus: 'unknown', // never claim availability without a real source
            connectionStatus: 'unavailable',
            hardware: LIVE_HARDWARE,
            latestReadings: EMPTY_READINGS,
            lastHeartbeat: null,
            errorMessage: 'No live data source is connected. Readings will appear here once one is implemented and verified.',
          }
        : {
            ...prev,
            dataSourceMode: 'demo',
            operationalStatus: 'available',
            connectionStatus: 'connected',
            hardware: DEMO_HARDWARE,
            latestReadings: makeDemoReadings(),
            lastHeartbeat: new Date(),
            errorMessage: null,
          }
    );
  }, []);

  const setOperationalStatus = useCallback((status: StationOperationalStatus) => {
    setState((prev) => (prev.dataSourceMode === 'demo' ? { ...prev, operationalStatus: status } : prev));
  }, []);

  const simulateStateChange = useCallback((updates: Partial<StationDataState>) => {
    setState((prev) => (prev.dataSourceMode === 'demo' ? { ...prev, ...updates } : prev));
  }, []);

  const simulateStale = useCallback(() => {
    setSimulatedStale(true);
    setState((prev) =>
      prev.dataSourceMode === 'demo' ? { ...prev, lastHeartbeat: new Date(Date.now() - 15000) } : prev
    );
  }, []);

  const refreshTelemetry = useCallback(() => {
    setSimulatedStale(false);
    setState((prev) =>
      prev.dataSourceMode === 'demo'
        ? { ...prev, lastHeartbeat: new Date(), connectionStatus: 'connected', latestReadings: makeDemoReadings() }
        : prev
    );
  }, []);

  const isStale =
    secondsSinceLastHeartbeat !== null &&
    secondsSinceLastHeartbeat >= state.staleThresholdSeconds &&
    state.connectionStatus !== 'disconnected' &&
    state.connectionStatus !== 'unavailable';

  return (
    <StationDataContext.Provider
      value={{
        state,
        setDataSourceMode,
        setOperationalStatus,
        simulateStateChange,
        simulateStale,
        refreshTelemetry,
        simulatedStale,
        isStale,
        secondsSinceLastHeartbeat,
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
