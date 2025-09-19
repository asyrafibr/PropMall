import React, { useEffect, useState, useRef,useCallback } from "react";
import { FaBed, FaBath } from "react-icons/fa";
import { useTemplate } from "../context/TemplateContext";
import "./SimilarListingCard.css";
import { useNavigate } from "react-router-dom";

const CARD_WIDTH = 335;
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
const handleViewDetails = useCallback(
  (productId, title, location, permalink, permalink_previous) => {
      console.log("DATA test",productId, title, location, permalink, permalink_previous)

    // ✅ Always prefer the latest permalink
    const targetLink = permalink || permalink_previous;

    if (!targetLink) {
      console.error("No permalink available for product:", productId);
      return;
    }

    navigate(targetLink, {
      state: {
        productId,
        title,
        location,
      },
    });
  },
  [navigate]
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
   <div className="container-fluid px-3 px-md-4 pt-5 position-relative">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h5 className="fw-bold">Similar Properties</h5>
    <a href="#" className="text-decoration-none">
      View all
    </a>
  </div>

  {/* Scroll buttons (hidden on mobile) */}
  {showLeft && (
    <button
      className="scroll-button left d-none d-md-flex"
      onClick={scrollLeft}
    >
      &#8249;
    </button>
  )}
  {showRight && (
    <button
      className="scroll-button right d-none d-md-flex"
      onClick={scrollRight}
    >
      &#8250;
    </button>
  )}

  {/* Scrollable wrapper */}
  <div className="scroll-wrapper" onScroll={handleScroll}>
    <div
      ref={scrollRef}
      id="scroll-container"
      className="scroll-container flex-md-row flex-column"
        onScroll={handleScroll}  // ✅ make sure this is here

    >
      {(listings ?? []).slice(0, 12).map((card) => {
        const modus = card.listing_modus?.toUpperCase();
        const isForSale = modus === "FOR SALE";
        const isForRental = modus === "FOR RENT";
        const statusText = isForSale
          ? "For Sale"
          : isForRental
          ? "For Rent"
          : "";
        const statusColor = isForSale ? "bg-orange" : isForRental ? "bg-teal" : "bg-secondary";
        const belowMarket = card.below_market === "Y";

        return (
          <div
            key={card.id_listing}
            className="card property-card shadow-sm border-0 flex-shrink-0"
          >
            <div className="position-relative">
              <img
                src={card.photos?.[0] || "https://via.placeholder.com/300x200"}
                className="card-img-top property-img"
                alt={card.ads_title}
                   onClick={() =>
                            handleViewDetails(
                              card.id_listing,
                              card.ads_title,
                              card.location,
                              card.permalink,
                              card.permalink_previous
                            )
                          }
              />
              {(statusText || belowMarket) && (
                <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1 z-2">
                  {statusText && (
                    <div
                      className={`d-flex align-items-center justify-content-center text-white fw-semibold status-badge ${statusColor}`}
                    >
                      {statusText}
                    </div>
                  )}
                  {belowMarket && (
                    <div className="d-flex align-items-center justify-content-center text-white fw-semibold below-badge">
                      Below Market
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold text-dark fs-5">
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
                <span className="d-flex align-items-center gap-2">
                  <FaBed /> {card.room}
                </span>
                <span className="d-flex align-items-center gap-2">
                  <FaBath /> {card.bathroom}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* Modal unchanged */}
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
              className={`thumbnail ${currentImageIndex === idx ? "active" : ""}`}
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
