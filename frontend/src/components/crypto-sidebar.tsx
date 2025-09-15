'use client';

import * as React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Newspaper,
  TrendingUp,
  Wallet,
  Activity,
  Building,
} from 'lucide-react';
import ENBGFavicon from '@/images/svg/ENBG_favicon.svg';

import NavMain from '@/components/nav-main';
import NavProjects from '@/components/nav-projects';
import NavUser from '@/components/nav-user';
import TeamSwitcher from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

export default function CryptoSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const history = useHistory();

  const handleNavigation = (url: string) => {
    history.push(url);
  };

  // 加密貨幣相關的團隊/組織數據
  const cryptoTeams = [
    {
      name: 'EE40 - Crypto Place',
      logo: () => (
        <img src={ENBGFavicon} alt='ENBG Logo' width={24} height={24} />
      ),
      plan: 'DEV 1.0',
    },
    {
      name: 'Trading Hub',
      logo: TrendingUp,
      plan: 'Premium',
    },
    {
      name: 'Portfolio Tracker',
      logo: Wallet,
      plan: 'Free',
    },
  ];

  // 主要導航數據 - 針對加密貨幣市場
  const cryptoNavMain = [
    {
      title: '市場概覽',
      url: '/dashboard',
      icon: Home,
      isActive: true,
      items: [
        {
          title: '加密貨幣市場',
          url: '/dashboard',
        },
        // {
        //   title: '市場趨勢',
        //   url: '/trends',
        // },
        // {
        //   title: '熱門幣種',
        //   url: '/trending',
        // },
      ],
    },
    {
      title: '交易所',
      url: '/exchanges',
      icon: Building,
      items: [
        {
          title: '交易所列表',
          url: '/exchanges',
        },
        // {
        //   title: '交易對分析',
        //   url: '/trading-pairs',
        // },
        // {
        //   title: '手續費比較',
        //   url: '/fees-comparison',
        // },
      ],
    },
    {
      title: 'NFT 市場',
      url: '/NFTDashboard',
      icon: Activity,
      items: [
        {
          title: 'NFT 總覽',
          url: '/NFTDashboard',
        },
        // {
        //   title: '熱門收藏',
        //   url: '/nft-collections',
        // },
        // {
        //   title: '市場統計',
        //   url: '/nft-stats',
        // },
      ],
    },
    {
      title: '資訊中心',
      url: '/CryptoNews',
      icon: Newspaper,
      items: [
        {
          title: '加密貨幣新聞',
          url: '/CryptoNews',
        },
        {
          title: 'API 文檔',
          url: '/api',
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
