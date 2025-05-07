import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { ThemeContext } from "../contexts/ThemeContext";
import "./Navbar.css";
import logo from '../../public/logo.jpeg';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} className="navbar-logo" alt="Logo" />
        <h1>Hotel Booking</h1>
      </div>
      
      <div className="navbar-mobile-toggle" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
      
      <ul className={`navbar-center ${menuOpen ? 'active' : ''}`}>
        <li>
          <Link to="" onClick={closeMenu}>Home</Link>
        </li>
        <li>
          <Link to="all-rooms" onClick={closeMenu}>All Rooms</Link>
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
