export type ActiveView = 'home' | 'user' | 'admin' | 'about';

export type DemoRole = 'user' | 'operator';

export interface NavItem {
  id: ActiveView;
  label: string;
  description: string;
  iconName: 'home' | 'user' | 'gauge' | 'info';
  requiredRole?: DemoRole;
}
