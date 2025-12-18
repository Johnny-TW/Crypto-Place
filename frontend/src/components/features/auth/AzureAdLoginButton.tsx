import { Button } from '@/components/ui';
import { AZURE_LOGIN_URL } from '@/config/azureAdConfig';

interface AzureAdLoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
  className?: string;
}

export const AzureAdLoginButton = ({
  variant = 'outline',
  size = 'lg',
  fullWidth = false,
  className = '',
}: AzureAdLoginButtonProps) => {
  const handleAzureLogin = () => {
    // 直接重導向到 backend 的 Azure AD 登入端點
    window.location.href = AZURE_LOGIN_URL;
  };

  return (
    <Button
      type='button'
      variant={variant}
      size={size}
      onClick={handleAzureLogin}
      className={`flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {/* Microsoft Logo SVG */}
      <svg
        width='20'
        height='20'
        viewBox='0 0 23 23'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <rect x='1' y='1' width='10' height='10' fill='#F25022' />
        <rect x='12' y='1' width='10' height='10' fill='#7FBA00' />
        <rect x='1' y='12' width='10' height='10' fill='#00A4EF' />
        <rect x='12' y='12' width='10' height='10' fill='#FFB900' />
      </svg>
      <span>使用 Microsoft 帳戶登入</span>
    </Button>
  );
};

export default AzureAdLoginButton;
