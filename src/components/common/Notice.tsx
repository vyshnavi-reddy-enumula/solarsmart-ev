import React from 'react';

interface NoticeProps {
  variant?: 'info' | 'warning' | 'simulated';
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}

export const Notice: React.FC<NoticeProps> = ({ variant = 'info', icon, title, children }) => (
  <div className={`notice ${variant === 'info' ? '' : `notice-${variant}`}`} role={variant === 'warning' ? 'alert' : 'status'}>
    {icon && <span className="mt-0.5 flex-shrink-0 text-[var(--color-primary)]">{icon}</span>}
    <div>
      <span className="notice-title">{title}</span>
      {children && <p className="mt-0.5">{children}</p>}
    </div>
  </div>
);
