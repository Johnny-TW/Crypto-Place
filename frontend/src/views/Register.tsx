import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface RootState {
  auth: AuthState;
}

function Register() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth || {}
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 如果已經登入，重導向到 dashboard
  useEffect(() => {
    if (isAuthenticated) {
      history.replace('/dashboard');
    }
  }, [isAuthenticated, history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('密碼與確認密碼不相符');
      return;
    }
    dispatch({
      type: 'REGISTER_REQUEST',
      payload: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      },
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br to-slate-200 px-4'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='text-center space-y-2'>
          <div className='mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4'>
            <span className='text-2xl font-bold text-white'>CP</span>
          </div>
          <CardTitle className='text-2xl font-bold text-gray-800'>
            建立新帳戶
          </CardTitle>
          <CardDescription className='text-gray-600'>
            加入我們的加密貨幣平台
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>姓名</Label>
              <Input
                id='name'
                name='name'
                type='text'
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder='請輸入您的姓名'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>電子郵件</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder='請輸入您的電子郵件'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>密碼</Label>
              <Input
                id='password'
                name='password'
                type='password'
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder='請輸入密碼'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>確認密碼</Label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder='請再次輸入密碼'
              />
            </div>

            {error ? (
              <div className='text-red-600 text-sm text-center bg-red-50 p-2 rounded'>
                {error}
              </div>
            ) : null}

            <Button
              type='submit'
              className='w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              disabled={isLoading}
            >
              {isLoading ? '註冊中...' : '建立帳戶'}
            </Button>
          </form>

          <div className='text-center pt-4 border-t'>
            <p className='text-sm text-gray-600'>
              已經有帳戶了？{' '}
              <button
                type='button'
                onClick={() => history.push('/login')}
                className='text-blue-600 hover:text-blue-800 font-medium'
              >
                立即登入
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
