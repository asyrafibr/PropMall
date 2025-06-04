import React from "react";
import { FaBed, FaBath, FaPhone, FaStar } from "react-icons/fa";

const ListingCard = ({ product, handleViewDetails }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "1.5rem",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="card" style={{ maxWidth: "900px", width: "100%" }}>
        <div className="p-3">
          {/* Images Row */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <img
              src={product.property_photo}
              alt={product.property_title}
              style={{
                width: "50%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <img
              src={product.property_photo}
              alt={product.property_title}
              style={{
                width: "50%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* Price + Save */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div
              style={{
                fontWeight: 600,
                fontSize: "20px",
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
              fontSize: "20px",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            {product.property_title}
          </div>

          {/* Location */}
          <div
            style={{
              fontWeight: 400,
              fontSize: "16px",
              color: "#666",
              marginBottom: "4px",
            }}
          >
            {product.property_location}
          </div>

          {/* Built Size */}
          <div
            style={{
              fontWeight: 400,
              fontSize: "16px",
              color: "#666",
              marginBottom: "10px",
            }}
          >
            Built-up size: {product.property_built_size} sqft
          </div>

          {/* Top-aligned Room/Bath & Buttons */}
          <div
            className="d-flex justify-content-between align-items-start mt-3 flex-wrap"
            style={{ gap: "20px" }}
          >
            {/* Bed & Bath Info */}
            <div
              className="d-flex align-items-start"
              style={{ gap: "20px", fontSize: "16px", color: "#444" }}
            >
              <span
                className="d-flex align-items-center"
                style={{ gap: "6px" }}
              >
                <FaBed />
                {product.property_room} beds
              </span>
              <span
                className="d-flex align-items-center"
                style={{ gap: "6px" }}
              >
                <FaBath />
                {product.property_bathroom} baths
              </span>
            </div>

            {/* Action Buttons */}
            <div className="d-flex align-items-start gap-3">
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                style={{ gap: "6px", color: "#737373", borderColor: "#999999" }}
              >
                <FaPhone />
                Contact Agent
              </button>
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={() =>
                  handleViewDetails(
                    product.property_id,
                    product.property_title,
                    product.property_location
                  )
                }
                style={{ gap: "6px", color: "#737373", borderColor: "#999999" }}
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
