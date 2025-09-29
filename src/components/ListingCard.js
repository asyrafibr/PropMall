import React, { useEffect, useState, useRef } from "react";
import { FaBed, FaBath, FaPhone, FaStar } from "react-icons/fa";
import { useTemplate } from "../context/TemplateContext";
import { FaLocationDot } from "react-icons/fa6";
import builtIcon from "../image/built_up.svg";
import landIcon from "../image/land_size.svg";
import "./ListingCard.css";
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
    permalink,
    permalink_previous,
    text_message,
    location_description,
    land_size,
    built_price_per_sqft,
    land_price_per_sqft,
    land_size_unit,
    land_price_per_unit,
    built_size_unit,
    publish_dt,
  } = product;
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const thumbnailRefs = useRef([]);
  const { agent, template, agentInfo } = useTemplate();

  const [modalImageIndex, setModalImageIndex] = useState(0);
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
  const handleCloseModal = () => {
    setModalOpen(false);
    document.body.classList.remove("no-scroll");
  };
  const whatsappMessage = `Hello My Lovely Agent,\nI'm interested in the property that you advertise at website\n${window.location.href}\nand I would love to visit this property.\nMy name is:`;

  const openModal = (images, index) => {
    setModalImages(images);
    setCurrentImageIndex(index);
    setModalOpen(true);
    thumbnailRefs.current = [];

    thumbnailRefs.current = [];

    setTimeout(() => {
      const node = thumbnailRefs.current[index];
      if (node) {
        node.scrollIntoView({
          behavior: "auto",
          inline: "center",
          block: "nearest",
        });
      }
    }, 300);
  };
  const location = `${location_area}, ${location_state}`;
  const photo1 = photos?.[0] || "https://via.placeholder.com/860x300";

  const modus = listing_modus?.toUpperCase();
  const isForSale = modus === "FOR SALE";
  const isForRent = modus === "FOR RENT";
  const statusText = isForSale ? "For Sale" : isForRent ? "For Rent" : "";
      const statusColor = isForSale
                ? "bg-orange text-white"
                : isForRent
                ? "bg-info text-white"
                : "bg-secondary text-white";  const isBelowMarket = below_market === "Y";

  return (
    <div className="d-flex justify-content-center mb-3">
      <div className="card w-100">
        <div className="p-2 resp-text1">Listed on {publish_dt}</div>

        {/* Image full width, no side padding */}
        <div
          className="position-relative mb-3 overflow-hidden rounded-0"
          style={{ height: "300px" }}
        >
          <img
            src={photo1}
            alt={ads_title}
            className="card-img-top h-100 w-100 object-fit-cover cursor-pointer rounded-0"
            onClick={() => openModal(photos || [], 0)}
          />

          {/* Tag Badges */}
          {(statusText || isBelowMarket) && (
           <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1 badge-container">
                          {statusText && (
                            <div
                              className={`d-flex align-items-center justify-content-start rounded resp-badge px-3 py-1 ${statusColor}`}
                            >
                              {statusText}
                            </div>
                          )}
                          {isBelowMarket && (
                            <div className="d-flex align-items-center justify-content-center rounded bg-success text-white resp-badge3 px-3 py-1 mt-1 below-market-badge">
                              Below Market
                            </div>
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

          <span className="position-absolute bottom-0 end-0 m-2 text-white small">
            <i className="bi bi-camera-fill me-1"></i>
            {photos.length ?? 0}
          </span>
        </div>

        {/* Content with padding */}
        <div className="p-3">
          {/* Price + Save */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="fw-bold fs-5">
              {listing_modus === "FOR SALE" && "Asking "}
              {listing_modus === "NEW PROJECT" && "From "}
              {monetary_currency} {price}
              {listing_modus === "FOR RENT" && " /month"}
            </div>
          </div>

          {/* Title */}
          <h6 className="fw-normal mb-1 fs-6">{ads_title}</h6>

          {/* Location */}
          {/* <p className="text-muted mb-1 small">{location}</p>

          <p className="text-muted mb-3 small d-flex flex-wrap align-items-center">
            <span>{category_type_title_holding_lottype_storey}</span>
            {built_size && (
              <>
                <span className="mx-2">&bull;</span>
                <span>Built-up size: {built_size} sqft</span>
              </>
            )}
          </p> */}
          <p className="text-muted mb-2 resp-text1">
            <div className="d-flex align-items-center gap-2 mt-2">
              <FaLocationDot className="text-secondary" />{" "}
              {/* Bootstrap gray */}
              <span>{location_description}</span>
            </div>

            <br />
            {category_type_title_holding_lottype_storey}
            <br />
            {built_size && land_size && (
              <>
                <div className="d-flex align-items-center mb-1">
                  <img
                    src={builtIcon}
                    alt="Built-up Icon"
                    width={16}
                    height={16}
                    className="me-2"
                  />
                  <span>
                    Built-up Size: {built_size} {built_size_unit}{" "}
                    <small className="text-muted">
                      (RM {built_price_per_sqft} per sqft)
                    </small>
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  <img
                    src={landIcon}
                    alt="Land Size Icon"
                    width={16}
                    height={16}
                    className="me-2"
                  />
                  <span>
                    Land Size: {land_size} {land_size_unit}{" "}
                    <small className="text-muted">
                      (RM {land_price_per_sqft} per sqft)
                    </small>
                  </span>
                </div>
              </>
            )}

            {!built_size && land_size && (
              <>
                <div className="d-flex align-items-center">
                  <img
                    src={landIcon}
                    alt="Land Size Icon"
                    width={16}
                    height={16}
                    className="me-2"
                  />
                  <span>
                    Land Size: {land_size} {land_size_unit}{" "}
                    <small className="text-muted">
                      (RM {land_price_per_sqft} per sqft)
                    </small>
                  </span>
                </div>
              </>
            )}
          </p>

          {/* Room / Bath and Buttons */}
          <div className="d-flex flex-column justify-content-between align-items-start gap-3 mt-auto">
            {/* 🛏️ Bedroom & 🚿 Bathroom */}
            <div className="d-flex flex-row text-secondary small gap-2">
              {room && (
                <span className="d-flex align-items-center gap-2">
                  <FaBed /> {room}
                </span>
              )}
              {bathroom && (
                <span className="d-flex align-items-center gap-2">
                  <FaBath /> {bathroom}
                </span>
              )}
            </div>

            {/* 📞 Buttons */}
            {/* 📱 Mobile Call button (only visible on mobile) */}
            {/* 📱 Mobile buttons (Call + WhatsApp + Details) */}
            {/* 📱 Mobile buttons (icons only) */}
            {/* 📱 Mobile (icon + text stacked, centered) */}
            {/* 📱 Mobile (icon + text stacked, grey style) */}
            <div className="d-flex flex-row w-100 gap-2 d-sm-none">
              <a
                href={`tel:+${agentInfo.phone || agentInfo.whatsapp || ""}`}
                className="btn btn-outline-secondary text-secondary w-100 d-flex flex-column align-items-center justify-content-center"
              >
                <FaPhone className="fs-5 text-secondary" />
                <span className="small text-secondary">Call</span>
              </a>

              <a
                href={`https://wa.me/${
                  agentInfo.whatsapp
                }?text=${encodeURIComponent(text_message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary text-secondary w-100 d-flex flex-column align-items-center justify-content-center"
              >
                <i className="bi bi-whatsapp fs-5 text-secondary"></i>
                <span className="small text-secondary">Whatsapp</span>
              </a>

              <button
                className="btn btn-outline-secondary text-secondary w-100 d-flex flex-column align-items-center justify-content-center"
                onClick={() =>
                  handleViewDetails(
                    id_listing,
                    ads_title,
                    location,
                    permalink,
                    permalink_previous
                  )
                }
              >
                <i className="bi bi-info-circle fs-5 text-secondary"></i>
                <span className="small text-secondary">Details</span>
              </button>
            </div>

            {/* 💻 Desktop/Tablet (icons + text, grey style) */}
            <div className="d-none d-sm-flex flex-row w-100 gap-2 justify-content-end">
              <a
                href={`https://wa.me/${
                  agentInfo.whatsapp
                }?text=${encodeURIComponent(text_message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary text-secondary d-flex align-items-center justify-content-center gap-2"
              >
                <i className="bi bi-whatsapp text-secondary"></i>
                Whatsapp
              </a>

              <button
                className="btn btn-outline-secondary text-secondary d-flex align-items-center justify-content-center gap-2"
                onClick={() =>
                  handleViewDetails(
                    id_listing,
                    ads_title,
                    location,
                    permalink,
                    permalink_previous
                  )
                }
              >
                <i className="bi bi-info-circle text-secondary"></i>
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>

            <div className="modal-body">
              {/* Wrap image + arrows together */}
              <div className="main-image-wrapper">
                {/* Prev Button (always visible, disabled if first) */}
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

                {/* Next Button (always visible, disabled if last) */}
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

export default ListingCard;
