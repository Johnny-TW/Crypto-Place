import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';

// 定義選項卡類型
type ActiveTab = 'user' | 'employee';

// 定義 Redux 狀態介面
interface AuthState {
  isLoading: boolean;
  error: string | null;
}

interface RootState {
  auth: AuthState;
}

function Login(): JSX.Element {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(
    (state: RootState) => state.auth || {}
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('user');
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [employeeFormData, setEmployeeFormData] = useState({
    employeeId: '',
  });

  const handleUserLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    dispatch({ type: 'LOGIN_REQUEST', payload: userFormData });
  };

  const handleEmployeeLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    dispatch({ type: 'EMPLOYEE_LOGIN_REQUEST', payload: employeeFormData });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br to-slate-200 px-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <img
              src='/src/images/svg/ENBG_logo.svg'
              alt='Crypto Place'
              className='h-16 w-auto'
            />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            歡迎回到 Crypto Place
          </h1>
          <p className='text-gray-600'>登入您的帳戶以開始使用</p>
        </div>

        <Card className='shadow-md border-0'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl text-center'>登入</CardTitle>
            <CardDescription className='text-center'>
              選擇您的帳戶類型
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={value => setActiveTab(value as ActiveTab)}
            >
              <TabsList className='grid w-full grid-cols-2 mb-8'>
                <TabsTrigger value='user' className='flex items-center gap-2'>
                  一般使用者
                </TabsTrigger>
                <TabsTrigger
                  value='employee'
                  className='flex items-center gap-2'
                >
                  員工登入
                </TabsTrigger>
              </TabsList>

              <TabsContent value='user' className='space-y-4'>
                <form onSubmit={handleUserLogin} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='user-email'>電子郵件</Label>
                    <Input
                      id='user-email'
                      type='email'
                      placeholder='輸入您的電子郵件'
                      value={userFormData.email}
                      onChange={e =>
                        setUserFormData({
                          ...userFormData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='user-password'>密碼</Label>
                    <Input
                      id='user-password'
                      type='password'
                      placeholder='輸入您的密碼'
                      value={userFormData.password}
                      onChange={e =>
                        setUserFormData({
                          ...userFormData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {error ? (
                    <div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>
                      {error}
                    </div>
                  ) : null}
                  <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? '登入中...' : '使用者登入'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value='employee' className='space-y-4'>
                <form onSubmit={handleEmployeeLogin} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='employee-id'>員工工號</Label>
                    <Input
                      id='employee-id'
                      type='text'
                      placeholder='請輸入8位數字工號例如:11003736'
                      value={employeeFormData.employeeId}
                      onChange={e =>
                        setEmployeeFormData({
                          employeeId: e.target.value.replace(/\D/g, ''),
                        })
                      }
                      maxLength={8}
                      pattern='[0-9]{8}'
                      title='請輸入8位數字的員工工號'
                      required
                    />
                    <p className='text-xs text-muted-foreground'>
                      請輸入8位純數字工號(如:11003736)
                    </p>
                  </div>
                  {error ? (
                    <div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>
                      {error}
                    </div>
                  ) : null}
                  <Button
                    type='submit'
                    className='w-full'
                    disabled={
                      isLoading || employeeFormData.employeeId.length !== 8
                    }
                  >
                    {isLoading ? '登入中...' : '員工登入'}
                  </Button>
                  <div className='text-center'>
                    <p className='text-xs text-muted-foreground'>
                      輸入工號即可直接登入，無需密碼
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className='mt-6 text-center'>
              <p className='text-sm text-muted-foreground'>
                還沒有帳戶？{' '}
                <a
                  href='/register'
                  className='text-primary hover:underline font-medium'
                >
                  立即註冊
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
