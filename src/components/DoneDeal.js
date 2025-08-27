import React, { useState, useEffect, useCallback } from "react";
import { getDoneDeal } from "../api/axiosApi";
import "./DoneDeal.css";
import { useNavigate } from "react-router-dom";
import { getFeaturedList } from "../api/axiosApi";
import { FaBed, FaBath, FaPhone, FaStar } from "react-icons/fa";
import { useTemplate } from "../context/TemplateContext";
import bg from "../image/titlebg3.png";

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
  const { template } = useTemplate();

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
  // Helper: ordinal suffix (1st, 2nd, 3rd, 4th, …)
  // --- Helpers ---
  function ordinalSuffix(n) {
    const j = n % 10,
      k = n % 100;
    if (k >= 11 && k <= 13) return "th";
    if (j === 1) return "st";
    if (j === 2) return "nd";
    if (j === 3) return "rd";
    return "th";
  }

  function formatPostedDate(date, { timeZone } = {}) {
    // Format month name with Intl; fall back if needed
    const day = date.getDate();
    const year = date.getFullYear();

    let month;
    try {
      month = new Intl.DateTimeFormat("en-GB", {
        month: "long",
        timeZone: timeZone || undefined,
      }).format(date);
    } catch {
      month = date.toLocaleString("en-US", { month: "long" });
    }

    return `${day}${ordinalSuffix(day)} ${month} ${year}`;
  }

  // --- Main ---
  /**
   * postedOn("3 days ago at 7:31 PM") -> "Posted on 24th August 2024"
   * postedOn("Saturday 26th July 2025") -> "Posted on 26th July 2025"
   *
   * Supports:
   *  - "X days ago", "yesterday", "today", "X hours ago", "X minutes ago"
   *  - "26th July 2025" or "Saturday 26th July 2025" (day name optional)
   *  - Fallback to Date(...) for other absolute formats
   *
   * @param {string} input
   * @param {Object} options
   * @param {Date}   options.now        (optional) override "now" for testing
   * @param {string} options.timeZone   (optional) e.g. "Asia/Kuala_Lumpur" to format in MYT
   * @returns {string} e.g. "Posted on 26th July 2025" or "" if invalid
   */
  function postedOn(input, { now, timeZone } = {}) {
    if (!input || typeof input !== "string") return "";
    const nowDate = now instanceof Date ? new Date(now) : new Date();
    const raw = input.trim();

    // Normalize for matching (but keep original for parsing numbers)
    const txt = raw.toLowerCase();

    let target = new Date(nowDate);

    // 1) X days ago
    let m = txt.match(/^(\d+)\s*days?\s*ago(?:\s+at\s+.+)?$/i);
    if (m) {
      target.setDate(target.getDate() - parseInt(m[1], 10));
      return `Posted on ${formatPostedDate(target, { timeZone })}`;
    }

    // 2) yesterday
    if (/^yesterday(?:\s+at\s+.+)?$/i.test(txt)) {
      target.setDate(target.getDate() - 1);
      return `Posted on ${formatPostedDate(target, { timeZone })}`;
    }

    // 3) today
    if (/^today(?:\s+at\s+.+)?$/i.test(txt)) {
      return `Posted on ${formatPostedDate(target, { timeZone })}`;
    }

    // 4) X hours ago
    m = txt.match(/^(\d+)\s*hours?\s*ago(?:\s+at\s+.+)?$/i);
    if (m) {
      target.setHours(target.getHours() - parseInt(m[1], 10));
      return `Posted on ${formatPostedDate(target, { timeZone })}`;
    }

    // 5) X minutes ago
    m = txt.match(/^(\d+)\s*minutes?\s*ago(?:\s+at\s+.+)?$/i);
    if (m) {
      target.setMinutes(target.getMinutes() - parseInt(m[1], 10));
      return `Posted on ${formatPostedDate(target, { timeZone })}`;
    }

    // 6) Absolute: "Saturday 26th July 2025" OR "26th July 2025" (day name optional & ignored)
    //    Capture groups: day, month word, year
    m = raw.match(
      /^(?:[A-Za-z]+,\s*|[A-Za-z]+\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})$/
    );
    if (m) {
      const dayNum = parseInt(m[1], 10);
      const monthName = m[2].toLowerCase();
      const yearNum = parseInt(m[3], 10);

      const monthIndex = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
      }[monthName];

      if (monthIndex !== undefined) {
        // Construct at local midnight; formatting can be forced to a timeZone via Intl
        const abs = new Date(yearNum, monthIndex, dayNum, 0, 0, 0, 0);
        if (!isNaN(abs.getTime())) {
          return `Posted on ${formatPostedDate(abs, { timeZone })}`;
        }
      }
    }

    // 7) Fallback: let Date parse other absolute formats (ISO, etc.)
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      return `Posted on ${formatPostedDate(parsed, { timeZone })}`;
    }

    // If nothing matched, return empty or original text
    return "";
  }

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
      <div
        style={{
          // default padding
          padding: "30px 60px 5px 60px",
          // override when template3
          ...(template === "template3" && {
            backgroundImage: `url(${bg})`,

            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "50px",
            width: "20%",
            marginTop: "3%",
            marginBottom: "3%",
            display: "flex", // ✅ enable flex
            alignItems: "center", // ✅ vertical center
            justifyContent: "center",
            paddingTop: 10,
          }),
        }}
      >
        <p
          style={{
            color: "#212529",
            fontSize: "16px",
            fontFamily: "Poppins",
            fontWeight: 600,
            // marginBottom: 40,
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
                  ? "#FF7A00"
                  : isForRental
                  ? "#007B83"
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
                        className="mb-1"
                        style={{
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: 400,
                          padding: "12px",
                        }}
                      >
                        {postedOn(card.deal_dt, {
                          timeZone: "Asia/Kuala_Lumpur",
                        })}
                      </div>
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
                          style={{
                            paddingLeft: "20px",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 600,
                          }}
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
                                fontSize: "14px",
                              padding: "8px 16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <text
                              style={{
                                fontSize: "14px",
                                fontFamily: "Poppins",
                                fontWeight: 600,
                              }}
                            >
                              {statusText}
                            </text>
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
                        <h5
                          style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            fontFamily: "Poppins",
                          }}
                        >
                          RM {card.price}
                        </h5>
                        <p className="text-muted mb-1">
                          <text
                            style={{
                              fontSize: "18px",
                              fontWeight: 400,
                              fontFamily: "Poppins",
                            }}
                          >
                            {card.ads_title}
                          </text>
                          <br />
                          <text
                            style={{
                              fontSize: "14px",
                              fontWeight: 400,
                              fontFamily: "Poppins",
                            }}
                          >
                            {card.location_area}
                          </text>
                        </p>
                        <p className="text-muted mb-2">
                          <text
                            style={{
                              fontSize: "14px",
                              fontWeight: 400,
                              fontFamily: "Poppins",
                            }}
                          >
                            {card.category_type_title_holding_lottype_storey}
                          </text>
                          <br />
                          {card.built_size && (
                            <div>
                              <text
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 400,
                                  fontFamily: "Poppins",
                                }}
                              >
                                Built-up Size: {card.built_size}
                                {card.built_size_unit}
                                {!card.land_size &&
                                  card.built_price_per_unit && (
                                    <>
                                      ({card.monetary_currency}
                                      {card.built_price_per_unit} per sqft)
                                    </>
                                  )}
                              </text>
                            </div>
                          )}
                          {!card.built_size && card.land_size && (
                            <div>
                              <text
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 400,
                                  fontFamily: "Poppins",
                                }}
                              >
                                Land Size: {card.land_size}{" "}
                                {card.land_size_unit}
                              </text>
                              {["acre", "hectar"].includes(
                                card.land_size_unit?.toLowerCase()
                              ) &&
                                card.land_price_per_unit && (
                                  <>
                                    ({card.monetary_currency}{" "}
                                    {card.land_price_per_unit} per{" "}
                                    {card.land_size_unit})
                                  </>
                                )}
                              {["sqft", "sqm"].includes(
                                card.land_size_unit?.toLowerCase()
                              ) &&
                                card.land_price_per_sqft && (
                                  <>
                                    ({card.monetary_currency}{" "}
                                    {card.land_price_per_sqft} per sqft)
                                  </>
                                )}
                            </div>
                          )}
                          {card.built_size && card.land_size && (
                            <>
                              <div>
                                <text
                                  style={{
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    fontFamily: "Poppins",
                                  }}
                                >
                                  Land Size: {card.land_size}
                                  {card.land_size_unit}
                                  {["acre", "hectar"].includes(
                                    card.land_size_unit?.toLowerCase()
                                  ) &&
                                    card.land_price_per_unit && (
                                      <>
                                        ({card.monetary_currency}
                                        {card.land_price_per_unit} per
                                        {card.land_size_unit})
                                      </>
                                    )}
                                  {["sqft", "sqm"].includes(
                                    card.land_size_unit?.toLowerCase()
                                  ) &&
                                    card.land_price_per_sqft && (
                                      <>
                                        ({card.monetary_currency}
                                        {card.land_price_per_sqft} per sqft)
                                      </>
                                    )}
                                </text>
                              </div>
                            </>
                          )}
                        </p>
                        <div className="mt-auto">
                          {card.bathroom && card.room > 0 && (
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
                          )}

                          <div className="d-flex flex-column flex-md-row gap-2">
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
