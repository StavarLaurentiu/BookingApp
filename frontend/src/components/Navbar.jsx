// ...existing code...
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon, FaBars, FaTimes, FaUserShield, FaSignOutAlt } from "react-icons/fa";
import { ThemeContext } from "../contexts/ThemeContext";
import { useAdmin } from "../contexts/AdminContext";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import "./Navbar.css";
import "./AdminLogin.css";
import "./AdminDashboard.css";
import logo from '../../public/logo.jpeg';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAdminLoggedIn, adminUser, logout } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleAdminDashboard = () => {
    setShowAdminDashboard(true);
  };

  const handleAdminLogout = () => {
    logout();
  };

  return (
    <>
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
          
          {/* Admin section */}
          {isAdminLoggedIn ? (
            <div className="admin-section">
              <button 
                className="admin-dashboard-button" 
                onClick={handleAdminDashboard}
                title={`Welcome, ${adminUser?.username || 'Admin'}`}
              >
                <FaUserShield /> Dashboard
              </button>
              <button 
                className="admin-logout-button" 
                onClick={handleAdminLogout}
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <button 
              className="admin-login-button" 
              onClick={handleAdminLogin}
            >
              <FaUserShield /> Login
            </button>
          )}
          
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </nav>
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
      
      {/* Admin Dashboard Modal */}
      {showAdminDashboard && isAdminLoggedIn && (
        <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
      )}
    </>
  );
};

export default Navbar;
// ...existing code...