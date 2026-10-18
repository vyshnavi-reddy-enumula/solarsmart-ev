export type StationOperationalStatus = 'available' | 'charging' | 'offline' | 'maintenance' | 'unknown';

export type DataSourceMode = 'live' | 'demo';

export type ConnectionStatus = 'connected' | 'disconnected' | 'stale' | 'unavailable';

// 'connected' is reserved for links verified by a real data source.
// 'simulated' = demo mode only. 'unavailable' = not connected / not integrated.
export type NodeLinkStatus = 'connected' | 'simulated' | 'unavailable';

// How a displayed value should be labelled in the UI.
export type ReadingKind = 'live' | 'derived' | 'simulated' | 'unavailable' | 'stale';

export interface HardwareLinkStatus {
  esp32Gateway: NodeLinkStatus;
  arduinoLocal: NodeLinkStatus;
  ina219Sensor: NodeLinkStatus;
  rc522Reader: NodeLinkStatus;
  irVehicleSensor: NodeLinkStatus;
}

export interface TelemetryReadings {
  voltage: number | null; // in Volts
  current: number | null; // in mA
  power: number | null;   // in Watts (derived or measured)
  vehicleDetected: boolean | null;
  solarActive: boolean | null;
  timestamp: Date | null;
}

export interface StationDataState {
  stationId: 'base-01';
  stationName: 'SolarSmart Base 01';
  operationalStatus: StationOperationalStatus;
  dataSourceMode: DataSourceMode;
  connectionStatus: ConnectionStatus;
  hardware: HardwareLinkStatus;
  latestReadings: TelemetryReadings;
  lastHeartbeat: Date | null;
  staleThresholdSeconds: number; // 10 seconds per approved spec
  isLoading: boolean;
  errorMessage: string | null;
}
