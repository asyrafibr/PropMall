import React, { useState, useEffect, useCallback } from "react";
import { getDoneDeal } from "../api/axiosApi";
import "./DoneDeal.css";
import { useNavigate } from "react-router-dom";
import { getFeaturedList } from "../api/axiosApi";
import { FaBed, FaBath, FaPhone, FaStar } from "react-icons/fa";

const DoneDeal = () => {
  const [doneDeal, setDoneDeal] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [modalImages, setModalImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeListingId, setActiveListingId] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [similarListing, setSimilarListing] = useState([]);

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
        setLoading(false);
      }
    };
    fetchFilterData();
  }, []);

  const handleOpenModal = (photos, index, listingId) => {
    setModalImages(photos);
    setModalImageIndex(index);
    setActiveListingId(listingId);
    setModalOpen(true);
    document.body.classList.add("no-scroll");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    document.body.classList.remove("no-scroll");
  };

  const showPrevImage = () => {
    setModalImageIndex((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  };

  const showNextImage = () => {
    setModalImageIndex((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
  };

  const slugify = (text) =>
    text?.toLowerCase().trim().replace(/\s+/g, "-") || "";

  const handleViewDetails = useCallback(
    (productId, title, location) => {
      const titleSlug = slugify(title);
      navigate(`/property/${titleSlug}`, {
        state: { productId, title, location, similarListing },
      });
    },
    [navigate]
  );

  const renderSkeletonCard = (_, index) => (
    <div key={index} className="col-12 col-md-4 mb-4 d-flex">
      <div className="card h-100 w-100 border-0 shadow-sm">
        <div
          className="skeleton-image"
          style={{ height: "260px", background: "#e0e0e0" }}
        ></div>
        <div className="card-body">
          <div
            className="skeleton-line mb-2"
            style={{ height: "20px", background: "#ddd", width: "60%" }}
          ></div>
          <div
            className="skeleton-line mb-1"
            style={{ height: "15px", background: "#eee", width: "80%" }}
          ></div>
          <div
            className="skeleton-line mb-1"
            style={{ height: "15px", background: "#eee", width: "50%" }}
          ></div>
          <div
            className="skeleton-line mb-1"
            style={{ height: "15px", background: "#eee", width: "70%" }}
          ></div>
          <div
            className="skeleton-line mt-3"
            style={{ height: "35px", background: "#ddd", width: "100%" }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ padding: "30px 60px 5px 60px" }}>
        <p
          style={{
            color: "#212529",
            fontSize: "16px",
            fontFamily: "Poppins",
            fontWeight: 600,
            margin: 0,
          }}
        >
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

                const statusText = isForSale
                  ? "For Sale"
                  : isForRental
                  ? "For Rent"
                  : "";
                const statusColor = isForSale
                  ? "#1E6754"
                  : isForRental
                  ? "#8ECA48"
                  : "#ccc";
                const belowMarket = card.below_market === "Y";

                const currentIndex = currentImageIndex[card.id_listing] || 0;

                return (
                  <div
                    key={card.id_listing}
                    className="col-12 col-md-4 mb-4 d-flex"
                  >
                    <div className="card h-100 d-flex flex-column border-0 shadow-sm w-100">
                      <div
                        className="position-relative image-carousel"
                        style={{ overflow: "hidden", height: "260px" }}
                        onClick={() =>
                          handleOpenModal(
                            card.photos,
                            currentIndex,
                            card.id_listing
                          )
                        }
                      >
                        <img
                          src={card.photos[currentIndex]}
                          alt={card.ads_title}
                          className="card-img-top"
                          style={{
                            height: "260px",
                            width: "100%",
                            objectFit: "cover",
                            userSelect: "none",
                            cursor: "pointer",
                          }}
                        />

                        <div
                          className="done-deal-banner"
                          style={{ paddingLeft: "20px" }}
                        >
                          Done Deals
                        </div>

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
                          {card.monetary_currency} {card.price}
                        </h5>
                        <p className="text-muted small mb-1">
                          ({card.built_price_per_sqft} per sqft)
                          <br />
                          <strong>{card.ads_title}</strong>
                          <br />
                          {card.location_area}, {card.location_state}
                        </p>
                        <p className="text-muted small mb-2">
                          {card.property_type_description} |
                          {card.category_type_title_holding_lottype_storey}
                          <br />
                          Built-up Size: {card.built_size}=
                          {card.built_size_unit}
                        </p>
                        <div className="mt-auto pt-3 border-top">
                          {/* Bed & Bath Info (left-aligned) */}
                          <div
                            className="d-flex align-items-center gap-4 flex-wrap"
                            style={{
                              fontSize: "16px",
                              color: "#444",
                              justifyContent: "flex-start",
                            }}
                          >
                            {card.room && (
                              <span
                                className="d-flex align-items-center"
                                style={{ gap: "6px" }}
                              >
                                <FaBed />
                                {card.room} beds
                              </span>
                            )}
                            {card.bathroom && (
                              <span
                                className="d-flex align-items-center"
                                style={{ gap: "6px" }}
                              >
                                <FaBath />
                                {card.bathroom} baths
                              </span>
                            )}
                          </div>

                          {/* Center-aligned buttons */}
                          <div className="d-flex justify-content-center mt-3">
                            <div className="d-flex align-items-center gap-3 flex-wrap justify-content-center">
                              <button
                                className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                                style={{
                                  width: "153px",
                                  height: "40px",
                                  gap: "6px",
                                  color: "#737373",
                                  borderColor: "#999999",
                                  fontSize: "13px",
                                  padding: "0",
                                }}
                              >
                                <i className="bi bi-whatsapp"></i> Whatsapp
                              </button>

                              <button
                                className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                                onClick={() =>
                                  handleViewDetails(
                                    card.id_listing,
                                    card.ads_title,
                                    card.location
                                  )
                                }
                                style={{
                                  width: "153px",
                                  height: "40px",
                                  gap: "6px",
                                  color: "#737373",
                                  borderColor: "#999999",
                                  fontSize: "13px",
                                  padding: "0",
                                }}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* <p className="mb-3">
                          <i className="bi bi-bed me-1"></i> {card.room || "-"}
                          &nbsp;&nbsp;
                          <i className="bi bi-droplet me-1"></i> {card.bathroom || "-"}
                        </p>
                        <div className="mt-auto pt-2 d-flex flex-column flex-md-row gap-2">
                          <button className="btn btn-outline-secondary w-100">
                            <i className="bi bi-whatsapp me-1"></i> Whatsapp
                          </button>
                          <button
                            className="btn btn-outline-secondary w-100"
                            onClick={() => handleViewDetails(card.id_listing, card.ads_title, card.location)}
                          >
                            <i className="bi bi-info-circle me-1"></i> Details
                          </button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {modalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={handleCloseModal}>
                &times;
              </button>
              <div className="modal-body">
                <img
                  src={modalImages[modalImageIndex]}
                  alt="Main View"
                  className="modal-image"
                />
                <div className="image-counter">
                  {modalImageIndex + 1} / {modalImages.length}
                </div>
                <button className="nav-button prev" onClick={showPrevImage}>
                  &#10094;
                </button>
                <button className="nav-button next" onClick={showNextImage}>
                  &#10095;
                </button>
                <div className="thumbnail-container">
                  {modalImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      className={`thumbnail ${
                        modalImageIndex === idx ? "active" : ""
                      }`}
                      onClick={() => setModalImageIndex(idx)}
                      alt={`Thumb ${idx}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DoneDeal;
