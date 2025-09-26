'use client';

import React from 'react';
import { clsx } from 'clsx';
import { ResponsiveContainer } from 'recharts';

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

interface ChartContainerProps {
  config: ChartConfig;
  children: React.ReactElement;
  className?: string;
}

export function ChartContainer({
  config,
  children,
  className,
}: ChartContainerProps) {
  React.useEffect(() => {
    const root = document.documentElement;
    Object.entries(config).forEach(([key, { color }]) => {
      root.style.setProperty(`--color-${key}`, color);
    });
  }, [config]);

  return (
    <div className={clsx('w-full', className)}>
      <ResponsiveContainer width='100%' height='100%'>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export type { ChartContainerProps };
