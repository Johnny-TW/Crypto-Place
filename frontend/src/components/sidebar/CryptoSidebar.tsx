'use client';

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Newspaper,
  TrendingUp,
  Wallet,
  Activity,
  BadgeDollarSign,
  Building2,
  Link,
} from 'lucide-react';
import ENBGFavicon from '@/images/svg/ENBG_favicon.svg';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain, NavProjects } from './navigation';
import NavUser from './user';
import TeamSwitcher from './team';

export default function CryptoSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();

  const handleNavigation = (url: string, isExternal?: boolean) => {
    if (isExternal || url.startsWith('http://') || url.startsWith('https://')) {
      // 對於外部連結，使用 window.open 在新分頁開啟
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // 對於內部路由，使用 React Router
      navigate(url);
    }
  };

  // 加密貨幣相關的團隊/組織數據
  const cryptoTeams = [
    {
      name: 'EE40 - Crypto Place',
      logo: () => (
        <img src={ENBGFavicon} alt='ENBG Logo' width={24} height={24} />
      ),
      plan: 'DEV 1.0',
      isExternal: true,
    },
  ];

  // 主要導航數據 - 針對加密貨幣市場
  const cryptoNavMain = [
    {
      title: 'Cryptocurrencies',
      url: '/dashboard',
      icon: Home,
      items: [
        {
          title: 'Crypto Market',
          url: '/dashboard',
        },
      ],
    },
    {
      title: 'Exchanges',
      url: '/exchanges',
      icon: BadgeDollarSign,
      items: [
        {
          title: 'Crypto Exchanges',
          url: '/exchanges',
        },
      ],
    },
    {
      title: 'NFT',
      url: '/NFTDashboard',
      icon: Activity,
      items: [
        {
          title: 'NFT Floor Price',
          url: '/NFTDashboard',
        },
      ],
    },
    {
      title: 'Learn',
      url: '/CryptoNews',
      icon: Newspaper,
      items: [
        {
          title: 'Crypto News',
          url: '/CryptoNews',
        },
      ],
    },
    {
      title: 'API',
      url: '/CryptoNews',
      icon: Link,
      items: [
        {
          title: 'Crypto API',
          url: '/api',
        },
      ],
    },
    {
      title: 'Others',
      url: '/CryptoNews',
      icon: Building2,
      items: [
        {
          title: 'Team Roaster',
          url: 'http://10.32.48.118:50005/',
        },
        {
          title: 'ENBG workplace',
          url: 'https://enbgworkplace.wistron.com/',
        },
      ],
    },
  ];

  // 項目/工具數據
  const cryptoProjects = [
    {
      name: '價格追踪',
      url: '/price-tracking',
      icon: TrendingUp,
    },
    {
      name: '投資組合',
      url: '/portfolio',
      icon: Wallet,
    },
    {
      name: '市場分析',
      url: '/analysis',
      icon: BarChart3,
    },
  ];

  // 增強的導航處理，包含點擊事件
  const enhancedNavMain = cryptoNavMain.map(item => ({
    ...item,
    items: item.items?.map(subItem => ({
      ...subItem,
      onClick: () => handleNavigation(subItem.url),
    })),
  }));

  const enhancedProjects = cryptoProjects.map(project => ({
    ...project,
    onClick: () => handleNavigation(project.url),
  }));

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={cryptoTeams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={enhancedNavMain} />
        <NavProjects projects={enhancedProjects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
