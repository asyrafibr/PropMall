import React, { useEffect, useState, useRef } from "react";
import { FaBed, FaBath } from "react-icons/fa";
import { useTemplate } from "../../context/TemplateContext";
import "./DashboardListingT1.css"; // Create this for modal CSS
import bg from "../../image/titlebg3.png";
import { FaLocationDot } from "react-icons/fa6";
import builtIcon from "../../image/built_up.svg";
import landIcon from "../../image/land_size.svg";
import locationIcon from "../../image/size_built.svg";
import bathIcon from "../../image/bath.svg";
import bedIcon from "../../image/bed.svg";

const DashboardListingT1 = ({ listings, handleViewDetails }) => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailRefs = useRef([]);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const { agent, template, agentInfo } = useTemplate();
const openModal = (images) => {
  setModalImages(images);
  setCurrentImageIndex(0); // always reset to first image
  setModalOpen(true);
  thumbnailRefs.current = [];

  setTimeout(() => {
    const node = thumbnailRefs.current[0];
    if (node) {
      node.scrollIntoView({
        behavior: "auto",
        inline: "center",
        block: "nearest",
      });
    }
  }, 300);
};
  const showPrevImage = () => {
    setModalImageIndex((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.classList.remove("no-scroll"); // ✅ Restore scroll
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
      setModalImageIndex(0);

    document.body.classList.remove("no-scroll");
  };
  useEffect(() => {
    const thumbnailNode = thumbnailRefs.current[currentImageIndex];
    if (thumbnailNode) {
      thumbnailNode.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentImageIndex]);
  const showNextImage = () => {
    setModalImageIndex((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
  };
  const showPrev = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  const showNext = () =>
    setCurrentImageIndex((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
  const whatsappMessage = `Hello My Lovely Agent,\nI'm interested in the property that you advertise at website\n${window.location.href}\nand I would love to visit this property.\nMy name is:`;

  const getThumbnailSlice = () => {
    const total = modalImages.length;
    const start = Math.max(0, Math.min(currentImageIndex - 5, total - 10));
    const end = start + 10;
    return modalImages.slice(start, end);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (modalOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);
  const renderSkeletonCard = () => (
    <div className="col-12 col-md-4 mb-4 d-flex" key={Math.random()}>
      <div className="card h-100 w-100 border-0 shadow-sm">
        {/* Image skeleton */}
        <div className="bg-secondary bg-opacity-25 w-100 skeleton-img" />

        <div className="card-body">
          {/* Title skeleton */}
          <div className="bg-light mb-2 skeleton-title" />

          {/* Subtitle skeleton */}
          <div className="bg-light skeleton-subtitle" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-xl px-3 px-xl-0 py-5 mt-3">
      {/* Header */}
      <div
        className={`mb-4 ${
          template === "template3" ? "template3-header bg-cover p-2" : ""
        }`}
      >
        <span className="resp-title ps-3">Featured Listing</span>
      </div>

      {/* Listings Grid */}
      <div className="row gx-3 gy-4">
        {loading
          ? Array.from({ length: 6 }).map(renderSkeletonCard)
          : (listings ?? []).slice(0, 12).map((card) => {
              const modus = card.listing_modus?.toUpperCase();
              const isForSale = modus === "FOR SALE";
              const isForRental = modus === "FOR RENT";
              const showTag = isForSale || isForRental;
              const statusText = isForSale
                ? "For Sale"
                : isForRental
                ? "For Rent"
                : "";
              const statusColor = isForSale
                ? "bg-orange text-white"
                : isForRental
                ? "bg-info text-white"
                : "bg-secondary text-white";
              const belowMarket = card.below_market === "Y";

              return (
                <div
                  key={card.id_listing}
                  className="col-12 col-sm-6 col-lg-4 d-flex"
                >
                  <div className="card h-100 w-100 shadow-sm">
                    {/* Posted Date */}
                    <div className=" p-2 resp-text1">
                      Listed on {card.publish_dt}
                    </div>

                    {/* Image & Badges */}
                    <div className="position-relative overflow-hidden card-img-wrapper">
                      <img
                        src={
                          card.photos?.[0] ||
                          "https://via.placeholder.com/300x200"
                        }
                        className="card-img-top h-100 w-100 object-fit-cover cursor-pointer rounded-0"
                        alt={card.ads_title}
                        onClick={() => openModal(card.photos)}
                      />
                      {/* Badges */}
                      {(showTag || belowMarket) && (
                        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1 badge-container">
                          {showTag && (
                            <div
                              className={`d-flex align-items-center justify-content-start rounded resp-badge px-3 py-1 ${statusColor}`}
                            >
                              {statusText}
                            </div>
                          )}
                          {belowMarket && (
                            <div className="d-flex align-items-center justify-content-center rounded bg-success text-white resp-badge3 px-3 py-1 mt-1 below-market-badge">
                              Below Market
                            </div>
                          )}
                        </div>
                      )}

                      {/* Exclusive Ribbon */}
                      {card.exclusive === "Y" && (
                        <div className="corner-ribbon resp-badge2">
                          Exclusive
                        </div>
                      )}

                      {/* Photo Count */}
                      <span className="position-absolute bottom-0 end-0 m-2 text-white small">
                        <i className="bi bi-camera-fill me-1"></i>
                        {card.photos_count ?? 0}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="card-body d-flex flex-column flex-grow-1">
                      <h5 className="resp-title">
                        {card.listing_modus === "FOR SALE" && "Asking "}
                        {card.listing_modus === "NEW PROJECT" && "From "}
                        RM {card.price}
                        {card.listing_modus === "FOR RENT" && " /monthly"}
                      </h5>
                      <p className=" mb-1 resp-textTitle">{card.ads_title}</p>

                      <p className="text-muted mb-2 resp-text1">
                        {/* Location */}
                        <div className="row mt-2 text-muted resp-text1">
                          <div className="col-auto pe-0">
                            <img
                              src={locationIcon}
                              alt="Location Icon"
                              width={16}
                              height={16}
                              className="me-2"
                            />
                          </div>
                          <div className="col ps-0">
                            {card.location_description}
                          </div>
                        </div>

                        {/* Category / Type */}
                        <div
                          className="row mt-3 text-muted resp-text1"
                          style={{ lineHeight: "1.3" }}
                        >
                          <div className="col">
                            {card.category_type_title_holding_lottype_storey}
                          </div>
                        </div>

                        {/* Built-up and Land Size */}
                        {card.built_size && card.land_size && (
                          <>
                            <div className="row mt-2 text-muted resp-text1 lh-1">
                              <div className="col-auto pe-0">
                                <img
                                  src={builtIcon}
                                  alt="Built-up Icon"
                                  width={16}
                                  height={16}
                                  className="me-2"
                                />
                              </div>
                              <div className="col ps-0">
                                Built-up Size: {card.built_size}{" "}
                                {card.built_size_unit}{" "}
                                <small className="text-muted">
                                  (RM {card.built_price_per_sqft} per sqft)
                                </small>
                              </div>
                            </div>

                            <div className="row mt-2 text-muted resp-text1 lh-1">
                              <div className="col-auto pe-0">
                                <img
                                  src={landIcon}
                                  alt="Land Size Icon"
                                  width={16}
                                  height={16}
                                  className="me-2"
                                />
                              </div>
                              <div className="col ps-0">
                                Land Size: {card.land_size}{" "}
                                {card.land_size_unit}{" "}
                                <small className="text-muted">
                                  (RM {card.land_price_per_sqft} per sqft)
                                </small>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Only Land Size */}
                        {!card.built_size && card.land_size && (
                          <div className="row mt-2 text-muted resp-text1 lh-1">
                            <div className="col-auto pe-0">
                              <img
                                src={landIcon}
                                alt="Land Size Icon"
                                width={16}
                                height={16}
                                className="me-2"
                              />
                            </div>
                            <div className="col ps-0">
                              Land Size: {card.land_size} {card.land_size_unit}{" "}
                              <small className="text-muted">
                                (RM {card.land_price_per_sqft} per sqft)
                              </small>
                            </div>
                          </div>
                        )}
                      </p>

                      {/* Rooms & Bathrooms */}
                      {card.bathroom && card.room > 0 && (
                        <div className="d-flex flex-wrap gap-3 mb-3">
                          <span className="d-flex align-items-center  gap-2 resp-text1">
                            <img
                              src={bedIcon}
                              alt="Land Size Icon"
                              width={16}
                              height={16}
                              className="me-2"
                            />{" "}
                            {card.room}
                          </span>
                          <span className="d-flex align-items-center  gap-2 resp-text1">
                            <img
                              src={bathIcon}
                              alt="Land Size Icon"
                              width={16}
                              height={16}
                              className="me-2"
                            />{" "}
                            {card.bathroom}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="d-flex gap-2 mt-auto">
                        {/* 📱 Whatsapp */}
                        <a
                          className="btn btn-outline-secondary w-100 d-flex flex-sm-row flex-column align-items-center justify-content-center text-center gap-1"
                          href={`https://wa.me/${
                            agentInfo.whatsapp
                          }?text=${encodeURIComponent(card.text_message)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="bi bi-whatsapp fs-5"></i>
                          <span>Whatsapp</span>
                        </a>

                        {/* 📱 Details */}
                        <button
                          onClick={() =>
                            handleViewDetails(
                              card.id_listing,
                              card.ads_title,
                              card.location_state,
                              card.permalink,
                              card.permalink_previous,
                              card.listing_modus
                            )
                          }
                          className="btn btn-outline-secondary w-100 d-flex flex-sm-row flex-column align-items-center justify-content-center text-center gap-1"
                        >
                          <i className="bi bi-info-circle fs-5"></i>
                          <span>Details</span>
                        </button>

                        {/* 📱 Call Agent (only mobile) */}
                        <a
                          className="btn btn-outline-primary w-100 d-sm-none d-flex flex-column align-items-center justify-content-center text-center gap-1"
                          href={`tel:+${agentInfo.whatsapp}`} // ✅ phone number here
                        >
                          <i className="bi bi-telephone fs-5"></i>
                          <span>Call</span>
                        </a>
                      </div>
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
              {/* Wrap image + arrows together */}
              <div
                className="main-image-wrapper"
                style={{ position: "relative" }}
              >
                {/* Prev Button (always visible) */}
                <button
                  className="nav-button prev"
                  onClick={showPrevImage}
                  disabled={modalImageIndex === 0}
                >
                  &#10094;
                </button>

                {/* Main Image */}
                <img
                  src={modalImages[modalImageIndex]}
                  alt="Main View"
                  className="modal-image"
                />

                {/* Next Button (always visible) */}
                <button
                  className="nav-button next"
                  onClick={showNextImage}
                  disabled={modalImageIndex === modalImages.length - 1}
                >
                  &#10095;
                </button>
              </div>

              {/* Counter */}
              <div className="image-counter">
                {modalImageIndex + 1} / {modalImages.length}
              </div>

              {/* Thumbnails */}
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
  );
};

export default DashboardListingT1;
