import React from "react";
import { FaBed, FaBath, FaPhone, FaStar } from "react-icons/fa";

const ListingCard = ({ product }) => {
  // You have a click handler handleViewDetails in your buttons,
  // Make sure to define or pass it as prop if needed.

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "1.5rem",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        className="card"
        style={{
          width: "900px",
          height: "400px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Image Section */}
        <div
          style={{
            width: "40%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={product.property_photo}
            alt={product.property_title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Details Section */}
        <div
          className="p-3"
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Price + Save */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div
              style={{
                fontWeight: 600,
                fontSize: "18px",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              RM {product.property_price}
            </div>
            <button
              className="btn d-flex align-items-center"
              style={{
                gap: "5px",
                fontSize: "14px",
                fontWeight: 500,
                border: "none",
                backgroundColor: "transparent",
                boxShadow: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <FaStar
                style={{
                  fill: "#FAFAFA", // Star fill color
                  stroke: "#F4980E", // Star outline color
                  strokeWidth: "20px", // Adjust thickness as needed
                }}
              />
              Save
            </button>
          </div>

          {/* Title */}
          <div
            style={{
              fontWeight: 400,
              fontSize: "16px",
              color: "#333",
              marginBottom: "4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.property_title}
          </div>

          {/* Location */}
          <div
            style={{
              fontWeight: 400,
              fontSize: "14px",
              color: "#666",
              marginBottom: "4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {product.property_location}
          </div>

          {/* Built Size */}
          <div
            style={{
              fontWeight: 400,
              fontSize: "14px",
              color: "#666",
            }}
          >
            Built-up size: {product.property_built_size} sqft
          </div>

          {/* Bed & Bath and Buttons Row */}
          <div
            className="d-flex justify-content-between align-items-center mt-2"
            style={{ fontSize: "14px", color: "#444" }}
          >
            {/* Bed & Bath */}
            <div className="d-flex" style={{ gap: "12px" }}>
              <span className="d-flex align-items-center" style={{ gap: "6px" }}>
                <FaBed />
                {product.property_room} beds
              </span>
              <span className="d-flex align-items-center" style={{ gap: "6px" }}>
                <FaBath />
                {product.property_bathroom} baths
              </span>
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                style={{ gap: "6px", color: "#737373", borderColor: "#999999", padding: "4px 8px", fontSize: "12px" }}
              >
                <FaPhone />
                Contact Agent
              </button>
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={() =>
                  alert(`View Details clicked for: ${product.property_title}`) // Replace with your handler
                }
                style={{ gap: "6px", color: "#737373", borderColor: "#999999", padding: "4px 8px", fontSize: "12px" }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
