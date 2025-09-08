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
    <div className="d-flex justify-content-center mb-3">
      <div className="card w-100">
        <div className="p-3">

          {/* Image with Badges */}
          <div className="position-relative mb-3 overflow-hidden rounded" style={{height: "300px"}}>
            <img
              src={photo1}
              alt={ads_title}
              className="img-fluid w-100 h-100 object-fit-cover"
            />

            {/* Tag Badges */}
            {(statusText || isBelowMarket) && (
              <div className="position-absolute top-0 start-0 d-flex flex-column gap-2 p-2">
                {statusText && (
                  <span className="badge text-white" style={{ backgroundColor: statusColor }}>
                    {statusText}
                  </span>
                )}
                {isBelowMarket && (
                  <span className="badge bg-success">Below Market</span>
                )}
              </div>
            )}

            {/* Exclusive Ribbon */}
            {product.exclusive === "Y" && (
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
                  fontSize: "14px",
                  zIndex: 2,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                Exclusive
              </div>
            )}
          </div>

          {/* Price + Save */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="fw-bold fs-5">{monetary_currency} {price}</div>
            <button className="btn btn-link p-0 d-flex align-items-center gap-1">
              <FaStar className="text-warning" />
              Save
            </button>
          </div>

          {/* Title */}
          <h6 className="fw-normal mb-1 fs-6">{ads_title}</h6>

          {/* Location */}
          <p className="text-muted mb-1 small">{location}</p>

          {/* Category & Built-up size */}
          <p className="text-muted mb-3 small d-flex flex-wrap align-items-center">
            <span>{category_type_title_holding_lottype_storey}</span>
            {built_size && (
              <>
                <span className="mx-2">&bull;</span>
                <span>Built-up size: {built_size} sqft</span>
              </>
            )}
          </p>

          {/* Room / Bath and Buttons */}
         <div className="d-flex flex-row justify-content-between align-items-center gap-2 mt-auto flex-nowrap flex-md-nowrap">
  <div className="d-flex gap-3 text-secondary small align-items-center">
    {room && (
      <span className="d-flex align-items-center gap-1">
        <FaBed /> {room}
      </span>
    )}
    {bathroom && (
      <span className="d-flex align-items-center gap-1">
        <FaBath /> {bathroom}
      </span>
    )}
  </div>

  <div className="d-flex gap-2">
    <button className="btn btn-outline-secondary d-flex align-items-center gap-1">
      <FaPhone />
      Contact Agent
    </button>
    <button
      className="btn btn-outline-secondary d-flex align-items-center gap-1"
      onClick={() => handleViewDetails(id_listing, ads_title, location)}
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
