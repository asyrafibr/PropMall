import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaBed, FaBath } from "react-icons/fa";
import { useTemplate } from "../context/TemplateContext";
import "./SimilarListingCard.css";
import { useNavigate } from "react-router-dom";

const CARD_WIDTH = 550;
const GAP = 20;
const SCROLL_STEP = (CARD_WIDTH + GAP) * 3;

const SimilarListing = ({ listings }) => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const { template } = useTemplate();
  const thumbnailRefs = useRef([]);
  const scrollRef = useRef();
  const navigate = useNavigate();
  const [similarListing, setSimilarListing] = useState([]);

  const openModal = (images, index) => {
    setModalImages(images);
    setCurrentImageIndex(index);
    setModalOpen(true);
    thumbnailRefs.current = [];
    setTimeout(() => {
      const node = thumbnailRefs.current[index];
      if (node) {
        node.scrollIntoView({ behavior: "auto", inline: "center" });
      }
    }, 300);
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
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const node = thumbnailRefs.current[currentImageIndex];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [currentImageIndex]);

  const closeModal = () => setModalOpen(false);

  const showPrev = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );

  const showNext = () =>
    setCurrentImageIndex((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    setShowLeft(container.scrollLeft > 0);
    setShowRight(
      container.scrollLeft + container.offsetWidth < container.scrollWidth - 1
    );
  };

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });
  };

  return (
    <div
      className="container-fluid px-4"
      style={{ paddingTop: "60px", position: "relative" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">Similar Properties</h5>
        {/* <a href="#" className="text-decoration-none">View all</a> */}
      </div>

      {/* Scroll buttons outside the scroll wrapper */}
      {showLeft && (
        <button className="scroll-button left" onClick={scrollLeft}>
          &#8249;
        </button>
      )}
      {showRight && (
        <button className="scroll-button right" onClick={scrollRight}>
          &#8250;
        </button>
      )}

      <div className="scroll-wrapper" onScroll={handleScroll}>
        <div
          ref={scrollRef}
          id="scroll-container"
          className="scroll-container"
          onScroll={handleScroll}
          style={{
            display: "flex",
            justifyContent:
              (listings?.length ?? 0) <= 3 ? "center" : "flex-start",
            gap: "16px", // keeps spacing between cards
            overflowX: "auto",
          }}
        >
          {(listings ?? []).slice(0, 3).map((card, idx) => {
            const modus = card.listing_modus?.toUpperCase();
            const isForSale = modus === "FOR SALE";
            const isForRental = modus === "FOR RENT";
            const statusText = isForSale
              ? "For Sale"
              : isForRental
              ? "For Rent"
              : "";
            const statusColor = isForSale
              ? "#FF7A00"
              : isForRental
              ? "#007B83"
              : "#ccc";
            const belowMarket = card.below_market === "Y";

            return (
              <div
                key={card.id_listing}
                className="card shadow-sm border-0"
                style={{
                  flex: "0 0 auto",
                  width: `${CARD_WIDTH}px`,
                  height: "582px",
                  borderRadius: "8px",
                }}
              >
                <text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins",
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 10,
                  }}
                >
                  Posted on {card.publish_dt}
                </text>

                <div className="position-relative">
                  <img
                    src={
                      card.photos?.[0] || "https://via.placeholder.com/300x200"
                    }
                    className="card-img-top"
                    alt={card.ads_title}
                    style={{
                      height: "260px",
                      objectFit: "cover",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => openModal(card.photos || [], 0)}
                  />
                  {(statusText || belowMarket) && (
                    <div
                      className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1"
                      style={{ zIndex: 2 }}
                    >
                      {statusText && (
                        <div
                          style={{
                            backgroundColor: statusColor,
                            width: "100px",
                            height: "32px",
                            borderRadius: "4px",
                            color: "white",
                            fontSize: "16px",
                            display: "flex",
                            fontFamily: "Poppins",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                          }}
                        >
                          {statusText}
                        </div>
                      )}
                      {belowMarket && (
                        <div
                          style={{
                            display: "flex",
                            padding: "4px 12px",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "4px",
                            backgroundColor: "#7C9A2C",
                            width: "150px",
                            height: "30px",
                            color: "#FAFAFA",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                        >
                          Below Market
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className="card-body d-flex flex-column"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
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
                    {card.built_size && (
                      <div>
                        Built-up Size: {card.built_size} {card.built_size_unit}
                      </div>
                    )}
                    {!card.built_size && card.land_size && (
                      <div>
                        Land Size: {card.land_size} {card.land_size_unit}
                      </div>
                    )}
                    {card.built_size && card.land_size && (
                      <div>
                        Land Size: {card.land_size} {card.land_size_unit}
                      </div>
                    )}
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

                  {/* Push buttons to bottom */}
                  <div className="d-flex flex-column flex-md-row gap-2 mt-auto">
                    <button className="btn btn-outline-secondary w-100">
                      <i className="bi bi-whatsapp me-1"></i> Whatsapp
                    </button>
                    <button
                      onClick={() =>
                        handleViewDetails(
                          card.id_listing,
                          card.ads_title,
                          card.location
                        )
                      }
                      className="btn btn-outline-secondary w-100"
                    >
                      <i className="bi bi-info-circle me-1"></i> Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <img
              src={modalImages[currentImageIndex]}
              alt="Full"
              className="modal-image"
            />
            <div className="image-counter">
              {currentImageIndex + 1} / {modalImages.length}
            </div>
            {modalImages.length > 1 && (
              <>
                <button className="nav-button prev" onClick={showPrev}>
                  &#10094;
                </button>
                <button className="nav-button next" onClick={showNext}>
                  &#10095;
                </button>
              </>
            )}
            <div className="thumbnail-container">
              {modalImages.map((img, idx) => (
                <img
                  key={idx}
                  ref={(el) => (thumbnailRefs.current[idx] = el)}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className={`thumbnail ${
                    currentImageIndex === idx ? "active" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimilarListing;
