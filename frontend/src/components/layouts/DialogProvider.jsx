import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '../../redux/saga/auth';

function DialogProvider(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    // 檢查用戶登入狀態 (使用你的 JWT token 認證)
    dispatch(checkAuthStatus());

    // 如果需要載入其他初始數據，可以在這裡添加
    // dispatch({ type: 'FETCH_CRYPTO_DATA' });
    // dispatch({ type: 'FETCH_NFT_DATA' });
  }, [dispatch]);

  return (
    <div>
      <div {...props} />
    </div>
  );
}

export default DialogProvider;
