// Redux 相關型別定義
export interface HRData {
  employeeId: string;
  department: string;
  position: string;
  [key: string]: any;
}

export interface User {
  id: string;
  email: string;
  name: string;
  enName?: string;
  chName?: string;
  loginType?: 'user' | 'employee';
  hrData?: HRData;
}

// Auth State
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
  hrData: HRData | null;
  loginType: 'user' | 'employee' | null;
}

// Action Types
export interface AuthAction {
  type: string;
  payload?: any;
}

// API 相關型別
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface EmployeeLoginData {
  employeeId: string;
  password: string;
}

export interface APIResponse<T = any> {
  data: T;
}

export interface AuthResponse {
  access_token: string;
  user: User;
  hrData?: HRData;
}

// Saga Action Types
export interface LoginAction {
  type: 'LOGIN_REQUEST';
  payload: LoginCredentials;
}

export interface RegisterAction {
  type: 'REGISTER_REQUEST';
  payload: RegisterData;
}

export interface EmployeeLoginAction {
  type: 'EMPLOYEE_LOGIN_REQUEST';
  payload: EmployeeLoginData;
}

export interface LogoutAction {
  type: 'LOGOUT_REQUEST';
}

export interface CheckAuthAction {
  type: 'CHECK_AUTH_STATUS';
}

export type AuthSagaAction =
  | LoginAction
  | RegisterAction
  | EmployeeLoginAction
  | LogoutAction
  | CheckAuthAction;

// 通用 Action 型別
export interface BaseAction {
  type: string;
  payload?: any;
  error?: any;
  data?: any;
}

// 加密貨幣相關型別
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  [key: string]: any;
}

export interface CryptoState {
  loading: boolean;
  coinList: CryptoData[];
  error: string | null;
}

// NFT 相關型別
export interface NFTData {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  [key: string]: any;
}

export interface NFTState {
  loading: boolean;
  data: NFTData[];
  error: string | null;
}

// 加密貨幣詳情狀態
export interface CryptoDetailsState {
  loading: boolean;
  cryptoDetails: any;
  error: string | null;
}

// 加密貨幣圖表狀態
export interface CryptoChartState {
  loading: boolean;
  data: any;
  error: string | null;
}

// 加密貨幣新聞狀態
export interface CryptoNewsState {
  loading: boolean;
  news: any[];
  error: string | null;
}

// 加密貨幣市場列表狀態
export interface CryptoMarketListState {
  loading: boolean;
  data: any[];
  error: string | null;
}

// 加密貨幣交易所詳情狀態
export interface CryptoExchangesDetailsState {
  loading: boolean;
  data: any;
  error: string | null;
}

// NFT 詳情狀態
export interface NFTDetailsState {
  loading: boolean;
  data: any;
  error: string | null;
}

// 員工資訊狀態
export interface EmployeeInfoState {
  loading: boolean;
  data: any;
  error: string | null;
}

// 觀察清單狀態
export interface WatchlistState {
  loading: boolean;
  data: any[];
  error: string | null;
  statusMap?: Record<string, boolean>;
}

// 根狀態型別
export interface RootState {
  auth: AuthState;
  coinList: CryptoState;
  cryptoNews: CryptoNewsState;
  cryptoDetails: CryptoDetailsState;
  cryptoDetailsChart: CryptoChartState;
  cryptoMarketList: CryptoMarketListState;
  cryptoExchangesDetails: CryptoExchangesDetailsState;
  nftDashboard: NFTState;
  nftDetails: NFTDetailsState;
  employeeInfo: EmployeeInfoState;
  watchlist: WatchlistState;
}
