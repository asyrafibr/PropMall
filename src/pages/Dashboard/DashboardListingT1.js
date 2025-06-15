import React, { useEffect, useState } from "react";
import { FaBed, FaBath } from "react-icons/fa";
import { useTemplate } from "../../context/TemplateContext";

const DashboardListingT1 = ({ listings }) => {
  const [loading, setLoading] = useState(true);
    const { template } = useTemplate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const skeletonStyles = {
    image: {
      height: "260px",
      backgroundColor: "#ddd",
      borderRadius: "4px 4px 0 0",
    },
    title: {
      width: "60%",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "10px",
    },
    text: {
      width: "80%",
      height: "14px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      marginBottom: "8px",
    },
    icon: {
      width: "40px",
      height: "20px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
    },
    button: {
      height: "36px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      width: "100%",
    },
  };

  const renderSkeletonCard = () => (
    <div className="col-12 col-md-4 mb-4 d-flex" key={Math.random()}>
      <div className="card h-100 w-100 border-0 shadow-sm">
        <div style={skeletonStyles.image} />
        <div className="card-body">
          <div style={skeletonStyles.title} />
          <div style={skeletonStyles.text} />
          <div style={skeletonStyles.text} />
          <div className="d-flex gap-3 mb-3">
            <div style={skeletonStyles.icon} />
            <div style={skeletonStyles.icon} />
          </div>
          <div className="d-flex gap-2">
            <div style={skeletonStyles.button} />
            <div style={skeletonStyles.button} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid" style={{ padding: "60px 70px" }}>
      <div style={{ marginBottom: "40px" }}>
        <text
          style={{
            fontWeight: 600,
            fontSize: "20px",
            fontFamily: "Poppins",
            paddingLeft: "20px",
          }}
        >
          Featured Listing
        </text>
      </div>
      <div className="row mx-0">
        {loading
          ? Array.from({ length: 6 }).map(() => renderSkeletonCard())
          : (listings ?? []).map((card) => {
              const modus = card.listing_modus?.toUpperCase();
              const isForSale = modus === "FOR SALE";
              const isForRental = modus === "FOR RENTAL";
              const showTag = isForSale || isForRental;

              const statusText = isForSale
                ? "For Sale"
                : isForRental
                ? "For Rental"
                : "";
              const statusColor = isForSale
                ? "#FF3B30"
                : isForRental
                ? "#F4980E"
                : "#ccc";

              const belowMarket = card.below_market === "Y";

              return (
                <div
                  key={card.id_listing}
                  className="col-12 col-md-4 mb-4 d-flex"
                >
                  <div className="card h-100 d-flex flex-column border-0 shadow-sm w-100">
                    <div className="position-relative">
                      <img
                        src={
                          card.photos?.[0] ||
                          "https://via.placeholder.com/300x200"
                        }
                        className="card-img-top"
                        alt={card.ads_title}
                        style={{ height: "260px", objectFit: "cover" }}
                      />
                      {showTag && (
                        <div
                          className="position-absolute top-0 start-0 m-2"
                          style={{
                            backgroundColor: statusColor,
                            width: "96px",
                            height: "40px",
                            borderRadius: "4px",
                            color: "white",
                            fontSize: "0.9rem",
                            padding: "8px 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {statusText}
                        </div>
                      )}
                      {belowMarket && (
                        <span className="badge bg-primary position-absolute bottom-0 start-0 m-2">
                          Below Market
                        </span>
                      )}
                      <span className="position-absolute bottom-0 end-0 m-2 text-white small">
                        <i className="bi bi-camera-fill me-1"></i>{" "}
                        {card.photos_count ?? 0}
                      </span>
                    </div>

                    <div className="card-body d-flex flex-column flex-grow-1">
                      <h5 className="card-title fw-bold text-dark">
                        RM {card.price}
                      </h5>
                      <p className="text-muted small mb-1">
                        <strong>{card.ads_title}</strong>
                        <br />
                        {card.location_area}
                      </p>
                      <p className="text-muted small mb-2">
                        {card.property_type_description} |{" "}
                        {card.category_type_title_holding_lottype_storey}
                        <br />
                        Built-up Size: {card.built_size} {card.built_size_unit}
                      </p>
                      <div className="d-flex flex-wrap gap-3 mb-3">
                        <span
                          className="d-flex align-items-center"
                          style={{ gap: "6px" }}
                        >
                          <FaBed /> {card.room}
                        </span>
                        <span
                          className="d-flex align-items-center"
                          style={{ gap: "6px" }}
                        >
                          <FaBath /> {card.bathroom}
                        </span>
                      </div>
                      {template === "template2" ? (
                        <div className="mt-auto pt-2 d-flex flex-column flex-md-row gap-2">
                          <button className="btn btn-outline-secondary w-100">
                            <i className="bi bi-whatsapp me-1"></i> Whatsapp
                          </button>
                          <button className="btn btn-outline-secondary w-100">
                            <i className="bi bi-info-circle me-1"></i> Details
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default DashboardListingT1;
