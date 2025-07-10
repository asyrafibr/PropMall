import React from "react";
import AgentBox from "./AgentBox";

const SearchFilter = ({
  locations,
  years,
  selectedLocation,
  selectedYear,
  searchTerm,
  setSelectedLocation,
  setSelectedYear,
  setSearchTerm,
  handleSearch,
  activeTab,
  setActiveTab,
}) => {

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "1300px", position: "relative", zIndex: 2 }}>
        {/* ✅ AgentBox with full-width container (not sticky) */}
                    <AgentBox />


        {/* ✅ Sticky Filters Box */}
        <div
          style={{
         
            backgroundColor: "#FAFAFA",
            borderRadius: "8px",
            padding: "20px 15px",
            width: "100%",
          }}
        >
          {/* Rent / Sell Toggle Buttons */}
          <div style={{ marginBottom: "10px" }}>
            <button
              className="btn"
              onClick={() => setActiveTab("rent")}
              style={{
                color: "#3A3A3A",
                background: "transparent",
                border: "none",
                marginRight: "20px",
                borderRadius: "0px",
                borderBottom:
                  activeTab === "rent" ? "3px solid #F4980E" : "3px solid transparent",
              }}
            >
              Rent
            </button>
            <button
              className="btn"
              onClick={() => setActiveTab("sell")}
              style={{
                color: "#3A3A3A",
                background: "transparent",
                border: "none",
                borderRadius: "0px",
                borderBottom:
                  activeTab === "sell" ? "3px solid #F4980E" : "3px solid transparent",
              }}
            >
              Sale
            </button>
            <div
              style={{ borderBottom: "2px solid #3A3A3A", marginTop: "-2px" }}
            ></div>
          </div>

          {/* Filters Row */}
          <div className="row justify-content-left">
            <div className="col-12 col-md-3 mb-3">
              <label htmlFor="location" className="form-label">
                Location:
              </label>
              <select
                id="location"
                className="form-select"
                onChange={(e) => setSelectedLocation(e.target.value)}
                value={selectedLocation}
                style={{ height: "60px" }}
              >
                <option value="">All Location</option>
                {locations.map((loc) => (
                  <option key={loc.location_id} value={loc.id_state}>
                    {loc.state_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-9 d-flex align-items-start mb-3">
              <div
                style={{
                  width: "834px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label htmlFor="search" className="form-label" style={{ marginBottom: "6px" }}>
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
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
