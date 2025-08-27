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
import MortgageCalculator from "./MortgageCalculator2";
import { useTemplate } from "../context/TemplateContext"; // ✅ Import Template Context
import bgImage from "../image/template2bg.png";
import bedIcon from "../image/bed.png";
import bathIcon from "../image/bathtub.png";
import area from "../image/area.png";
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
              maxWidth: "1300px",
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

          {/* Photos */}
          {product?.photos?.length > 0 && (
            <div
              className="d-flex flex-lg-row flex-column gap-3 align-items-start"
              style={{ flexWrap: "wrap" }}
            >
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
                  gridTemplateColumns: "repeat(2, 1fr)",
                  maxWidth: "480px",
                  width: "100%",
                  height: "450px",
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
                          height: "calc(480px / 2 - 22px)",
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
                        height: "calc(460px / 2 - 12px)",
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
            <div className="row g-4 p-4">
              <div className="col-lg-8">
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

                <p
                  className="mb-1"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 10,
                    fontWeight: 400,
                    color: "#737373",
                  }}
                >
                  {product.location_area}
                </p>
                <div className="row">
                  {/* Divider line */}
                  <div
                    style={{
                      width: "100%",
                      height: "1px",
                      backgroundColor: "#DBDBDB",
                      margin: "2% auto",
                    }}
                  />

                  {/* Price + Beds/Baths closer together */}
                  <div className="d-flex align-items-center gap-4">
                    <div style={{ paddingRight: "200px" }}>
                      <h5
                        className="fw-bold text-dark"
                        style={{
                          fontFamily: "Poppins",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        RM {product.price}
                      </h5>
                      <h6
                        className="text-muted"
                        style={{
                          fontFamily: "Poppins",
                          fontSize: 8,
                          fontWeight: 400,
                          marginTop: 2,
                          color: "#737373",
                        }}
                      >
                        (RM {product.land_price_per_sqft} per sq ft)
                      </h6>
                    </div>
                    <div
                      style={{
                        width: "1px",
                        height: "59px",
                        backgroundColor: "#DBDBDB",
                        marginRight: "10px",
                      }}
                    />
                    {product.room && product.bathroom > 0 && (
                      <div className="d-flex justify-content-evenly">
                        <span
                          className="d-flex flex-column align-items-center"
                          style={{ marginRight: "20px" }}
                        >
                          <img
                            src={bedIcon}
                            alt="Bed"
                            style={{ width: "24px", height: "24px" }}
                          />
                          <span style={{ paddingTop: "10px",fontSize:10 }}>
                            {product.room} beds
                          </span>
                        </span>

                        <span
                          className="d-flex flex-column align-items-center"
                          style={{ marginRight: "20px" }}
                        >
                          <img
                            src={bathIcon}
                            alt="Bath"
                            style={{ width: "24px", height: "24px" }}
                          />
                          <span style={{ paddingTop: "10px" ,fontSize:10}}>
                            {product.bathroom} baths
                          </span>
                        </span>

                        <span className="d-flex flex-column align-items-center">
                          <img
                            src={area}
                            alt="Area"
                            style={{ width: "24px", height: "24px" }}
                          />
                          <span style={{ paddingTop: "10px" ,fontSize:10}}>
                            {product.land_price_per_sqft} sq.ft
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "1px",
                      backgroundColor: "#DBDBDB",
                      margin: "2% auto",
                    }}
                  />
                </div>
              </div>

              {/* Agent Sidebar */}
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
                      <text
                        style={{
                          fontSize: 14,
                          fontFamily: "Poppins",
                          fontWeight: 400,
                          color: "#3A3A3A",
                        }}
                      >
                        {agentInfo.name || ""}
                      </text>
                      <p
                        className="text-muted mb-0"
                        style={{
                          fontSize: "7px",
                          fontFamily: "Poppins",
                          fontWeight: 400,
                          color: "#3A3A3A",
                        }}
                      >
                        {agentInfo.reg_no || ""}{" "}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${
                      agentInfo.whatsapp
                    }?text=${encodeURIComponent(whatsappMessage)}`}
                    className="btn btn-warning text-white w-100"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: "#F4980E", borderRadius: 99 }}
                  >
                    <i className="bi bi-whatsapp me-2"></i>{" "}
                    <text
                      style={{
                        fontSize: 14,
                        fontFamily: "Poppins",
                        fontWeight: 400,
                        color: "#FAFAFA",
                      }}
                    >
                      WhatsApp Agent
                    </text>
                  </a>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-12">
                  <div className="mb-3">
                    <text
                      style={{
                        fontSize: "16px",
                        fontFamily: "Poppins",
                        fontWeight: 600,
                      }}
                    >
                      Property Details
                    </text>
                    {/* <div
                      style={{
                        width: "100%", // or a fixed width
                        height: "1px",
                        backgroundColor: "var(--Grey-2, #DBDBDB)",
                        marginTop: "20px",
                        marginBottom: "20px",
                      }}
                    /> */}
                    <div className="row">
                      <div className="col-6 p-3">
                        <text
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Property Category:
                        </text>
                        <br />
                        <text
                          style={{
                            color: "#737373",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          {product.property_type_description}
                        </text>
                      </div>
                      <div className="col-6 pt-3">
                        <text
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Property Type :
                        </text>
                        <br />
                        <text
                          style={{
                            color: "#737373",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          {product.property_lot_type_description}
                        </text>
                      </div>
                      <div className="col-6 p-3">
                        <text
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Title:
                        </text>
                        <br />
                        <text
                          style={{
                            color: "#737373",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          {product.property_title}
                        </text>
                      </div>
                      <div className="col-6 pt-3">
                        <text
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Holding:
                        </text>
                        <br />
                        <text
                          style={{
                            color: "#737373",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          {product.property_title}
                        </text>
                      </div>
                      <div className="col-6 p-3">
                        <text
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Lot Type:
                        </text>
                        <br />
                        <text
                          style={{
                            color: "#737373",
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          {" "}
                          {product.property_holding}
                        </text>
                      </div>
                      <div className="col-6 pt-3">
                        <text
                          style={{
                            fontSize: "14px",
                            fontFamily: "Poppins",
                            fontWeight: 400,
                          }}
                        >
                          Position:
                        </text>
                        <br />
                        {hasValue(product?.built_size) ? (
                          <text
                            style={{
                              color: "#737373",
                              fontSize: "14px",
                              fontFamily: "Poppins",
                              fontWeight: 400,
                            }}
                          >
                            {product.built_size}{" "}
                            {product.built_size_unit || "sqft"}
                          </text>
                        ) : hasValue(product?.land_price_per_sqft) ? (
                          <text
                            style={{
                              color: "#737373",
                              fontSize: "14px",
                              fontFamily: "Poppins",
                              fontWeight: 400,
                            }}
                          >
                            {product.land_price_per_sqft}{" "}
                            {product.land_size_unit || "sqft"}
                          </text>
                        ) : null}{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "67%", // or a fixed width
                  height: "1px",
                  backgroundColor: "var(--Grey-2, #DBDBDB)",
                  marginBottom: "20px",
                }}
              />
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
              <div
                style={{
                  width: "67%", // or a fixed width
                  height: "1px",
                  backgroundColor: "var(--Grey-2, #DBDBDB)",
                  marginBottom: "20px",
                }}
              />
              <div>
                <MortgageCalculator product={product}></MortgageCalculator>
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
