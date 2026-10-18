export type StationOperationalStatus = 'available' | 'charging' | 'offline' | 'maintenance';

export type DataSourceMode = 'live' | 'demo';

export type ConnectionStatus = 'connected' | 'disconnected' | 'stale' | 'unavailable';

export interface HardwareLinkStatus {
  esp32Gateway: boolean;
  arduinoLocal: boolean;
  ina219Sensor: boolean;
  rc522Reader: boolean;
  irVehicleSensor: boolean;
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
