import React from "react";
import { FaBed, FaBath, FaPhone, FaStar } from "react-icons/fa";

const ListingCard = ({ product, handleViewDetails }) => {
  const {
    id_listing,
    ads_title,
    price,
    room,
    bathroom,
    built_size,
    location_area,
    location_state,
    photos,
  } = product;

  const location = `${location_area}, ${location_state}`;
  const photo1 = photos?.[0] || "";
  const photo2 = photos?.[1] || photo1;

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
              src={photo1}
              alt={ads_title}
              style={{
                width: "50%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <img
              src={photo2}
              alt={ads_title}
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
              RM {price}
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
            >
              <FaStar
                style={{
                  fill: "#FAFAFA",
                  stroke: "#F4980E",
                  strokeWidth: "20px",
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
            {ads_title}
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
            {location}
          </div>

          {/* Built Size */}
          {built_size && (
            <div
              style={{
                fontWeight: 400,
                fontSize: "16px",
                color: "#666",
                marginBottom: "10px",
              }}
            >
              Built-up size: {built_size} sqft
            </div>
          )}

          {/* Room/Bath + Buttons */}
          <div
            className="d-flex justify-content-between align-items-start mt-3 flex-wrap"
            style={{ gap: "20px" }}
          >
            <div
              className="d-flex align-items-start"
              style={{ gap: "20px", fontSize: "16px", color: "#444" }}
            >
              {room && (
                <span className="d-flex align-items-center" style={{ gap: "6px" }}>
                  <FaBed />
                  {room} beds
                </span>
              )}
              {bathroom && (
                <span className="d-flex align-items-center" style={{ gap: "6px" }}>
                  <FaBath />
                  {bathroom} baths
                </span>
              )}
            </div>

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
                  handleViewDetails(id_listing, ads_title, location)
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
