import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white">
      <div className="container-fluid">
        {/* Brand/logo */}
        <a
          href="/"
          className="navbar-brand fs-5 fw-semibold text-start"
          onClick={handleLogoClick}
          style={{ fontFamily: "Poppins, sans-serif", cursor: "pointer" }}
        >
          TeslaAgent
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navcol-2"
          aria-controls="navcol-2"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse fs-6 fw-normal bg-light-subtle p-2"
          id="navcol-2"
        >
          <ul className="navbar-nav ms-auto align-items-xl-center">
            <li className="nav-item">
              <Link className="nav-link text-nowrap" to="/">
                Sale
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-nowrap" to="/rent">
                Rent
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-nowrap" to="/new-project">
                New Project
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-nowrap" to="/articles">
                Articles
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-nowrap" to="/about">
                About Me
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-nowrap" to="/donedeal">
                Done Deals
              </Link>
            </li>

            <li className="nav-item dropdown d-xl-flex">
              <button
                className="dropdown-toggle nav-link active text-nowrap btn btn-link"
                id="iWantToDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ textDecoration: "none" }}
              >
                I Want To
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end border-0 px-2"
                aria-labelledby="iWantToDropdown"
              >
                <li>
                  <Link className="dropdown-item" to="/buy">
                    Buy a Property
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/rent">
                    Rent a Property
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/sell">
                    Sell a Property
                  </Link>
                </li>
                {!isLoggedIn && (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/signup">
                        Sign Up
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/login">
                        Log In
                      </Link>
                    </li>
                  </>
                )}
                {isLoggedIn && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      Log Out
                    </button>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
