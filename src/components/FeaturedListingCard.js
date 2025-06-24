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
    listing_modus,
    below_market,
    photos,
  } = product;

  const location = `${location_area}, ${location_state}`;
  const photo1 = photos?.[0] || "https://via.placeholder.com/860x300";

  const modus = listing_modus?.toUpperCase();
  const isForSale = modus === "FOR SALE";
  const isForRent = modus === "FOR RENT";
  const statusText = isForSale ? "For Sale" : isForRent ? "For Rent" : "";
  const statusColor = isForSale ? "#FF7A00" : isForRent ? "#007B83" : "#ccc";
  const isBelowMarket = below_market === "Y";

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
        <div className="p-3 d-flex flex-column" style={{ height: "100%" }}>
          {/* Image with Badges */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <img
              src={photo1}
              alt={ads_title}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            {/* Tag Badges (top-left) */}
            {(statusText || isBelowMarket) && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  zIndex: 2,
                }}
              >
                {statusText && (
                  <div
                    style={{
                      backgroundColor: statusColor,
                      color: "white",
                      borderRadius: "4px",
                      padding: "4px 12px",
                      fontSize: "14px",
                      fontWeight: 600,
                      textAlign: "center",
                      minWidth: "90px",
                    }}
                  >
                    {statusText}
                  </div>
                )}
                {isBelowMarket && (
                  <div
                    style={{
                      backgroundColor: "#7C9A2C",
                      color: "white",
                      borderRadius: "4px",
                      padding: "4px 12px",
                      fontSize: "14px",
                      fontWeight: 600,
                      textAlign: "center",
                      minWidth: "90px",
                    }}
                  >
                    Below Market
                  </div>
                )}
              </div>
            )}

            {/* Exclusive Ribbon */}
            <div
              className="position-absolute"
              style={{
                top: "10px",
                right: "10px",
                transform: "rotate(45deg)",
                backgroundColor: "#f6b400",
                color: "white",
                width: "120px",
                height: "28px",
                textAlign: "center",
                fontWeight: "600",
                fontSize: "0.75rem",
                zIndex: 3,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Poppins",
                pointerEvents: "none",
              }}
            >
              Exclusive
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flexGrow: 1 }}>
            {/* Price + Save */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div style={{ fontWeight: 600, fontSize: "20px" }}>
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

            {/* Built-up Size */}
            {built_size && (
              <div
                style={{
                  fontWeight: 400,
                  fontSize: "16px",
                  color: "#666",
                  marginBottom: "10px",
                }}
              >
                Built-up size: {built_size} sqftqqs
              </div>
            )}
          </div>

          {/* Fixed Bottom Room/Bath and Buttons */}
          <div className="mt-auto d-flex justify-content-between align-items-start flex-wrap gap-3 pt-3 border-top">
            <div
              className="d-flex align-items-center gap-4"
              style={{ fontSize: "16px", color: "#444" }}
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
