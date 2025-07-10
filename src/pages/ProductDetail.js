import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaBed, FaBath } from "react-icons/fa";
import AgentBox from "../components/AgentBox";
import { getAgent, getFeaturedList } from "../api/axiosApi";
import sharImage from "../image/ios_share.svg";
import saveImage from "../image/kid_star.svg";
import SimilarListing from "../components/SimilarListingCard";
import "./ProductDetail.css";
import { FiCamera } from "react-icons/fi";
import MortgageCalculator from "./MortgageCalculator";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const productId = location.state?.productId;
  const [previewImage, setPreviewImage] = useState(null);
  const [similarListing, setSimilarListing] = useState([]);
  const [agent, setAgent] = useState({});

  const whatsappMessage = `Hello My Lovely Agent,\nI'm interested in the property that you advertise at website\n${window.location.href}\nand I would love to visit this property.\nMy name is:`;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailRefs = useRef([]);
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const hostname = window.location.hostname; // e.g., "prohartanah.my"
    const domain = hostname.replace(/^www\./, "").split(".")[0]; // e.g., "prohartanah"
        const response = await axios.post(
          "https://dev-agentv3.propmall.net/graph/me/listing/info",
          {
            domain: domain,
            url_fe: window.location.href,
            id_listing: productId,
          },
          { headers: { "Content-Type": "application/json" } }
        );
        setProduct(response.data.listing_info);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProductDetails();
  }, [productId]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    if (modalOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);
  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const agentRes = await getAgent();
        setAgent(agentRes.data.agent);
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };
    fetchAgentData();
  }, []);

  useEffect(() => {
    const fetchFeaturedList = async () => {
      try {
        const feaListRes = await getFeaturedList();
        setSimilarListing(feaListRes.data.featured_search);
      } catch (error) {
        console.error("Error fetching similar listings:", error);
      }
    };
    fetchFeaturedList();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error)
    return <div className="text-center mt-5 text-danger fw-bold">{error}</div>;

  if (!product)
    return (
      <div className="text-center mt-5 text-muted">Product not found.</div>
    );
  function formatAdsDescription(description) {
    if (!description) return "";
    return description
      .replace(/\r\n|\n|\r/g, "\n")
      .replace(/\u2022/g, "•")
      .replace(/\u21a9\ufe0f/g, "↩️")
      .replace(/\u2019/g, "’")
      .replace(/\u00a9/g, "©")
      .replace(/\ud83d\udccc/g, "📌")
      .replace(/\u00ae/g, "®")
      .replace(/\u00a0/g, " ")
      .replace(/\\\//g, "/")
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
      );
  }
  const showPrev = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? modalImages.length - 1 : prev - 1
    );

  const showNext = () =>
    setCurrentImageIndex((prev) =>
      prev === modalImages.length - 1 ? 0 : prev + 1
    );

  const closeModal = () => {
    setModalOpen(false);
    document.body.classList.remove("no-scroll");
  };

  const getThumbnailSlice = () => {
    const total = modalImages.length;
    const start = Math.max(0, Math.min(currentImageIndex - 5, total - 10));
    return modalImages.slice(start, start + 10);
  };
  return (
    <div>
      <div>
        <AgentBox />
      </div>
      <div style={{ paddingTop: "20px", backgroundColor: "#fff" }}>
        <div
          className="container"
          style={{ maxWidth: "1300px", padding: "0 50px" }}
        >
          {/* Agent Box */}

          {/* Title */}
          <div className="pb-4">
            <p
              className="fw-bold"
              style={{ fontSize: "20px", fontFamily: "Poppins" }}
            >
              {product.ads_title}
            </p>
          </div>

          {/* Photos */}
          {product?.photos?.length > 0 && (
            <div
              className="d-flex flex-lg-row flex-column gap-3 align-items-start"
              style={{ flexWrap: "wrap" }}
            >
              {/* Main Image */}
              <img
                src={product.photos[0]}
                alt="Main Property"
                onClick={() => {
                  setModalImages(product.photos);
                  setCurrentImageIndex(0);
                  setModalOpen(true);
                }}
                className="img-fluid rounded"
                style={{
                  width: "100%",
                  maxWidth: 646,
                  height: "480px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />

              {/* Thumbnail Grid */}
              <div
                className="d-grid gap-3"
                style={{
                  gridTemplateColumns: "repeat(2, 1fr)",
                  maxWidth: "530px",
                  width: "100%",
                  height: "480px",
                }}
              >
                {product.photos.slice(1, 5).map((photo, i) => {
                  const actualIndex = i + 1;
                  if (i === 3 && product.photos.length > 5) {
                    return (
                      <div
                        key="show-all"
                        className="position-relative rounded overflow-hidden"
                        style={{
                          height: "calc(480px / 2 - 12px)",
                          backgroundImage: `url(${photo})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setModalImages(product.photos);
                          setCurrentImageIndex(actualIndex);
                          setModalOpen(true);
                        }}
                      >
                        {/* Show All button at bottom-right */}
                        <div
                          className="position-absolute"
                          style={{
                            bottom: "8px",
                            right: "8px",
                          }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              padding: "12px",
                              gap: "6px",
                              borderRadius: "8px",
                              border: "1px solid #999",
                              background: "#FAFAFA",
                              width: "122px", // ✅ Updated width
                              height: "48px",
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                              color: "var(--Grey-4, #737373)",
                              cursor: "pointer",
                            }}
                          >
                            <FiCamera size={16} color="#737373" />

                            <span>Show All</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Regular image tiles...
                  return (
                    <div
                      key={photo}
                      className="rounded overflow-hidden"
                      style={{
                        height: "calc(480px / 2 - 12px)",
                        backgroundImage: `url(${photo})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setModalImages(product.photos);
                        setCurrentImageIndex(actualIndex);
                        setModalOpen(true);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* MODAL PREVIEW */}
          {modalOpen && (
            <div className="modal-overlay" onClick={closeModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="close-button" onClick={closeModal}>
                  &times;
                </button>

                <div className="modal-body">
                  <img
                    src={modalImages[currentImageIndex]}
                    alt="Full View"
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
                    {getThumbnailSlice().map((img, idx) => {
                      const actualIndex =
                        Math.max(
                          0,
                          Math.min(
                            currentImageIndex - 5,
                            modalImages.length - 10
                          )
                        ) + idx;
                      return (
                        <img
                          key={actualIndex}
                          src={img}
                          alt={`Thumbnail ${actualIndex}`}
                          className={`thumbnail ${
                            currentImageIndex === actualIndex ? "active" : ""
                          }`}
                          onClick={() => setCurrentImageIndex(actualIndex)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing + Agent Info */}
          <div className="card shadow-sm mt-4">
            <div className="row g-4 p-4">
              <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex gap-3">
                    <h5
                      className="fw-bold text-dark"
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 20,
                        fontWeight: 600,
                      }}
                    >
                      RM {product.price}
                    </h5>
                    <h6
                      className="text-muted"
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 16,
                        fontWeight: 600,
                        marginTop: 2,
                      }}
                    >
                      (RM {product.built_price_per_sqft} per sq ft)
                    </h6>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm d-flex align-items-center"
                      style={{ background: "none", color: "#333" }}
                    >
                      <img
                        src={sharImage}
                        alt="Share"
                        style={{ width: 16, height: 16 }}
                      />
                      Share
                    </button>
                    <button
                      className="btn btn-sm d-flex align-items-center"
                      style={{ background: "none", color: "#f4b400" }}
                    >
                      <img
                        src={saveImage}
                        alt="Save"
                        style={{ width: 16, height: 16 }}
                      />
                      Save
                    </button>
                  </div>
                </div>

                <p
                  className="mb-1"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 20,
                    fontWeight: 400,
                  }}
                >
                  {product.property_title}
                </p>
                <small
                  className="text-muted d-block mb-3"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 400,
                  }}
                >
                  {product.location_area}
                </small>
                <small
                  className="text-muted d-flex align-items-center gap-2 mb-3"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 400,
                  }}
                >
                  {product.category_type_title_holding_lottype_storey}
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#666",
                      display: "inline-block",
                    }}
                  ></span>
                  Built-up: {product.built_size} {product.built_size_unit}
                </small>

                <div className="d-flex gap-3 mb-2">
                  <span className="d-flex align-items-center gap-1">
                    <FaBed /> {product.room} beds
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <FaBath /> {product.bathroom} baths
                  </span>
                </div>
              </div>

              {/* Agent Sidebar */}
              <div className="col-lg-4">
                <div
                  className="card p-3"
                  style={{ border: "1px solid #DBDBDB", borderRadius: "8px" }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={agent.photo}
                      alt="Agent"
                      className="rounded-circle me-3"
                      style={{ width: 60, height: 60 }}
                    />
                    <div>
                      <strong>{product.agent_name || "Stephanie"}</strong>
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Verified Agent
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/60132936420?text=${encodeURIComponent(
                      whatsappMessage
                    )}`}
                    className="btn btn-warning text-white w-100"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: "#F4980E" }}
                  >
                    <i className="bi bi-whatsapp me-2"></i> WhatsApp Agent
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Modal */}
          {previewImage && (
            <div
              className="modal show d-block"
              tabIndex={-1}
              onClick={() => setPreviewImage(null)}
              style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content bg-transparent border-0">
                  <div className="modal-body p-0">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="img-fluid rounded"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                    onClick={() => setPreviewImage(null)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Property Details */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card p-3 shadow-sm mb-3">
                <h5 className="fw-bold mb-3">Property Details</h5>
                <div className="row">
                  <div className="col-6">
                    <strong>Type:</strong>
                    <br />
                    {product.property_type_description}
                  </div>
                  <div className="col-6">
                    <strong>Land Title:</strong>
                    <br />
                    {product.land_title}
                  </div>
                  <div className="col-6">
                    <strong>Title Type:</strong>
                    <br />
                    {product.property_title}
                  </div>
                  <div className="col-6">
                    <strong>Lot:</strong>
                    <br />
                    {product.property_lot_type_description}
                  </div>
                  <div className="col-6">
                    <strong>Tenure:</strong>
                    <br />
                    {product.tenure}
                  </div>
                  <div className="col-6">
                    <strong>Size:</strong>
                    <br />
                    {product.built_size} sqft
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Property Description */}
          {product.ads_description && (
            <div className="card p-3 shadow-sm">
              <h5 className="fw-bold mb-3">Property Description</h5>
              <p
                style={{
                  whiteSpace: "pre-line",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                }}
              >
                {formatAdsDescription(product.ads_description)}
              </p>
            </div>
          )}
          <div>
            <MortgageCalculator product={product}></MortgageCalculator>
          </div>

          {/* Similar Listings */}
          <SimilarListing listings={similarListing?.featured_rows ?? []} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
