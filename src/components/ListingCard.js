import React from "react";

const ListingCard = ({ product, years, handleViewDetails, activeYear }) => {
  return (
    <div key={product.property_id} className="card mb-4">
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={product.property_photo}
            alt={product.property_title}
            className="img-fluid"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              maxHeight: "260px",
            }}
          />
        </div>
        <div className="col-md-8 p-3 d-flex flex-column justify-content-between">
          <div>
            <h5
              style={{ cursor: "pointer", color: "black" }}
              onClick={() => handleViewDetails(
                product.property_id,
                product.property_title,
                product.property_location
              )}
            >
              {product.property_title}
            </h5>
            <p className="mb-1"><strong>Location:</strong> {product.property_location}</p>
            <p className="mb-1"><strong>Built Size:</strong> {product.property_built_size} sqft</p>
            <p className="mb-1"><strong>Land Size:</strong> {product.property_land_size} sqft</p>
            <p className="mb-1"><strong>Rooms:</strong> {product.property_room}</p>
            <p className="mb-1"><strong>Bathrooms:</strong> {product.property_bathroom}</p>
          </div>

          <div className="d-flex justify-content-end mt-3">
            {years.map((y) => (
              <div
                key={y}
                style={{
                  minWidth: "120px",
                  textAlign: "center",
                  fontWeight: "bold",
                  backgroundColor: activeYear === y.toString() ? "#e0e0e0" : "transparent",
                  color: "black",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  marginRight: "5px",
                }}
              >
                {product.property_prices[y]
                  ? `RM ${product.property_prices[y].toLocaleString()}`
                  : "-"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
