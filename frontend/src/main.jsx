import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.scss'
import CoinContextProvider from './context/CoinContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter >
    <CoinContextProvider>
      <App />
    </CoinContextProvider>
  </BrowserRouter>
)