// components/Header.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTemplate } from "../context/TemplateContext"; // ✅ Import Template Context
import { getAgent } from "../api/axiosApi";
import './header.css'
const Navbar = () => {
  const { template, switchTemplate } = useTemplate(); // ✅ Use Template Context
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };
  // const [agent, setAgent] = useState({});
  // const [category, setCategory] = useState({});
  const { agent, category, mainAgent } = useTemplate();

  const handleNavigate = (path) => {
    // You can also add logic here if needed before navigating
    navigate(path);
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-white px-3"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      <div className="container-fluid">
        <a
          href="/"
          className="navbar-brand fs-5 fw-semibold text-start"
          onClick={handleLogoClick}
          style={{
            fontFamily: "Poppins, sans-serif",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          TESLA REALTY SDN. BHD
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
          className="collapse navbar-collapse fs-6 fw-normal p-2"
          id="navcol-2"
        >
          <ul className="navbar-nav ms-auto align-items-xl-center">
            <li className="nav-item">
              <Link
                className="nav-link text-nowrap"
                to="/"
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  fontFamily: "Poppins",
                }}
              >
                Home
              </Link>
            </li>
            {category?.sale && (
              <li className="nav-item">
                <Link
                  className="nav-link text-nowrap"
                  to="/search"
                  state={{ activeTab: "Buy", autoSearch: true }} // ✅ send desired active tab
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    fontFamily: "Poppins",
                  }}
                >
                  Sale
                </Link>
              </li>
            )}
            {category?.rent && (
              <li className="nav-item">
                <Link
                  className="nav-link text-nowrap"
                  to="/search"
                  state={{ activeTab: "Rent", autoSearch: true }} // ✅
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    fontFamily: "Poppins",
                  }}
                >
                  Rent
                </Link>
              </li>
            )}
            {category?.project && (
              <li className="nav-item">
                <Link
                  className="nav-link text-nowrap"
                  to="/search"
                  state={{ activeTab: "New Project", autoSearch: true }} // ✅
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    fontFamily: "Poppins",
                  }}
                >
                  New Project
                </Link>
              </li>
            )}
            {category?.auction && (
              <li className="nav-item">
                <Link
                  className="nav-link text-nowrap"
                  to="/search"
                  state={{ activeTab: "Auction", autoSearch: true }} // ✅
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    fontFamily: "Poppins",
                  }}
                >
                  Auction
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link
                className="nav-link text-nowrap"
                to="/donedeal"
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  fontFamily: "Poppins",
                }}
              >
                Done Deals
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-nowrap"
                to="/articles"
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  fontFamily: "Poppins",
                }}
              >
                Articles
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-nowrap"
                to="/business-card"
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  fontFamily: "Poppins",
                }}
              >
                About Me
              </Link>
            </li>

            {agent.i_want_to && (
              <li className="nav-item dropdown">
                <a
                  href="#"
                  className="nav-link dropdown-toggle text-nowrap"
                  id="iWantToDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    fontFamily: "Poppins",
                  }}
                >
                  I Want To
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end border-0 px-2"
                  aria-labelledby="iWantToDropdown"
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/buy"
                      onClick={() => handleNavigate("/buy")}
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        fontFamily: "Poppins",
                      }}
                    >
                      Buy a Property (WTB)
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/buy"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        fontFamily: "Poppins",
                      }}
                    >
                      Rent a Property (WTR)
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/saleprops"
                      onClick={() => handleNavigate("/saleprops")}
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        fontFamily: "Poppins",
                      }}
                    >
                      Sell a Property (WTS)
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/saleprops"
                      onClick={() => handleNavigate("/saleprops")}
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        fontFamily: "Poppins",
                      }}
                    >
                      Buy a Property (WTB)
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            {agent.tools && (
              <li className="nav-item">
                <Link
                  className="nav-link text-nowrap"
                  to="/tools"
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    fontFamily: "Poppins",
                  }}
                >
                  Tools
                </Link>
              </li>
            )}

            {/* ✅ Template Switch Dropdown */}
            <li className="nav-item ms-3">
              <select
                className="form-select"
                style={{ width: "150px" }}
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
