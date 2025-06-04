import React, { useState } from "react";
import headerImage from "../image/Landing_Hero.jpg";
import agentimage from "../image/Profile.jpg";
import AgentBox from "../components/AgentBox";
import { useAuth } from "../context/AuthContext";

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
}) => {
  const [activeTab, setActiveTab] = useState("rent");
  const { isLoggedIn } = useAuth(); // ✅ Get login status

  return (
    <div>
      <div
        className="hero-section d-flex align-items-center justify-content-center"
        style={{
          position: "relative",
          width: "100%",
          height: "541px",
          backgroundImage: `url(${headerImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          color: "white",
        }}
      >
        {isLoggedIn && <AgentBox />}

        {/* Content */}
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "1300px",
            padding: "0 50px",
            paddingTop:'80px'
          }}
        >
          {/* Headline */}
          <h4
            style={{
              color: "white",
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "right",
              width: "100%",
            }}
          >
            Discover 20,000+ Dream Properties at HomesMatchKL.co
          </h4>

          {/* Filters Box */}
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: "8px",
              padding: "20px",
              width: "100%",
            }}
          >
            {/* Rent / Sell Toggle Buttons */}
            <div style={{ marginBottom: "10px" }}>
              <button
                className="btn"
                onClick={() => setActiveTab("rent")}
                style={{
                  color: "white",
                  background: "transparent",
                  border: "none",
                  marginRight: "20px",
                  borderRadius: "0px",
                  borderBottom:
                    activeTab === "rent"
                      ? "3px solid #F4980E"
                      : "3px solid transparent",
                }}
              >
                For Rent
              </button>
              <button
                className="btn"
                onClick={() => setActiveTab("sell")}
                style={{
                  color: "white",
                  background: "transparent",
                  border: "none",
                  borderRadius: "0px",
                  borderBottom:
                    activeTab === "sell"
                      ? "3px solid #F4980E"
                      : "3px solid transparent",
                }}
              >
                For Sale
              </button>
              <div
                style={{ borderBottom: "2px solid #3A3A3A", marginTop: "-2px" }}
              ></div>
            </div>

            {/* Filters Row */}
            <div className="row justify-content-left">
              {/* Location Dropdown */}
              <div className="col-12 col-md-3 mb-3">
                <label htmlFor="location" className="form-label text-white">
                  Location:
                </label>
                <select
                  id="location"
                  className="form-select"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  value={selectedLocation}
                  style={{ height: "60px" }}
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc.location_id} value={loc.location_id}>
                      {loc.location_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search input + button container */}
              <div className="col-12 col-md-9 d-flex align-items-start mb-3">
                {/* Search label + input */}
                <div
                  style={{
                    width: "834px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label
                    htmlFor="search"
                    className="form-label text-white"
                    style={{ marginBottom: "6px" }}
                  >
                    Search:
                  </label>
                  <input
                    id="search"
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      height: "60px",
                      padding: "6px 12px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                {/* Search button */}
                <button
                  className="btn btn-primary ms-3"
                  onClick={handleSearch}
                  style={{
                    backgroundColor: "#F4980E",
                    borderColor: "#F4980E",
                    width: "160px",
                    borderRadius: "8px",
                    height: "60px",
                    padding: "6px 0",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "30px",
                    justifyContent: "center",
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Additional Filter Dropdown Buttons Row */}
            <div
              className="d-flex gap-3 mt-3"
              style={{ justifyContent: "flex-start" }}
            >
              {[
                "All Categories",
                "All Holding Types",
                "Price Ranges (RM)",
                "Bedroom(s)",
                "Bathroom(s)",
              ].map((label) => (
                <button
                  key={label}
                  className="btn btn-link p-0 text-white d-flex align-items-center"
                  style={{
                    textDecoration: "none",
                    border: "none",
                    background: "transparent",
                    fontWeight: "400",
                    fontSize: "16px",
                    fontFamily: "Poppins",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    // Optional: Add dropdown toggle logic here if needed
                  }}
                >
                  {label}
                  <span style={{ marginLeft: "6px", fontSize: "0.7rem" }}>
                    ▼
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
