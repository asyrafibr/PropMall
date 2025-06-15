import React, { useEffect, useState } from "react";
import headerImage from "../image/Landing_Hero.jpg";
import AgentBox from "../components/AgentBox";
import { useAuth } from "../context/AuthContext";
const isDesktop = window.innerWidth >= 768;

const Filters = ({
  locations,
  years,
  selectedLocation,
  selectedYear,
  searchTerm,
  setSelectedLocation,
  setSelectedYear,
  setSearchTerm,
  handleSearch,
  agent,
}) => {
  const [activeTab, setActiveTab] = useState("rent");
  const { isLoggedIn } = useAuth();

  useEffect(() => {}, [locations]);

  return (
    <div>
      <div
        className="hero-section d-flex flex-column flex-md-row align-items-start justify-content-center flex-wrap"
        style={{
          position: "relative",
          width: "100%",
          minHeight: "541px",
          backgroundImage: `url(${headerImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          color: "white",
          padding: "20px",
        }}
      >
        {/* AgentBox - responsive placement */}
        <div
          className="order-1 order-md-2 w-100 w-md-auto"
          style={{
            marginBottom: "40px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <AgentBox />
        </div>

        {/* Main Content */}
        <div
          className="container-fluid order-2 order-md-1"
          style={{
            position: "relative",
            zIndex: 2,
            flex: 1,
            paddingTop: "150px",
            paddingLeft: "100px",
            paddingRight: "100px",
          }}
        >
          <h4
            className="text-white fw-bold text-end mb-4"
            style={{
              fontSize: "34px",
              fontFamily: "Poppins",
              fontWeight: 600,
            }}
          >
            Discover 20,000+ Dream Properties at HomesMatchKL.co
          </h4>

          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            {/* Rent / Sell Tabs */}
            <div className="mb-3 d-flex">
              <button
                className="btn text-white me-3"
                onClick={() => setActiveTab("rent")}
                style={{
                  background: "transparent",
                  borderRadius: 1,
                  fontSize: "16px",
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  borderBottom:
                    activeTab === "rent"
                      ? "3px solid #F4980E"
                      : "3px solid transparent",
                }}
              >
                For Rent
              </button>
              <button
                className="btn text-white"
                onClick={() => setActiveTab("sell")}
                style={{
                  background: "transparent",
                  borderRadius: 1,
                  fontSize: "16px",
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  borderBottom:
                    activeTab === "sell"
                      ? "3px solid #F4980E"
                      : "3px solid transparent",
                }}
              >
                For Sale
              </button>
            </div>

            <div
              style={{
                borderBottom: "2px solid #3A3A3A",
                marginBottom: "15px",
              }}
            ></div>

            {/* Filters Row */}
            <div className="row g-3">
              {/* Location Dropdown */}
              <div className="col-12 col-md-3">
                <select
                  id="location"
                  className="form-select"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  value={selectedLocation}
                  style={{ height: "60px" }}
                >
                  <option
                    value=""
                    style={{
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      fontWeight: 400,
                    }}
                  >
                    All States
                  </option>
                  {locations.map((loc) => (
                    <option key={loc.id_state} value={loc.id_state}>
                      {loc.state_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search + Button */}
              <div className="col-12 col-md-9">
                <div className="d-flex flex-column flex-md-row gap-3">
                  <input
                    id="search"
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ height: "60px" }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                    style={{
                      backgroundColor: "#F4980E",
                      borderColor: "#F4980E",
                      borderRadius: "8px",
                      height: "60px",
                      minWidth: "160px",
                      whiteSpace: "nowrap",
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      fontWeight: 400,
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Filters Row */}
            <div className="row mt-4">
              <div className="col-12 d-flex flex-column flex-md-row gap-3">
                {[
                  "All Categories",
                  "All Holding Types",
                  "Price Ranges (RM)",
                  "Bedroom(s)",
                  "Bathroom(s)",
                ].map((label) => (
                  <button
                    key={label}
                    className="btn btn-link text-white p-0 d-flex align-items-center"
                    style={{
                      justifyContent: "space-between",
                      width: "100%",
                      textDecoration: "none",
                      background: "transparent",
                      border: "none",
                      fontWeight: "400",
                      fontSize: "16px",
                      fontFamily: "Poppins",
                    }}
                  >
                    <span style={{ flexGrow: 1, textAlign: "left" }}>
                      {label}
                    </span>
                    <span
                      style={{
                        marginLeft: "6px",
                        fontSize: "0.7rem",
                        flexShrink: 0,
                      }}
                    >
                      ▼
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
