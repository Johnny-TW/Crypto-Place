'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export default function NavUser() {
  // Safe sidebar context usage
  let isMobile = false;
  try {
    const sidebarContext = useSidebar();
    isMobile = sidebarContext.isMobile;
  } catch (error) {
    console.warn('NavUser: useSidebar hook failed, using fallback', error);
  }

  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT_REQUEST' });
  };

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User size={20} className='mr-2' />
                員工編號: {user.emplId || 'N/A'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sparkles size={20} className='mr-2' />
                職稱: {user.jobTitle || 'N/A'}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck size={20} className='mr-2' />
                部門: {user.deptDescr || 'N/A'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard size={20} className='mr-2' />
                辦公室: {user.office || 'N/A'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell size={20} className='mr-2' />
                分機: {user.phone || 'N/A'}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User size={20} className='mr-2' />
                角色: {user.role || 'N/A'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BadgeCheck size={20} className='mr-2' />
                狀態: {user.isActive ? '啟用' : '停用'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard size={20} className='mr-2' />
                註冊時間:{' '}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('zh-TW')
                  : 'N/A'}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut size={20} className='mr-2' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
