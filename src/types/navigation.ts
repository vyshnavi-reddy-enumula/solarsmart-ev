export type ActiveView = 'home' | 'my-ev' | 'stations' | 'energy' | 'manage';

export type DemoRole = 'user' | 'operator';

export interface NavItem {
  id: ActiveView;
  label: string;
  shortLabel: string;
  /** Only shown when the demo role switcher is set to Operator. Not secure access control. */
  operatorOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home' },
  { id: 'my-ev', label: 'My EV', shortLabel: 'My EV' },
  { id: 'stations', label: 'Find Stations', shortLabel: 'Stations' },
  { id: 'energy', label: 'Energy', shortLabel: 'Energy' },
  { id: 'manage', label: 'Station Management', shortLabel: 'Manage', operatorOnly: true },
];
