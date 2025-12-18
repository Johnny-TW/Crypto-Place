import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const AzureAdCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing'
  );

  useEffect(() => {
    const processCallback = async () => {
      try {
        // 從 URL 取得 token
        const token = searchParams.get('token');

        if (!token) {
          throw new Error('未收到認證 Token');
        }

        // 保存 token 到 cookie
        Cookies.set('token', token, { expires: 1 });

        // 更新 Redux 狀態
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token },
        });

        setStatus('success');

        // 顯示成功訊息
        await Swal.fire({
          icon: 'success',
          title: '登入成功！',
          text: '歡迎使用 Microsoft 帳戶登入',
          timer: 2000,
          showConfirmButton: false,
        });

        // 重導向到首頁或儀表板
        navigate('/dashboard');
      } catch (error: any) {
        console.error('Azure AD callback error:', error);
        setStatus('error');

        await Swal.fire({
          icon: 'error',
          title: '登入失敗',
          text: error.message || 'Azure AD 登入處理失敗，請重試',
        });

        // 重導向回登入頁
        navigate('/login');
      }
    };

    processCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>
            {status === 'processing' && '正在處理 Azure AD 登入...'}
            {status === 'success' && '登入成功！'}
            {status === 'error' && '登入失敗'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center gap-4'>
            {status === 'processing' && (
              <>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
                <p className='text-sm text-muted-foreground'>
                  請稍候，正在驗證您的 Microsoft 帳戶...
                </p>
              </>
            )}
            {status === 'success' && (
              <>
                <svg
                  className='w-16 h-16 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                <p className='text-sm text-muted-foreground'>
                  正在跳轉到儀表板...
                </p>
              </>
            )}
            {status === 'error' && (
              <>
                <svg
                  className='w-16 h-16 text-red-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
                <p className='text-sm text-muted-foreground'>
                  登入處理失敗，正在返回登入頁...
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AzureAdCallback;
