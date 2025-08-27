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
            className="pb-4"
            style={{
              backgroundImage: `url(${bgImage})`,
              maxWidth: "1200px",
              paddingLeft: 50,
              paddingTop: 50,
              marginBottom: 50,
            }}
          >
            <nav aria-label="breadcrumb">
              <ol
                className="breadcrumb"
                style={{ "--bs-breadcrumb-divider": "'›'" }}
              >
                <li className="breadcrumb-item">
                  <a
                    href="/"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: "14px",
                      fontFamily: "Poppins",
                    }}
                  >
                    Home
                  </a>
                  <text
                    style={{ marginRight: 10, marginLeft: 10 }}
                  >{` > `}</text>
                </li>
                <li>
                  <a
                    href="/properties"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: "14px",
                      fontFamily: "Poppins",
                    }}
                  >
                    Properties
                  </a>
                  <text
                    style={{ marginRight: 10, marginLeft: 10 }}
                  >{` > `}</text>
                </li>
                <li>
                  <a
                    href="/properties/kuala-lumpur"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: "14px",
                      fontFamily: "Poppins",
                    }}
                  >
                    Kuala Lumpur
                  </a>
                  <text
                    style={{ marginRight: 10, marginLeft: 10 }}
                  >{` > `}</text>
                </li>
                <li
                  className="breadcrumb-item active"
                  aria-current="page"
                  style={{
                    color: "inherit",
                    fontWeight: 600,
                    fontSize: "14px",
                    fontFamily: "Poppins",
                  }} // optional bold for active item
                >
                  {product.ads_title}
                </li>
              </ol>
            </nav>
          </div>
          <div className="col-lg-8 mb-4">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex gap-3">
                <h5
                  className="fw-bold text-dark"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  {product.ads_title}
                </h5>
              </div>
            </div>

            {/* Location + Price in same row */}
          </div>

          {/* Photos */}
          {product?.photos?.length > 0 && (
            <div
              className="d-flex flex-lg-row flex-column gap-3 align-items-start"
              style={{ flexWrap: "wrap" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ width: "100%", maxWidth: "1760px" }} // responsive with a cap
                // set your desired width
              >
                <p
                  className="mb-1"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 400,
                    color: "#737373",
                  }}
                >
                  {product.location_area}
                </p>

                <h5
                  className="fw-bold text-dark mb-0 ms-auto"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  RM {product.price}
                </h5>
              </div>
              {/* Main Image */}
              <div style={{ position: "relative", flex: "1 1 auto" }}>
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
                    height: "450px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />

                {/* Mobile Show All Button */}
                <div
                  className="d-lg-none position-absolute"
                  style={{ bottom: "8px", right: "8px" }}
                >
                  <div
                    className="d-flex align-items-center"
                    style={{
                      padding: "12px",
                      gap: "6px",
                      borderRadius: "8px",
                      border: "1px solid #999",
                      background: "#FAFAFA",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "var(--Grey-4, #737373)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setModalImages(product.photos);
                      setCurrentImageIndex(0);
                      setModalOpen(true);
                    }}
                  >
                    <FiCamera size={16} color="#737373" />
                    <span>Show All</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Grid (hidden on mobile) */}
              <div
                className="d-none d-lg-grid gap-2"
                style={{
                  gridTemplateRows: "repeat(2, 1fr)", // stack vertically
                  maxWidth: "480px",
                  width: "100%",
                  height: "450px", // total height
                }}
              >
                {product.photos.slice(1, 3).map((photo, i) => {
                  const actualIndex = i + 1;

                  // Show All (if more photos)
                  if (i === 1 && product.photos.length > 5) {
                    return (
                      <div
                        key="show-all"
                        className="position-relative rounded overflow-hidden"
                        style={{
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
                        {/* Show All button for desktop */}
                        <div
                          className="position-absolute"
                          style={{ bottom: "8px", right: "8px" }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              padding: "12px",
                              gap: "6px",
                              borderRadius: "8px",
                              border: "1px solid #999",
                              background: "#FAFAFA",
                              width: "122px",
                              height: "48px",
                              fontFamily: "Poppins",
                              fontSize: "14px",
                              fontWeight: 400,
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

                  // Regular thumbnails
                  return (
                    <div
                      key={photo}
                      className="rounded overflow-hidden"
                      style={{
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
              <div className="d-flex flex-wrap gap-4">
                {/* Property Category */}
                <span
                  className="d-flex align-items-center"
                  style={{ minWidth: "150px" }}
                >
                  <img
                    src={propcat}
                    alt="Category"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "8px",
                    }}
                  />
                  <span className="d-flex flex-column">
                    <span style={{ fontSize: 10, fontWeight: 600 }}>
                      {product.property_category_description}
                    </span>
                    <span style={{ fontSize: 10, color: "#737373" }}>
                      Property Category
                    </span>
                  </span>
                </span>

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
                      {product.built_price_per_sqft}
                    </span>
                    <span style={{ fontSize: 10, color: "#737373" }}>
                      Build-up Size
                    </span>
                  </span>
                </span>

                {/* Land Area */}
                <span
                  className="d-flex align-items-center"
                  style={{ minWidth: "150px" }}
                >
                  <img
                    src={area}
                    alt="Land Area"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "8px",
                    }}
                  />
                  <span className="d-flex flex-column">
                    <span style={{ fontSize: 10, fontWeight: 600 }}>
                      {product.land_price_per_sqft}
                    </span>
                    <span style={{ fontSize: 10, color: "#737373" }}>
                      Land Area
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
                    <span style={{ fontSize: 10, color: "#737373" }}>
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
                    <span style={{ fontSize: 10, color: "#737373" }}>
                      Bathroom(s)
                    </span>
                  </span>
                </span>
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

                    <div className="row">
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
                    className="card p-3"
                    style={{
                      border: "1px solid #DBDBDB",
                      borderRadius: "16px",
                      boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={agentInfo.photo}
                        alt="Agent"
                        className="rounded-circle me-3"
                        style={{ width: 60, height: 60 }}
                      />
                      <div>
                        <span
                          style={{
                            fontSize: 14,
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            color: "#3A3A3A",
                          }}
                        >
                          {agentInfo.name || ""}
                        </span>
                        <p
                          className="text-muted mb-0"
                          style={{
                            fontSize: "7px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            color: "#3A3A3A",
                          }}
                        >
                          {agentInfo.reg_no || ""}
                        </p>
                      </div>
                    </div>

                    {/* WhatsApp button */}
                    <a
                      href={`https://wa.me/${
                        agentInfo.whatsapp
                      }?text=${encodeURIComponent(whatsappMessage)}`}
                      className="btn btn-warning text-white w-100"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: "#F4980E", borderRadius: 8 }}
                    >
                      <i className="bi bi-whatsapp me-2"></i>{" "}
                      <span
                        style={{
                          fontSize: 14,
                          fontFamily: "Poppins",
                          fontWeight: 400,
                          color: "#FAFAFA",
                        }}
                      >
                        WhatsApp Agent
                      </span>
                    </a>

                    {/* Call button */}
                    <a
                      href={`tel:${agentInfo.phone}`}
                      className="btn w-100 mt-3"
                      style={{
                        backgroundColor: "#FAFAFA",
                        borderRadius: 8,
                        border: "1px solid #DBDBDB",
                      }}
                    >
                      <i
                        className="bi bi-telephone-fill me-2"
                        style={{ color: "#737373" }}
                      ></i>{" "}
                      <span
                        style={{
                          fontSize: 14,
                          fontFamily: "Poppins",
                          fontWeight: 400,
                          color: "#737373",
                        }}
                      >
                        Call Agent
                      </span>
                    </a>
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

              <div className="col-lg-8">
                <MortgageCalculator3 product={product}></MortgageCalculator3>
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

          {/* Property Description */}

          {/* Similar Listings */}
          <SimilarListing listings={similarListing?.featured_rows ?? []} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
