import React from "react";

const SidebarFilters = ({ selectedLocationName, searchType }) => {
  const filters = [
    "All categories",
    "Holding Types",
    "Facilities",
    "Price Range (RM)",
    "Bedrooms",
    "Built-up Size (sq.ft)",
  ];

  return (
    <div
      style={{
        width: "400px",
        height: "592px",
        backgroundColor: "#FAFAFA",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        borderRadius: "8px",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Title */}
      <h2
        style={{
          fontWeight: 600,
          fontSize: "20px",
          textAlign: "center",
          marginBottom: "20px",
          color: "#000",
        }}
      >
        {searchType
          ? `Houses for ${searchType === "sell" ? "sale" : "rent"} in ${
              selectedLocationName || "your location"
            }`
          : `Houses in ${selectedLocationName || "your location"}`}
      </h2>

      {/* Dropdown buttons */}
      {filters.map((btnText, idx) => (
        <button
          key={btnText}
          type="button"
          className="btn"
          style={{
            width: "100%",
            textAlign: "left",
            fontWeight: 400,
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "1px solid #ccc",
            position: "relative",
            cursor: "pointer",
            outline: "none",
            fontFamily: "Poppins",
            borderRadius: 0,
            padding: "14px 12px 18px", // increased bottom padding here
          }}
        >
          {btnText}

          {/* Downward arrow - simple CSS triangle */}
          <span
            style={{
              content: '""',
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #000",
            }}
          />
        </button>
      ))}
    </div>
  );
};

export default SidebarFilters;
