import React from "react";

const Filters = ({
  locations,
  years,
  selectedLocation,
  selectedYear,
  searchTerm,
  setSelectedLocation,
  setSelectedYear,
  setSearchTerm,
  handleSearch
}) => {
  return (
    <div className="mb-4">
      <div className="row justify-content-center">
        {/* Location Dropdown */}
        <div className="col-md-3 d-flex align-items-center mb-3">
          <label htmlFor="location" className="me-2">Location:</label>
          <select
            id="location"
            className="form-select"
            onChange={(e) => setSelectedLocation(e.target.value)}
            value={selectedLocation}
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc.location_id} value={loc.location_id}>
                {loc.location_name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="col-md-3 d-flex align-items-center mb-3">
          <label htmlFor="year" className="me-2">Year:</label>
          <select
            id="year"
            className="form-select"
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2 d-flex align-items-center mb-3">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="row justify-content-right">
        {/* Search Bar */}
        <div className="col-md-5 d-flex align-items-center mb-3" style={{marginLeft:188}}>
          <label htmlFor="search" className="me-2">Search:</label>
          <input
            id="search"
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            style={{marginLeft:15}}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

   
      </div>
    </div>
  );
};

export default Filters;
