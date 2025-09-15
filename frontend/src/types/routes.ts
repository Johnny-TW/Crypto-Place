import { ComponentType, ReactNode } from 'react';

// 路由配置相關型別
export interface RouteConfig {
  path: string;
  exact: boolean;
  layout: ComponentType<{ children: ReactNode }>;
  component: ComponentType;
  protected?: boolean;
  redirectIfAuthenticated?: boolean;
}

export type Routes = RouteConfig[];
