// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../contexts/ThemeContext";
import "./Navbar.css";
import logo from '../../public/logo.jpeg';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} className="navbar-logo" alt="Logo" />
        <h1>Hotel Booking</h1>
      </div>
      
      <ul className="navbar-center">
        <li>
          <Link to="">Home</Link>
        </li>
        <li>
          <Link to="all-rooms">All Rooms</Link>
        </li>
      </ul>
      
      <div className="navbar-right">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme} 
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
