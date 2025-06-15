// DoneDeal.jsx

import React, { useState, useEffect } from "react";
import { getDoneDeal } from "../api/axiosApi";
import "./DoneDeal.css";
import { useNavigate } from "react-router-dom";

const DoneDeal = () => {
  const [doneDeal, setDoneDeal] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [animState, setAnimState] = useState({}); // { [id]: { phase: 'idle' | 'out' | 'in', direction: 'left' | 'right', nextIndex: number } }
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state

 
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const doneDealRes = await getDoneDeal();
        const data = doneDealRes.data.donedeal_search.donedeal_rows;
        setDoneDeal(data);

        const initialIndexes = {};
        data.forEach((card) => {
          initialIndexes[card.id_listing] = 0;
        });
        setCurrentImageIndex(initialIndexes);
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchFilterData();
  }, []);

  // Helper to trigger slide animation and update image index accordingly
  const startSlide = (id, newIndex, direction) => {
    setAnimState((prev) => ({
      ...prev,
      [id]: { phase: "out", direction, nextIndex: newIndex },
    }));

    // Slide out duration (250ms)
    setTimeout(() => {
      // Update current image index
      setCurrentImageIndex((prev) => ({
        ...prev,
        [id]: newIndex,
      }));

      // Start slide in
      setAnimState((prev) => ({
        ...prev,
        [id]: { phase: "in", direction, nextIndex: newIndex },
      }));

      // After slide in, reset animation state (250ms)
      setTimeout(() => {
        setAnimState((prev) => ({
          ...prev,
          [id]: { phase: "idle", direction: null, nextIndex: null },
        }));
      }, 250);
    }, 250);
  };

  const handlePrev = (id, length) => {
    const currentIndex = currentImageIndex[id] || 0;
    const newIndex = (currentIndex - 1 + length) % length;
    startSlide(id, newIndex, "left");
  };

  const handleNext = (id, length) => {
    const currentIndex = currentImageIndex[id] || 0;
    const newIndex = (currentIndex + 1) % length;
    startSlide(id, newIndex, "right");
  };
    const handleClick = (id) => {
    navigate(`/donedeal/${id}`, {
      state: {
        listingCard: id, // pass the whole object or selected fields
      },
    });
  };

  const renderSkeletonCard = (_, index) => (
    <div key={index} className="col-12 col-md-4 mb-4 d-flex">
      <div className="card h-100 w-100 border-0 shadow-sm">
        <div className="skeleton-image" style={{ height: "260px", background: "#e0e0e0" }}></div>
        <div className="card-body">
          <div className="skeleton-line mb-2" style={{ height: "20px", background: "#ddd", width: "60%" }}></div>
          <div className="skeleton-line mb-1" style={{ height: "15px", background: "#eee", width: "80%" }}></div>
          <div className="skeleton-line mb-1" style={{ height: "15px", background: "#eee", width: "50%" }}></div>
          <div className="skeleton-line mb-1" style={{ height: "15px", background: "#eee", width: "70%" }}></div>
          <div className="skeleton-line mt-3" style={{ height: "35px", background: "#ddd", width: "100%" }}></div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div style={{ padding: "30px 60px 5px 60px" }}>
        <p style={{ color: "#212529", fontSize: "16px", fontFamily: "Poppins", fontWeight: 600, margin: 0 }}>
          Done Deals
        </p>
      </div>

      <div className="container-fluid" style={{ padding: "0 50px" }}>
        <div className="row mx-0">
          {loading
            ? Array.from({ length: 6 }).map(renderSkeletonCard)
            : doneDeal.map((card) => {
                const modus = card.listing_modus?.toUpperCase();
                const isForSale = modus === "FOR SALE";
                const isForRental = modus === "FOR RENTAL";
                const showTag = isForSale || isForRental;

                const statusText = isForSale ? "For Sale" : isForRental ? "For Rent" : "";
                const statusColor = isForSale ? "#1E6754" : isForRental ? "#8ECA48" : "#ccc";
                const belowMarket = card.below_market === "Y";

                const currentIndex = currentImageIndex[card.id_listing] || 0;
                const animation = animState[card.id_listing] || { phase: "idle", direction: null, nextIndex: null };

                return (
                  <div key={card.id_listing} className="col-12 col-md-4 mb-4 d-flex">
                    <div className="card h-100 d-flex flex-column border-0 shadow-sm w-100">
                      <p className="text-muted small mb-2" style={{ paddingTop: "10px" }}>
                        <span style={{ padding: "20px", color: "#212529" }}>
                          Posted on {card.publish_dt}
                        </span>
                      </p>

                      <div className="position-relative image-carousel" style={{ overflow: "hidden", height: "260px" }}>
                        {animation.phase === "out" && (
                          <img
                            src={card.photos[currentIndex]}
                            alt={card.ads_title}
                            className={`card-img-top slide-out-${animation.direction}`}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              height: "260px",
                              width: "100%",
                              objectFit: "cover",
                              userSelect: "none",
                              pointerEvents: "none",
                            }}
                          />
                        )}
                        {(animation.phase === "in" || animation.phase === "idle") && (
                          <img
                            src={
                              animation.phase === "in"
                                ? card.photos[animation.nextIndex]
                                : card.photos[currentIndex]
                            }
                            alt={card.ads_title}
                            className={`card-img-top ${
                              animation.phase === "in" ? `slide-in-${animation.direction}` : ""
                            }`}
                            style={{
                              height: "260px",
                              width: "100%",
                              objectFit: "cover",
                              userSelect: "none",
                              pointerEvents: "none",
                            }}
                          />
                        )}

                        <div className="done-deal-banner" style={{ paddingLeft: "20px" }}>
                          Done Deals
                        </div>

                        {card.photos?.length > 1 && (
                          <>
                            <button
                              className="carousel-arrow left"
                              onClick={() => handlePrev(card.id_listing, card.photos.length)}
                              aria-label="Previous Image"
                            >
                              &#8249;
                            </button>
                            <button
                              className="carousel-arrow right"
                              onClick={() => handleNext(card.id_listing, card.photos.length)}
                              aria-label="Next Image"
                            >
                              &#8250;
                            </button>
                          </>
                        )}

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
                          <i className="bi bi-camera-fill me-1"></i> {card.photos_count ?? 0}
                        </span>
                      </div>

                      <div className="card-body d-flex flex-column flex-grow-1">
                        <h5 className="card-title fw-bold text-dark">
                          RM {Number(card.price).toLocaleString()}
                        </h5>
                        <p className="text-muted small mb-1">
                          ({card.built_price_per_sqft} per sqft)
                          <br />
                          <strong>{card.ads_title}</strong>
                          <br />
                          {card.location_area}, {card.location_state}
                        </p>
                        <p className="text-muted small mb-2">
                          {card.property_type_description} | {card.category_type_title_holding_lottype_storey}
                          <br />
                          Built-up Size: {card.built_size} {card.built_size_unit}
                        </p>
                        <p className="mb-3">
                          <i className="bi bi-bed me-1"></i> {card.room || "-"}
                          &nbsp;&nbsp;
                          <i className="bi bi-droplet me-1"></i> {card.bathroom || "-"}
                        </p>

                        <div className="mt-auto pt-2 d-flex flex-column flex-md-row gap-2">
                          <button className="btn btn-outline-secondary w-100">
                            <i className="bi bi-whatsapp me-1"></i> Whatsapp
                          </button>
                          <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => handleClick(card.id_listing)}
                          >
                            <i className="bi bi-info-circle me-1"></i> Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default DoneDeal;
