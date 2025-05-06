import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from '../../public/logo.jpeg'

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} className="navbar-logo" alt="Logo" />
        <h1>Hotel Booking</h1>
      </div>
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
