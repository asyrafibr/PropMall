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
    monetary_currency,
    category_type_title_holding_lottype_storey,
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
        <div className="p-3">
          {/* Image with Badges */}
          <div
            style={{
              position: "relative",
              marginBottom: "15px",
              overflow: "hidden", // ✅ Ensures anything outside the box (e.g. ribbon) is clipped
              borderRadius: "6px", // ✅ Optional: match image border
              height: "300px", // ✅ Match image height
            }}
          >
            <img
              src={photo1}
              alt={ads_title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
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
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                {statusText && (
                  <div
                    style={{
                      backgroundColor: statusColor,
                      color: "white",
                      borderRadius: "4px",
                      padding: "4px 12px",
                      fontSize: "16px",
                      fontWeight: 600,
                      textAlign: "left",
                      maxWidth: "100px",
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
                      fontSize: "16px",
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

            {/* Exclusive Ribbon (top-right corner) */}
            <div
              style={{
                position: "absolute",
                top: "2rem",
                right: "-2.5rem",
                backgroundColor: "#f6b400",
                color: "white",
                transform: "rotate(45deg)",
                width: "200px",
                height: "30px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "0.85rem",
                zIndex: 2,
                overflow: "hidden",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                fontSize:'16px'
              }}
            >
              Exclusive
            </div>
          </div>

          {/* Price + Save */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div style={{ fontWeight: 600, fontSize: "20px" }}>
              {monetary_currency} {price}
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

          <div
            style={{
              fontWeight: 400,
              fontSize: "16px",
              color: "#666",
              marginBottom: "10px",
              fontFamily: "Poppins",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Always show category type */}
            <span>{category_type_title_holding_lottype_storey}</span>

            {/* Conditionally render dot and built-up size */}
            {built_size && (
              <>
                {/* Dot */}
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#666",
                    margin: "0 8px",
                  }}
                ></span>

                {/* Built-up size */}
                <span>Built-up size: {built_size} sqft</span>
              </>
            )}
          </div>

          {/* Room / Bath and Buttons */}
          <div
            className="d-flex justify-content-between align-items-start mt-3 flex-wrap"
            style={{ gap: "20px" }}
          >
            <div
              className="d-flex align-items-start"
              style={{ gap: "20px", fontSize: "16px", color: "#444" }}
            >
              {room && (
                <span
                  className="d-flex align-items-center"
                  style={{ gap: "6px" }}
                >
                  <FaBed />
                  {room} beds
                </span>
              )}
              {bathroom && (
                <span
                  className="d-flex align-items-center"
                  style={{ gap: "6px" }}
                >
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
