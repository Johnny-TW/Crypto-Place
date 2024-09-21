import React from 'react'
import { useContext } from 'react';
import Logo from '../../assets/logo.png'
import ArrowIcon from '../../assets/arrow_icon.png'
import { CoinContext } from '../../context/CoinContext.jsx'
import './Navbar.scss'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const { setCurrency } = useContext(CoinContext)

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd": {
        setCurrency({
          name: 'usd',
          symbol: '$'
        })
        break;
      }
      case "eur": {
        setCurrency({
          name: 'eur',
          symbol: '€'
        })
        break;
      }
      case "inr": {
        setCurrency({
          name: 'inr',
          symbol: '₹'
        })
        break;
      }
      default: {
        setCurrency({
          name: 'usd',
          symbol: '$'
        })
        break;
      }
    }
  }

  return (
    <div className='Navbar' >
      <Link to={'/'}>
        <img className="Logo" src={Logo} alt="" />
      </Link>
      <ul>
        <Link to={'/'}>
          <li>Home</li>
        </Link>
        <li>Fetures</li>
        <li>Practing </li>
        <li>Blog</li>
      </ul>
      <div className="nav-right">
        <select className="" onChange={currencyHandler} name="" id="">
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>
        <button>
          Sign up
          <img src={ArrowIcon} alt="" />
        </button>
      </div>
    </div>
  )
}

export default Navbar