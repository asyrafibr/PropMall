// src/pages/ProductDetailPage.js
import React, { useEffect, useState, useRef ,useCallback} from "react";
import { FaBed, FaBath } from "react-icons/fa";
import { getListings } from "../api/axiosApi";
import "./SalePages.css"; // Reuse existing CSS for modal
import { useNavigate } from "react-router-dom";

const SalesPage = () => {
  const [featuredList, setFeaturedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailRefs = useRef([]);
  const navigate = useNavigate();

  const hostname = window.location.hostname;
  const domain = hostname.replace(/^www\./, "").split(".")[0];
  const url_fe = window.location.href;

  const openModal = (images, index) => {
    setModalImages(images);
    setCurrentImageIndex(index);
    setModalOpen(true);
    thumbnailRefs.current = [];

    setTimeout(() => {
      const node = thumbnailRefs.current[index];
      if (node) {
        node.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
      }
    }, 300);
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.classList.remove("no-scroll");
  };

  useEffect(() => {
    const fetchFilterData = async () => {
      const payload = {
        domain,
        url_fe,
        listing_search: {
          page_num: 1,
          page_size: 10,
          search_text: null,
          search_fields: {
            title: true,
            description: true,
          },
          search_filters: {
            objective: {
              sale: true,
            },
            location: {
              id_country: 1,
              id_province: [],
              id_state: [],
              id_city: [],
              id_area: [],
            },
            property_category: null,
            property_holding: [],
            property_lot_type: [],
            room: { min: null, max: null },
            bathroom: { min: null, max: null },
            price: { min: null, max: null },
          },
        },
      };

      try {
        const res = await getListings(payload);
        setFeaturedList(res.data.listing_search.listing_rows || []);
        console.log('featuredList',res.data )
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    const node = thumbnailRefs.current[currentImageIndex];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentImageIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (modalOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  const showPrev = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
  const showNext = () =>
    setCurrentImageIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));
  const getThumbnailSlice = () => {
    const total = modalImages.length;
    const start = Math.max(0, Math.min(currentImageIndex - 5, total - 10));
    return modalImages.slice(start, start + 10);
  };

  const renderSkeletonCard = () => (
    <div className="col-12 col-md-4 mb-4 d-flex" key={Math.random()}>
      <div className="card h-100 w-100 border-0 shadow-sm">
        <div style={{ height: "260px", backgroundColor: "#ddd" }} />
        <div className="card-body">
          <div style={{ height: "20px", width: "60%", backgroundColor: "#e0e0e0", marginBottom: "10px" }} />
          <div style={{ height: "14px", width: "80%", backgroundColor: "#e0e0e0", marginBottom: "8px" }} />
        </div>
      </div>
    </div>
  );

  // const handleViewDetails = (id_listing, title, location) => {
  //   // Customize this logic for navigation
  //   console.log("View listing details:", { id_listing, title, location });
  // };
  const slugify = (text) =>
    text?.toLowerCase().trim().replace(/\s+/g, "-") || "";
    const handleViewDetails = useCallback(
      (productId, title, location) => {
        const titleSlug = slugify(title);
        console.log("productid", productId);
        navigate(`/property/${titleSlug}`, {
          state: {
            productId,
            title,
            location,
          },
        });
      },
      [navigate]
    );
  return (
    <div className="container-fluid" style={{ padding: "60px 70px" }}>
      <div style={{ marginBottom: "40px" }}>
        <span
          style={{
            fontWeight: 600,
            fontSize: "20px",
            fontFamily: "Poppins",
            paddingLeft: "20px",
          }}
        >
          Sale
        </span>
      </div>

      <div className="row mx-0">
        {loading
          ? Array.from({ length: 6 }).map(renderSkeletonCard)
          : featuredList.slice(0, 12).map((card, idx) => {
              const modus = card.listing_modus?.toUpperCase();
              const isForSale = modus === "FOR SALE";
              const isForRental = modus === "FOR RENT";
              const showTag = isForSale || isForRental;
              const statusText = isForSale ? "For Sale" : isForRental ? "For Rent" : "";
              const statusColor = isForSale ? "#FF7A00" : isForRental ? "#007B83" : "#ccc";
              const belowMarket = card.below_market === "Y";

              return (
                <div key={card.id_listing} className="col-12 col-md-4 mb-4 d-flex">
                  <div className="card h-100 d-flex flex-column w-100" style={{ borderRadius: "8px", boxShadow: "2px 2px 15px 0 rgba(0, 0, 0, 0.15)" }}>
                    <div className="mb-1" style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 400, padding: "12px" }}>
                      Posted on {card.publish_dt}
                    </div>
                    <div className="position-relative" style={{ overflow: "hidden", height: "260px" }}>
                      <img
                        src={card.photos?.[0] || "https://via.placeholder.com/300x200"}
                        className="card-img-top"
                        alt={card.ads_title}
                        style={{ height: "100%", width: "100%", objectFit: "cover", cursor: "pointer" }}
                        onClick={() => openModal(card.photos || [], 0)}
                      />
                      {(showTag || belowMarket) && (
                        <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1" style={{ zIndex: 2 }}>
                          {showTag && (
                            <div style={{ backgroundColor: statusColor, width: "100px", height: "32px", borderRadius: "4px", color: "white", padding: "8px 16px", display: "flex", fontFamily: "Poppins", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "16px" }}>
                              {statusText}
                            </div>
                          )}
                          {belowMarket && (
                            <div style={{ display: "flex", padding: "4px 12px", justifyContent: "center", alignItems: "flex-start", borderRadius: "4px", backgroundColor: "#7C9A2C", width: "150px", height: "30px", color: "#FAFAFA", fontFamily: "Poppins", fontSize: "16px", fontWeight: 600, marginTop: "5px" }}>
                              Below Market
                            </div>
                          )}
                        </div>
                      )}
                      {card.exclusive === "Y" && <div className="corner-ribbon">Exclusive</div>}
                      <span className="position-absolute bottom-0 end-0 m-2 text-white small">
                        <i className="bi bi-camera-fill me-1"></i>
                        {card.photos_count ?? 0}
                      </span>
                    </div>
                    <div className="card-body d-flex flex-column flex-grow-1">
                      <h5 style={{ fontSize: "20px", fontWeight: 600, fontFamily: "Poppins" }}>RM {card.price}</h5>
                      <p className="text-muted mb-1">
                        <div style={{ fontSize: "20px", fontWeight: 400, fontFamily: "Poppins" }}>{card.ads_title}</div>
                        <div style={{ fontSize: "16px", fontWeight: 400, fontFamily: "Poppins" }}>{card.location_area}</div>
                      </p>
                      <div className="mt-auto">
                        {card.bathroom && card.room > 0 && (
                          <div className="d-flex flex-wrap gap-3 mb-3">
                            <span className="d-flex align-items-center" style={{ gap: "6px" }}><FaBed /> {card.room}</span>
                            <span className="d-flex align-items-center" style={{ gap: "6px" }}><FaBath /> {card.bathroom}</span>
                          </div>
                        )}
                        <div className="d-flex flex-column flex-md-row gap-2">
                          <button className="btn btn-outline-secondary w-100"><i className="bi bi-whatsapp me-1"></i> Whatsapp</button>
                          <button onClick={() => handleViewDetails(card.id_listing, card.ads_title, card.location)} className="btn btn-outline-secondary w-100"><i className="bi bi-info-circle me-1"></i> Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>&times;</button>
            <div className="modal-body">
              <img src={modalImages[currentImageIndex]} alt="Full" className="modal-image" />
              <div className="image-counter">{currentImageIndex + 1} / {modalImages.length}</div>
              {modalImages.length > 1 && (
                <>
                  <button className="nav-button prev" onClick={showPrev}>&#10094;</button>
                  <button className="nav-button next" onClick={showNext}>&#10095;</button>
                </>
              )}
              <div className="thumbnail-container">
                {getThumbnailSlice().map((img, idx) => {
                  const actualIndex = Math.max(0, Math.min(currentImageIndex - 5, modalImages.length - 10)) + idx;
                  return (
                    <img
                      key={actualIndex}
                      ref={(el) => (thumbnailRefs.current[actualIndex] = el)}
                      src={img}
                      alt={`Thumbnail ${actualIndex}`}
                      className={`thumbnail ${currentImageIndex === actualIndex ? "active" : ""}`}
                      onClick={() => setCurrentImageIndex(actualIndex)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
