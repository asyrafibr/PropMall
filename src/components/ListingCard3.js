import React from "react";
import { FaBed, FaBath } from "react-icons/fa";
import { MdOutlineWhatsapp } from "react-icons/md";
import { CgNotes } from "react-icons/cg";

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
    position,
    property_category_description,
    created_at,
    built_price_per_sqft, // assuming you have posted date
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
      <div
        className="card shadow-sm"
        style={{
          maxWidth: "1000px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
          }}
        >
          {/* Image Section */}
          <div
            style={{
              flex: "1",
              position: "relative",
              minWidth: "280px",
              maxWidth: "320px",
              height: "240px",
              overflow: "hidden",
            }}
          >
            <img
              src={photo1}
              alt={ads_title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Top-left badges */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {statusText && (
                <span
                  style={{
                    backgroundColor: statusColor,
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {statusText}
                </span>
              )}
              {isBelowMarket && (
                <span
                  style={{
                    backgroundColor: "#7C9A2C",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Below Market
                </span>
              )}
            </div>

            {/* Exclusive Ribbon */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "-42px",
                backgroundColor: "#f6b400",
                color: "white",
                transform: "rotate(45deg)",
                width: "160px",
                textAlign: "center",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "28px",
              }}
            >
              Exclusive
            </div>
          </div>

          {/* Details Section */}
          <div
            style={{
              flex: "2",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* Posted Date */}
              <div
                style={{ fontSize: "12px", color: "#777", marginBottom: "4px" }}
              >
                Posted on {created_at || "24th August 2024"}
              </div>

              {/* Price */}
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#000" }}>
                {monetary_currency} {price}
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginTop: "6px",
                  marginBottom: "4px",
                  color: "#333",
                }}
              >
                {ads_title}
              </div>

              {/* Location */}
              <div
                style={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
                {location}
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex gap-3 mb-3">
              <button
                className="btn d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#FBF4E7",
                  borderRadius: "8px",
                  flex: 1,
                  padding: "10px",
                  fontWeight: 500,      boxShadow: "4px 4px 10px 0 rgba(0, 0, 0, 0.15)", // added shadow

                }}
              >
                <MdOutlineWhatsapp size={20} style={{ marginRight: "6px" }} />
                Whatsapp
              </button>
              <button
                className="btn d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#FBF4E7",
                  borderRadius: "8px",
                  flex: 1,
                  padding: "10px",
                  fontWeight: 500,      boxShadow: "4px 4px 10px 0 rgba(0, 0, 0, 0.15)", // added shadow

                }}
                onClick={() =>
                  handleViewDetails(id_listing, ads_title, location)
                }
              >
                                <CgNotes  size={20} style={{ marginRight: "6px" }} />

                Details
              </button>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div
          className="d-flex justify-content-between align-items-center flex-nowrap"
          style={{
            border: "1px solid #eee",
            borderRadius: "8px",
            width: "100%",
            fontSize: "12px",
            color: "#444",
            gap: "8px", // reduced gap
            boxSizing: "border-box",
            margin: "10px auto",
            padding: 10,
          }}
        >
          {/* Property Type */}
          <div style={{ flex: "1 1 80px", minWidth: "120px" }}>
            <div>{property_category_description}</div>
            <small style={{ color: "#888" }}>{position}</small>
          </div>

          {/* Size */}
          {built_size && (
            <div style={{ flex: "1 1 120px", minWidth: "120px" }}>
              <div style={{ fontWeight: 500 }}>{built_size} sq.ft.</div>
              <small style={{ color: "#888" }}>
                RM {built_price_per_sqft} per sq.ft.
              </small>
            </div>
          )}

          {/* Rooms */}
          {room && (
            <div
              className="d-flex align-items-center gap-1"
              style={{ flex: "1 1 100px", minWidth: "100px" }}
            >
              <FaBed /> {room} Bedroom(s)
            </div>
          )}

          {/* Bathrooms */}
          {bathroom && (
            <div
              className="d-flex align-items-center gap-1"
              style={{ flex: "1 1 100px", minWidth: "100px" }}
            >
              <FaBath /> {bathroom} Bathroom(s)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
