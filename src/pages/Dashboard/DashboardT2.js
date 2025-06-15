import React, { useState, useEffect } from "react";
import "./FilterT2.css";
import bgImage from "../../image/template2bg.png";

const textBlack = { color: "black" };

const DashboardT2 = (
  locations,
  years,
  selectedLocation,
  selectedYear,
  searchTerm,
  setSelectedLocation,
  setSelectedYear,
  setSearchTerm,
  handleSearch,
  agent
) => {
  const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
  const [isBuy, setIsBuy] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = (value) => {
    setIsBuy(value);
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="hero-section d-flex flex-column align-items-center justify-content-center text-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "100px 20px",
          height: "400px",
          color: "#333",
        }}
      >
        <h2
          style={{
            fontFamily: "Poppins",
            fontSize: "35px",
            fontWeight: 500,
            marginTop: "-100px",
          }}
        >
          <span style={{ fontWeight: 600 }}>Browse</span> the most <br /> recent
          property listings
        </h2>
      </div>

      {/* Filter Box */}
      <div
        className="container"
        style={{
          marginTop: "-60px",
          background: "#00000099",
          borderRadius: "16px",
          padding: "24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Toggle Buy / Rent */}
        <div className="d-flex justify-content-center mb-3">
          <div
            className="position-relative"
            style={{
              background: "#fff",
              borderRadius: "999px",
              padding: "6px",
              width: "220px",
              height: "52px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "6px",
                left: isBuy ? "6px" : "110px",
                width: "100px",
                height: "40px",
                background: "#F4980E",
                borderRadius: "999px",
                transition: "left 0.3s ease",
                zIndex: 1,
              }}
            ></div>
            <div className="d-flex position-relative" style={{ zIndex: 2 }}>
              <button
                className="btn rounded-pill w-50"
                style={{
                  fontSize: "16px",
                  background: "transparent",
                  color: isBuy ? "#fff" : "#000",
                  border: "none",
                }}
                onClick={() => handleToggle(true)}
              >
                Buy
              </button>
              <button
                className="btn rounded-pill w-50"
                style={{
                  fontSize: "16px",
                  background: "transparent",
                  color: !isBuy ? "#fff" : "#000",
                  border: "none",
                }}
                onClick={() => handleToggle(false)}
              >
                Rent
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="row mb-3 g-2">
          <div className="col-12 col-md-9">
            <input
              type="text"
              className="form-control form-control-lg rounded-pill"
              placeholder="Search States"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: "16px",
              }}
            />
          </div>
          <div className="col-12 col-md-3">
            <button
              className="btn btn-warning w-100 rounded-pill"
              onClick={handleSearch}
              style={{
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: "16px",
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="row g-2">
          <div className="col-12 col-md-4">
            <select
              className="form-select text-white"
              style={{
                background: "transparent",
                borderWidth: 1,
              }}
            >
              <option style={textBlack}>All Residential</option>
              <option style={textBlack}>Condo</option>
              <option style={textBlack}>Landed</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select text-white"
              style={{
                background: "transparent",
                borderWidth: 1,
              }}
            >
              <option style={textBlack}>Any Price</option>
              <option style={textBlack}>Below RM 500K</option>
              <option style={textBlack}>RM 500K - RM 1M</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select text-white"
              style={{
                background: "transparent",
                borderWidth: 1,
              }}
            >
              <option style={textBlack}>Bedroom</option>
              <option style={textBlack}>1+</option>
              <option style={textBlack}>2+</option>
              <option style={textBlack}>3+</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardT2;
