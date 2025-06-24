import React, { useEffect, useState } from "react";
import headerImage from "../image/Landing_Hero.jpg";
import AgentBox from "../components/AgentBox";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [areas, setAreas] = useState([]);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showModal]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body.modal-open {
        overflow: hidden !important;
        height: 100vh;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleStateClick = async (id_state) => {
    try {
      const response = await axios.post(
        "https://dev-agentv3.propmall.net/graph/param/location/areas/in/state",
        {
          domain: "myhartanah.co",
          url_fe: window.location.href,
          id_state,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAreas(response.data.areas || []);
      setSelectedState(id_state);
      setSearchTerm("");
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const handleApply = () => {
    setShowModal(false);
    setSelectedState(null);
    setAreas([]);
    setSearchTerm("");
  };

  const handleBackToStates = () => {
    setSelectedState(null);
    setAreas([]);
    setSearchTerm("");
  };

  const filteredStates = locations.filter((loc) =>
    loc.state_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAreas = areas.filter((area) =>
    area.area_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="order-1 order-md-2 w-100 w-md-auto">
        <AgentBox />
      </div>

      {/* Hero Section */}
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
        }}
      >
        <div
          className="container-fluid order-2 order-md-1"
          style={{
            position: "relative",
            zIndex: 2,
            flex: 1,
            paddingTop: "100px",
            paddingLeft: "100px",
            paddingRight: "100px",
          }}
        >
          <h4 className="text-white fw-bold text-end mb-4" style={{ fontSize: "34px", fontFamily: "Poppins", fontWeight: 600 }}>
            Discover 20,000+ Dream Properties at HomesMatchKL.co
          </h4>

          {/* Filter Box */}
          <div style={{ backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "8px", padding: "20px" }}>
            {/* Tabs */}
            <div className="d-flex">
              {["rent", "sell"].map((tab) => (
                <button
                  key={tab}
                  className="btn text-white me-3"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: "transparent",
                    fontSize: "16px",
                    fontFamily: "Poppins",
                    borderBottom: activeTab === tab ? "3px solid #F4980E" : "3px solid transparent",
                    borderRadius: 0,
                  }}
                >
                  For {tab === "rent" ? "Rent" : "Sale"}
                </button>
              ))}
            </div>

            <div style={{ borderBottom: "2px solid #3A3A3A", marginBottom: "15px" }}></div>

            {/* Dropdowns */}
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <select
                  id="location"
                  className="form-select"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  value={selectedLocation}
                  style={{ height: "60px" }}
                >
                  <option value="">All Location</option>
                  {locations.map((loc) => (
                    <option key={loc.id_state} value={loc.id_state}>
                      {loc.state_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-9">
                <div className="d-flex flex-column flex-md-row gap-3">
                  <input
                    id="search"
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ height: "60px" }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                    style={{
                      backgroundColor: "#F4980E",
                      borderRadius: "8px",
                      height: "60px",
                      minWidth: "160px",
                      fontFamily: "Poppins",
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Filters */}
            <div className="row mt-4">
              <div className="col-12 d-flex flex-column flex-md-row gap-3">
                {["All Categories", "All Holding Types", "Price Ranges (RM)", "Bedroom(s)", "Bathroom(s)"].map((label) => (
                  <button
                    key={label}
                    className="btn btn-link text-white p-0 d-flex align-items-center"
                    style={{
                      justifyContent: "space-between",
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      fontSize: "16px",
                      fontFamily: "Poppins",
                    }}
                  >
                    <span style={{ flexGrow: 1, textAlign: "left" }}>{label}</span>
                    <span style={{ marginLeft: "6px", fontSize: "0.7rem", flexShrink: 0 }}>▼</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Button */}
            <div className="mt-4">
              <button className="btn btn-outline-light" onClick={() => setShowModal(true)}>
                Open Location Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowModal(false);
            setSelectedState(null);
            setAreas([]);
            setSearchTerm("");
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "750px",
              height: "500px",
              backgroundColor: "white",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "black",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                fontFamily: "Poppins",
              }}
            >
              <div>
                {selectedState && (
                  <button
                    onClick={handleBackToStates}
                    className="btn btn-sm"
                    style={{ border: "none", background: "transparent", color: "white" }}
                  >
                    ←
                  </button>
                )}
              </div>
              <h6 style={{ margin: 0, textAlign: "center", flex: 1 }}>
                {selectedState ? "Filter by Area" : "Filter by State"}
              </h6>
              <div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedState(null);
                    setAreas([]);
                    setSearchTerm("");
                  }}
                  className="btn btn-sm"
                  style={{ border: "none", background: "transparent", color: "white" }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Search */}
            <div style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
              <input
                type="text"
                className="form-control"
                placeholder={selectedState ? "Search City/Area..." : "Search State..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontFamily: "Poppins" }}
              />
            </div>

            {/* Scrollable Data */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {!selectedState ? (
                filteredStates.length > 0 ? (
                  filteredStates.map((loc) => (
                    <div
                      key={loc.id_state}
                      className="d-flex justify-content-between align-items-center p-2 border-bottom"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleStateClick(loc.id_state)}
                    >
                      <span>{loc.state_name}</span>
                      <span>&#x276F;</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted">No states found.</div>
                )
              ) : (
                <>
                  {filteredAreas.length > 0 ? (
                    filteredAreas.map((area) => (
                      <div key={area.id_area} className="py-2 border-bottom">
                        {area.area_name}
                      </div>
                    ))
                  ) : (
                    <div className="text-muted">No areas found.</div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: "1px solid #ddd",
                padding: "15px 20px",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn text-white px-4"
                style={{ backgroundColor: "#826044", fontFamily: "Poppins" }}
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
