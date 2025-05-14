// ...existing code...
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
      {/* Hotel Booking and logo now link to the homepage */}
      <Link to="" className="navbar-left" onClick={closeMenu}>
        <img src={logo} className="navbar-logo" alt="Logo" />
        <h1>Reservo</h1>
      </Link>
      
      <div className="navbar-mobile-toggle" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
      
      {/* navbar-center list is now empty as Home is removed and All Rooms is moved. */}
      {/* This will result in an empty mobile dropdown menu. */}
      <ul className={`navbar-center ${menuOpen ? 'active' : ''}`}>
        {/* Home link removed */}
        {/* All Rooms link moved to navbar-right */}
      </ul>
      
      <div className="navbar-right">
        {/* All Rooms link moved here */}
        <Link to="all-rooms" className="nav-link-all-rooms" onClick={closeMenu}> 
          All Rooms
        </Link>
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
// ...existing code...