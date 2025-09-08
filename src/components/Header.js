import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTemplate } from "../context/TemplateContext";
import "./header.css";

const Navbar = () => {
  const { template, switchTemplate, agent, category, mainAgent } = useTemplate();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg px-3 py-2 py-md-3 ${
        template === "template2" ? "bg-white" : "bg-light"
      }`}
    >
      <div className="container-fluid">
        {/* Logo */}
        <a
          href="/"
          className="navbar-brand fw-semibold text-start font-poppins fs-5 fs-md-3"
          onClick={handleLogoClick}
        >
          {mainAgent.name}
        </a>

        {/* Mobile Toggle */}
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

        {/* Nav Links */}
        <div className="collapse navbar-collapse p-2" id="navcol-2">
          <ul className="navbar-nav ms-auto align-items-xl-center">
            <li className="nav-item">
              <Link className="nav-link text-nowrap fw-normal font-poppins fs-6 fs-md-5" to="/">
                Home
              </Link>
            </li>

            {category?.sale && (
              <li className="nav-item">
                <Link
                  className="nav-link text-nowrap fw-normal font-poppins fs-6 fs-md-5"
                  to="/search"
                  state={{ activeTab: "Buy", autoSearch: true }}
                >
                  Sale
                </Link>
              </li>
            )}

            {category?.rent && (
              <li className="nav-item">
                <Link
                  className="nav-link text-nowrap fw-normal font-poppins fs-6 fs-md-5"
                  to="/search"
                  state={{ activeTab: "Rent", autoSearch: true }}
                >
                  Rent
                </Link>
              </li>
            )}

            {category?.project && (
              <li className="nav-item">
                <Link
                  className="nav-link text-nowrap fw-normal font-poppins fs-6 fs-md-5"
                  to="/search"
                  state={{ activeTab: "New Project", autoSearch: true }}
                >
                  New Project
                </Link>
              </li>
            )}

            {category?.auction && (
              <li className="nav-item">
                <Link
                  className="nav-link text-nowrap fw-normal font-poppins fs-6 fs-md-5"
                  to="/search"
                  state={{ activeTab: "Auction", autoSearch: true }}
                >
                  Auction
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link text-nowrap fw-normal font-poppins fs-6 fs-md-5" to="/donedeal">
                Done Deals
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-nowrap fw-normal font-poppins fs-6 fs-md-5" to="/articles">
                Articles
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-nowrap fw-normal font-poppins fs-6 fs-md-5" to="/business-card">
                About Me
              </Link>
            </li>

            {/* Dropdown - I Want To */}
            {agent.i_want_to && (
              <li className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle text-nowrap fw-normal font-poppins fs-6 fs-md-5"
                  id="iWantToDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  I Want To
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 px-2">
                  <li>
                    <Link
                      className="dropdown-item font-poppins fs-6 fs-md-5"
                      to="/buy"
                      onClick={() => handleNavigate("/buy")}
                    >
                      Buy a Property (WTB)
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item font-poppins fs-6 fs-md-5" to="/buy">
                      Rent a Property (WTR)
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link
                      className="dropdown-item font-poppins fs-6 fs-md-5"
                      to="/i-want-to"
                      onClick={() => handleNavigate("/saleprops")}
                    >
                      Sell a Property (WTS)
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item font-poppins fs-6 fs-md-5"
                      to="/i-want-to"
                      onClick={() => handleNavigate("/saleprops")}
                    >
                      Buy a Property (WTB)
                    </Link>
                  </li>
                </ul>
              </li>
            )}

            {/* Tools */}
            {agent.tools && (
              <li className="nav-item">
                <Link className="nav-link text-nowrap fw-normal font-poppins fs-6 fs-md-5" to="/tools">
                  Tools
                </Link>
              </li>
            )}

            {/* Template Selector */}
            <li className="nav-item ms-3">
              <select
                className="form-select w-auto font-poppins fs-6 fs-md-5"
                value={template}
                onChange={(e) => switchTemplate(e.target.value)}
              >
                <option value="template1">Template 1</option>
                <option value="template2">Template 2</option>
                <option value="template3">Template 3</option>
                <option value="template4">Template 4</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
