import React, { useEffect, useState, useRef } from "react";
import { FaBed, FaBath } from "react-icons/fa";
import { useTemplate } from "../../context/TemplateContext";
import "./DashboardListingT1.css"; // Create this for modal CSS
import bg from "../../image/titlebg3.png";
const DashboardListingT1 = ({ listings, handleViewDetails }) => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { template } = useTemplate();
  const thumbnailRefs = useRef([]);

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

  const closeModal = () => {
    setModalOpen(false);
    document.body.classList.remove("no-scroll"); // ✅ Restore scroll
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  const showPrev = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );
  const showNext = () =>
    setCurrentImageIndex((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );
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
        <div style={{ height: "260px", backgroundColor: "#ddd" }} />
        <div className="card-body">
          <div
            style={{
              height: "20px",
              width: "60%",
              backgroundColor: "#e0e0e0",
              marginBottom: "10px",
            }}
          />
          <div
            style={{
              height: "14px",
              width: "80%",
              backgroundColor: "#e0e0e0",
              marginBottom: "8px",
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-5 px-5 mt-3">
      {/* Header */}
      <div
        className={`mb-4 ${template === "template3" ? "bg-cover p-2" : ""}`}
        style={
          template === "template3" ? { backgroundImage: `url(${bg})` } : {}
        }
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
                <div key={card.id_listing} className="col-12 col-md-4 d-flex">
                  <div className="card h-100 w-100 shadow-sm">
                    {/* Posted Date */}
                    <div className="mb-1 p-3 resp-text1">
                      Posted on {card.publish_dt}
                    </div>

                    {/* Image & Badges */}
                    <div
                      className="position-relative overflow-hidden"
                      style={{ height: "260px" }}
                    >
                      <img
                        src={
                          card.photos?.[0] ||
                          "https://via.placeholder.com/300x200"
                        }
                        className="card-img-top h-100 w-100 object-fit-cover"
                        alt={card.ads_title}
                        style={{ cursor: "pointer" }}
                        onClick={() => openModal(card.photos || [], 0)}
                      />

                      {/* Badges */}
                      {(showTag || belowMarket) && (
                        <div
                          className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1"
                          style={{ zIndex: 1 }}
                        >
                          {showTag && (
                            <div
                              className={`d-flex align-items-center justify-content-center rounded resp-badge px-3 py-1 ${statusColor}`}
                            >
                              {statusText}
                            </div>
                          )}
                          {belowMarket && (
                            <div
                              className="d-flex align-items-center justify-content-center rounded bg-success text-white resp-badge px-3 py-1 mt-1"
                              style={{ width: "150px", height: "30px" }}
                            >
                              Below Market
                            </div>
                          )}
                        </div>
                      )}

                      {/* Exclusive Ribbon */}
                      {card.exclusive === "Y" && (
                        <div className="corner-ribbon">Exclusive</div>
                      )}

                      {/* Photo Count */}
                      <span className="position-absolute bottom-0 end-0 m-2 text-white small">
                        <i className="bi bi-camera-fill me-1"></i>
                        {card.photos_count ?? 0}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="card-body d-flex flex-column flex-grow-1">
                      <h5 className="resp-title">RM {card.price}</h5>

                      <p className="text-muted mb-1 resp-text1">
                        {card.ads_title}
                        <br />
                        {card.location_area}
                      </p>

                      <p className="text-muted mb-2 resp-text1">
                        {card.category_type_title_holding_lottype_storey}
                        <br />
                        {card.built_size && (
                          <>
                            Built-up Size: {card.built_size}
                            {card.built_size_unit}
                          </>
                        )}
                        {!card.built_size && card.land_size && (
                          <>
                            Land Size: {card.land_size} {card.land_size_unit}
                          </>
                        )}
                      </p>

                      {/* Rooms & Bathrooms */}
                      {card.bathroom && card.room > 0 && (
                        <div className="d-flex flex-wrap gap-3 mb-3">
                          <span className="d-flex align-items-center gap-2 resp-text1">
                            <FaBed /> {card.room}
                          </span>
                          <span className="d-flex align-items-center gap-2 resp-text1">
                            <FaBath /> {card.bathroom}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="d-flex gap-2 mt-auto">
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
                </div>
              );
            })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-flex justify-content-center align-items-start"
          style={{ paddingTop: "5vh" }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3"
                onClick={closeModal}
              ></button>
              <div className="modal-body p-0">
                <img
                  src={modalImages[currentImageIndex]}
                  alt="Full"
                  className="img-fluid w-100"
                />
                <div className="position-absolute top-0 start-50 translate-middle-x mt-2 bg-dark text-white rounded px-2">
                  {currentImageIndex + 1} / {modalImages.length}
                </div>

                {/* Arrows */}
                {modalImages.length > 1 && (
                  <>
                    <button
                      className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
                      onClick={showPrev}
                    >
                      &#10094;
                    </button>
                    <button
                      className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
                      onClick={showNext}
                    >
                      &#10095;
                    </button>
                  </>
                )}

                {/* Thumbnails */}
                <div className="d-flex overflow-auto mt-2 p-2">
                  {getThumbnailSlice().map((img, idx) => {
                    const actualIndex =
                      Math.max(
                        0,
                        Math.min(currentImageIndex - 5, modalImages.length - 10)
                      ) + idx;
                    return (
                      <img
                        key={actualIndex}
                        src={img}
                        alt={`Thumbnail ${actualIndex}`}
                        className={`img-thumbnail me-2 ${
                          currentImageIndex === actualIndex
                            ? "border-primary"
                            : ""
                        }`}
                        style={{ width: "80px", cursor: "pointer" }}
                        onClick={() => setCurrentImageIndex(actualIndex)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardListingT1;
