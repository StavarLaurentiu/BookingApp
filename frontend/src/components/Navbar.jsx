import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <h1>Hotel Booking</h1>
      <ul>
        <li>
          <Link to="">Home</Link>
        </li>
        <li>
          <Link to="all-rooms">All Rooms</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
