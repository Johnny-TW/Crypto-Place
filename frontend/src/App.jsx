import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Footer from './components/layouts/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Coin from './pages/Coin/Coin.jsx'
import Header from './components/layouts/Header.jsx'

function App() {
  return (
    <div className='app'>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/coin/:coinId' element={<Coin />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App