import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaBed, FaBath } from "react-icons/fa";
import AgentBox from "../components/AgentBox";
import { getAgent, getFeaturedList, getListingInfo } from "../api/axiosApi";
import sharImage from "../image/ios_share.svg";
import saveImage from "../image/kid_star.svg";
import SimilarListing from "../components/SimilarListingCardT2";
import "./ProductDetail.css";
import { FiCamera } from "react-icons/fi";
import MortgageCalculator3 from "./MortgageCalculator3";
import { useTemplate } from "../context/TemplateContext"; // ✅ Import Template Context
import bgImage from "../image/bg3.png";
import bedIcon from "../image/bed.png";
import bathIcon from "../image/bathtub.png";
import area from "../image/area.png";
import landarea from "../image/sqrtarea.png";
import propcat from "../image/home_work.png";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const productId = location.state?.productId;
  const [previewImage, setPreviewImage] = useState(null);
  const [similarListing, setSimilarListing] = useState([]);
  // const [agent, setAgent] = useState({});
  const { agent, template, agentInfo } = useTemplate();

  const whatsappMessage = `Hello My Lovely Agent,\nI'm interested in the property that you advertise at website\n${window.location.href}\nand I would love to visit this property.\nMy name is:`;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailRefs = useRef([]);
  useEffect(() => {
    console.log("agent", agentInfo);
    const fetchProductDetails = async () => {
      try {
        const hostname = window.location.hostname;
        const domain = hostname.replace(/^www\./, "").split(".")[0];
        const url_fe = window.location.href;

        const response = await getListingInfo({
          id_listing: productId,
          domain,
          url_fe,
        });

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
  const hasValue = (v) => v !== null && v !== undefined && v !== "";

  return (
    <div>
      <div style={{ paddingTop: "20px", backgroundColor: "#FAFAFA" }}>
        <div
          className="container"
          style={{ maxWidth: "1200px", padding: "0 50px" }}
        >
          {/* Agent Box */}

          {/* Title */}
          <div
            className="position-relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${product.photos[0]})`,
              maxWidth: "1300px",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              marginBottom: 100,
              height: "500px",
              padding: "20px 50px",
              color: "white",
              overflow: "visible", // 👈 allow children to overflow outside
            }}
          >
            {/* Column layout */}
            <div className="d-flex flex-column gap-2">
              {/* Title */}
              <h5
                className="fw-bold"
                style={{
                  fontFamily: "Poppins",
                  fontSize: 22,
                  fontWeight: 600,
                  textShadow: "0px 2px 6px rgba(0,0,0,0.6)",
                }}
              >
                {product.ads_title}
              </h5>

              {/* Category */}
              <div
                style={{
                  display: "flex",
                  padding: "8px 16px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--Off-White, #FAFAFA)",
                  width: "fit-content", // 👈 so it wraps content neatly
                  background: "rgba(0,0,0,0.4)", // optional for contrast
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    textShadow: "0px 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  {product.property_category_description}
                </span>
              </div>
            </div>

            {/* Property Info Row */}
            <div className="d-flex flex-wrap gap-4 mt-3">
              <span
                className="d-flex align-items-center"
                style={{ minWidth: "150px" }}
              >
                <img
                  src={bedIcon}
                  alt="Bed"
                  style={{ width: "24px", height: "24px", marginRight: "8px" }}
                />
                <span className="d-flex flex-column">
                  <span style={{ fontSize: 10, fontWeight: 600 }}>
                    {product.room}
                  </span>
                  <span style={{ fontSize: 10, color: "#ccc" }}>
                    Bedroom(s)
                  </span>
                </span>
              </span>

              {/* Bathrooms */}
              <span
                className="d-flex align-items-center"
                style={{ minWidth: "150px" }}
              >
                <img
                  src={bathIcon}
                  alt="Bath"
                  style={{ width: "24px", height: "24px", marginRight: "8px" }}
                />
                <span className="d-flex flex-column">
                  <span style={{ fontSize: 10, fontWeight: 600 }}>
                    {product.bathroom}
                  </span>
                  <span style={{ fontSize: 10, color: "#ccc" }}>
                    Bathroom(s)
                  </span>
                </span>
              </span>
              <span
                className="d-flex align-items-center"
                style={{ minWidth: "150px" }}
              >
                <img
                  src={landarea}
                  alt="Build-up Size"
                  style={{
                    width: "24px",
                    height: "24px",
                    marginRight: "8px",
                    backgroundColor: "#fff",
                  }}
                />
                <span className="d-flex flex-column">
                  <span style={{ fontSize: 10, fontWeight: 600 }}>
                    {product.built_price_per_sqft} ft
                  </span>
                  <span style={{ fontSize: 10, color: "#ccc" }}>
                    Build-up Size
                  </span>
                </span>
              </span>
            </div>

            {/* Photos overlayed */}
            <div
              className="d-grid gap-2 position-absolute start-50 translate-middle-x"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
                width: "60%", // adjust width
                bottom: "-70px", // 👈 push outside background
              }}
            >
              {product.photos.slice(1, 4).map((photo, i) => {
                const actualIndex = i + 1;
                return (
                  <div
                    key={photo}
                    className="rounded overflow-hidden"
                    style={{
                      width: "100%", // 👈 fills column
                      aspectRatio: "1/1", // 👈 keeps square shape
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
          <div className="mt-4" style={{ backgroundColor: "#FDFFFE" }}>
            <div className="row p-4">
              <span
                style={{
                  fontSize: "16px",
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  marginBottom: 30,
                }}
              >
                Overview
              </span>
              <div>
                {/* Title */}
                <h5
                  className="fw-bold"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 22,
                    fontWeight: 600,
                    marginBottom: "12px", // spacing below title
                  }}
                >
                  {product.ads_title}
                </h5>

                {/* Property Details Row */}
                <div className="d-flex flex-wrap gap-4">
                  {/* Build-up Size */}
                  <span
                    className="d-flex align-items-center"
                    style={{ minWidth: "150px" }}
                  >
                    <img
                      src={landarea}
                      alt="Build-up Size"
                      style={{
                        width: "24px",
                        height: "24px",
                        marginRight: "8px",
                      }}
                    />
                    <span className="d-flex flex-column">
                      <span style={{ fontSize: 10, fontWeight: 600 }}>
                        {product.built_price_per_sqft} ft
                      </span>
                    </span>
                  </span>

                  {/* Bedrooms */}
                  <span
                    className="d-flex align-items-center"
                    style={{ minWidth: "150px" }}
                  >
                    <img
                      src={bedIcon}
                      alt="Bed"
                      style={{
                        width: "24px",
                        height: "24px",
                        marginRight: "8px",
                      }}
                    />
                    <span className="d-flex flex-column">
                      <span style={{ fontSize: 10, fontWeight: 600 }}>
                        {product.room}
                      </span>
                    </span>
                  </span>

                  {/* Bathrooms */}
                  <span
                    className="d-flex align-items-center"
                    style={{ minWidth: "150px" }}
                  >
                    <img
                      src={bathIcon}
                      alt="Bath"
                      style={{
                        width: "24px",
                        height: "24px",
                        marginRight: "8px",
                      }}
                    />
                    <span className="d-flex flex-column">
                      <span style={{ fontSize: 10, fontWeight: 600 }}>
                        {product.bathroom}
                      </span>
                    </span>
                  </span>
                </div>
              </div>

              <div className="row mt-5">
                {/* Left side - Property Details */}
                <div className="col-lg-8">
                  <div className="mb-3">
                    <span
                      style={{
                        fontSize: "16px",
                        fontFamily: "Poppins",
                        fontWeight: 600,
                      }}
                    >
                      Property Details
                    </span>

                    <div
                      className="row"
                      style={{
                        backgroundColor: "#F6F6F6",
                        width: "80%",
                        marginTop: 40,
                      }}
                    >
                      <div className="col-6 p-3">
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Property Category:
                        </span>
                        <br />
                        <span
                          style={{
                            color: "#737373",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            borderBottom: "1px",
                          }}
                        >
                          {product.property_type_description}
                        </span>
                      </div>

                      <div className="col-6 pt-3">
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Property Type:
                        </span>
                        <br />
                        <span
                          style={{
                            color: "#737373",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          {product.property_lot_type_description}
                        </span>
                      </div>

                      <div className="col-6 p-3">
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Title:
                        </span>
                        <br />
                        <span
                          style={{
                            color: "#737373",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          {product.property_title}
                        </span>
                      </div>

                      <div className="col-6 pt-3">
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Holding:
                        </span>
                        <br />
                        <span
                          style={{
                            color: "#737373",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          {product.property_title}
                        </span>
                      </div>

                      <div className="col-6 p-3">
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Lot Type:
                        </span>
                        <br />
                        <span
                          style={{
                            color: "#737373",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          {product.property_holding}
                        </span>
                      </div>

                      <div className="col-6 pt-3">
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Position:
                        </span>
                        <br />
                        {hasValue(product?.built_size) ? (
                          <span
                            style={{
                              color: "#737373",
                              fontSize: "14px",
                              fontFamily: "Poppins",
                              fontWeight: 400,
                            }}
                          >
                            {product.built_size}{" "}
                            {product.built_size_unit || "sqft"}
                          </span>
                        ) : hasValue(product?.land_price_per_sqft) ? (
                          <span
                            style={{
                              color: "#737373",
                              fontSize: "14px",
                              fontFamily: "Poppins",
                              fontWeight: 400,
                            }}
                          >
                            {product.land_price_per_sqft}{" "}
                            {product.land_size_unit || "sqft"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Agent Card */}
                <div className="col-lg-4">
                  <div
                    className="card text-center p-3"
                    style={{
                      border: "1px solid #DBDBDB",
                      borderRadius: "12px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    {/* Price Section */}
                    <div className="mb-3">
                      <p
                        style={{
                          fontSize: "12px",
                          fontFamily: "Poppins",
                          color: "#6c757d",
                          marginBottom: "5px",
                        }}
                      >
                        Price
                      </p>
                      <h3
                        style={{
                          fontSize: "22px",
                          fontWeight: 700,
                          fontFamily: "Poppins",
                          marginBottom: 0,
                        }}
                      >
                        RM {product.price}{" "}
                      </h3>
                    </div>

                    {/* Divider */}
                    <hr />

                    {/* Info text */}
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        fontFamily: "Poppins",
                        marginBottom: "20px",
                      }}
                    >
                      Want to know more about this property?
                    </p>

                    {/* Agent Photo */}
                    <div className="d-flex justify-content-center">
                      <img
                        src={agentInfo.photo}
                        alt="Agent"
                        className="rounded-circle mb-2"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* Agent Name + Reg */}
                    <h6
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        fontFamily: "Poppins",
                        marginBottom: "5px",
                      }}
                    >
                      {agentInfo.name || "John Doe"}
                    </h6>
                    <p
                      style={{
                        fontSize: "10px",
                        fontFamily: "Poppins",
                        color: "#6c757d",
                        marginBottom: "20px",
                      }}
                    >
                      {agentInfo.reg_no || "(E (1) 1584/11)"}
                    </p>

                    {/* WhatsApp Button */}
                    <a
                      href={`https://wa.me/${
                        agentInfo.whatsapp
                      }?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-100 mb-2"
                      style={{
                        backgroundColor: "#F4980E",
                        borderRadius: "8px",
                        padding: "10px",
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#fff",
                      }}
                    >
                      <i className="bi bi-whatsapp me-2"></i> Whatsapp
                    </a>

                    {/* Contact Agent Button */}
                    <button
                      className="btn w-100"
                      style={{
                        border: "1px solid #DBDBDB",
                        borderRadius: "8px",
                        padding: "10px",
                        backgroundColor: "#fff",
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#6c757d",
                      }}
                    >
                      <i className="bi bi-telephone me-2"></i> Contact Agent
                    </button>
                  </div>
                </div>
              </div>

              {product.ads_description && (
                <div className="p-3">
                  <text
                    style={{
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      paddingBottom: "20px",
                    }}
                  >
                    Description
                  </text>

                  <p
                    style={{
                      whiteSpace: "pre-line",
                      fontFamily: "Poppins",
                      fontSize: "12px",
                      paddingTop: "30px",
                    }}
                  >
                    {formatAdsDescription(product.ads_description)}
                  </p>
                </div>
              )}

              {/* <div className="col-lg-8">
                <MortgageCalculator3 product={product}></MortgageCalculator3>
              </div> */}
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

          <SimilarListing listings={similarListing?.featured_rows ?? []} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
