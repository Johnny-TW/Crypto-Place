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
import { AzureAdLoginButton } from '@/components/features/auth';

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
    email: '',
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
              alt='EE40 - Crypto Place'
              className='h-16 w-auto'
            />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            歡迎回到 EE40 - Crypto Place
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
                          ...employeeFormData,
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
                  <div className='space-y-2'>
                    <Label htmlFor='employee-email'>公司 Email</Label>
                    <Input
                      id='employee-email'
                      type='email'
                      placeholder='請輸入公司 Email (例如: johnny_yeh@wistron.com)'
                      value={employeeFormData.email}
                      onChange={e =>
                        setEmployeeFormData({
                          ...employeeFormData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    <p className='text-xs text-muted-foreground'>
                      需與 HR 系統中的 Email 一致
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
                      isLoading ||
                      employeeFormData.employeeId.length !== 8 ||
                      !employeeFormData.email
                    }
                  >
                    {isLoading ? '登入中...' : '員工登入'}
                  </Button>
                  <div className='text-center'>
                    <p className='text-xs text-muted-foreground'>
                      使用工號 + Email 驗證身份 🔒
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            {/* Azure AD 登入區塊 */}
            <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-white px-2 text-muted-foreground'>
                    或使用
                  </span>
                </div>
              </div>

              <div className='mt-4'>
                <AzureAdLoginButton fullWidth />
              </div>
            </div>

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
