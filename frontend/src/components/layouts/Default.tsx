import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import CryptoSidebar from '@/components/crypto-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Footer from './Footer';

interface DefaultProps {
  children: React.ReactNode;
}

interface AuthState {
  isAuthenticated?: boolean;
  user?: {
    name?: string;
    email?: string;
  } | null;
}

interface RootState {
  auth?: AuthState;
}

function Default({ children }: DefaultProps) {
  const history = useHistory();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth || {}
  );

  // Helper function to get current page title based on path
  const getCurrentPageTitle = (pathname: string): string => {
    const pathMap: { [key: string]: string } = {
      '/dashboard': '市場概覽',
      '/home': '首頁',
      '/exchanges': '交易所',
      '/NFTDashboard': 'NFT 市場',
      '/CryptoNews': '加密貨幣新聞',
      '/api': 'API 文檔',
      '/trends': '市場趨勢',
      '/portfolio': '投資組合',
    };

    // Check for dynamic routes
    if (pathname.startsWith('/Crypto-details/')) {
      return '加密貨幣詳情';
    }
    if (pathname.startsWith('/NFT-details/')) {
      return 'NFT 詳情';
    }
    if (pathname.startsWith('/exchanges-details/')) {
      return '交易所詳情';
    }

    return pathMap[pathname] || '頁面';
  };

  // 如果未登入，使用原本的簡單布局
  if (!isAuthenticated) {
    return (
      <div className='flex flex-col min-h-screen'>
        <main className='flex-grow container mx-auto px-4 py-8'>
          <div className='col-span-12 lg:col-span-10 xl:col-span-10'>
            {children}
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full bg-background'>
        <CryptoSidebar
          user={{
            name: user?.name || '使用者',
            email: user?.email || 'user@example.com',
          }}
        />

        <SidebarInset className='flex flex-col flex-1'>
          {/* Header with sidebar trigger and breadcrumb */}
          <header className='flex h-16 shrink-0 items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='/dashboard'>
                    Crypto Place
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {getCurrentPageTitle(history.location.pathname)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Main content */}
          <main className='flex-1 overflow-auto p-6'>{children}</main>

          {/* Footer */}
          <footer className='border-t p-4'>
            <Footer />
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default Default;
