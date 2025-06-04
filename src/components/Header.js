import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <a
        href="/"
        className="navbar-brand"
        onClick={handleLogoClick}
        style={{ textDecoration: "none", color: "black", fontSize: "20px" }}
      >
        PropMall
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <div className="navbar-nav ms-auto d-flex align-items-center gap-2">
          <div className="nav-item">
            <Link to="/" className="nav-link">For Sale</Link>
          </div>
          <div className="nav-item">
            <Link to="/" className="nav-link">For Rent</Link>
          </div>
          <div className="nav-item">
            <Link to="/" className="nav-link">New Project</Link>
          </div>

          <div className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              id="iWantToDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ textDecoration: "none" }}
            >
              I Want To
            </button>
            <ul className="dropdown-menu" aria-labelledby="iWantToDropdown">
              <li><Link className="dropdown-item" to="/sell">Sell a Property</Link></li>
              <li><Link className="dropdown-item" to="/rent-out">Rent Out a Property</Link></li>
              <li><Link className="dropdown-item" to="/buy">Buy a Property</Link></li>
            </ul>
          </div>

          <div className="nav-item">
            <Link to="/" className="nav-link">Articles</Link>
          </div>

          <div className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              id="signUpDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ textDecoration: "none" }}
            >
              Sign Up
            </button>
            <ul className="dropdown-menu" aria-labelledby="signUpDropdown">
              <li><Link className="dropdown-item" to="/signup-user">As Buyer</Link></li>
              <li><Link className="dropdown-item" to="/signup-agent">As Agent</Link></li>
            </ul>
          </div>

          {/* Fixed width container to prevent shifting */}
          <div
            className="nav-item"
            style={{ width: "80px", textAlign: "center" }} // ✅ Ensures space is reserved
          >
            {!isLoggedIn ? (
              <button
                className="btn btn-link nav-link"
                onClick={login}
                style={{
                  padding: 0,
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                }}
              >
                Log In
              </button>
            ) : (
              <button
                className="btn btn-link nav-link"
                onClick={logout}
                style={{
                  padding: 0,
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                }}
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
