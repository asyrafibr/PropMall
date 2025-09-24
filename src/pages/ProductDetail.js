import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaBed, FaBath } from "react-icons/fa";
import AgentBox from "../components/AgentBox";
import { getAgent, getFeaturedList, getListingInfo } from "../api/axiosApi";
import sharImage from "../image/ios_share.svg";
import saveImage from "../image/kid_star.svg";
import SimilarListing from "../components/SimilarListingCard";
import "./ProductDetail.css";
import { FiCamera } from "react-icons/fi";
import MortgageCalculator from "./MortgageCalculator";
import MortgageCalculator2 from "./MortgageCalculator2";
import MortgageCalculator3 from "./MortgageCalculator3";
import MortgageCalculator4 from "./MortgageCalculator4";
import builtIcon from "../image/built_up.svg";
import landIcon from "../image/land_size.svg";
import locationIcon from "../image/size_built.svg";
import bathIcon from "../image/bath.svg";
import bedIcon from "../image/bed.svg";
import { useTemplate } from "../context/TemplateContext"; // ✅ Import Template Context
import bgImage from "../image/template2bg.png";

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
  const { slug } = useParams(); // capture slug from /property/:slug

  const whatsappMessage = `Hello My Lovely Agent,\nI'm interested in the property that you advertise at website\n${window.location.href}\nand I would love to visit this property.\nMy name is:`;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailRefs = useRef([]);
  const navigate = useNavigate();
  // const location = useLocation();
  console.log("cardd", location.state);
  useEffect(() => {
    // Check if URL contains the old "/list/" permalink
    if (location.pathname.startsWith("/list/")) {
      const newPath = location.pathname.replace("/list/", "/for-sale/");
      navigate(newPath, { replace: true }); // replace history so old link isn’t stored
    }
  }, [location, navigate]);
  useEffect(() => {
    // redirect old permalink
    if (location.pathname.startsWith("/list/")) {
      const newPath = location.pathname.replace("/list/", "/for-sale/");
      navigate(newPath, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        const hostname = window.location.hostname;
        const domain = hostname.replace(/^www\./, "").split(".")[0];
        const url_fe = window.location.href;

        const params = productId
          ? { id_listing: productId, domain, url_fe } // if we know the id
          : { permalink: `/for-sale/${slug}`, domain, url_fe }; // fallback to permalink

        const response = await getListingInfo(params);

        setProduct(response.data.listing_info);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (productId || slug) {
      fetchProductDetails();
    }
  }, [productId, slug]);
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
  const formatModus = (modus) => {
    if (!modus) return "";

    // Remove "FOR " if it exists
    let cleaned = modus.replace(/^FOR\s+/i, "");

    // Make only first letter uppercase, rest lowercase
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  };
  const getThumbnailSlice = () => {
    const total = modalImages.length;
    const start = Math.max(0, Math.min(currentImageIndex - 5, total - 10));
    return modalImages.slice(start, start + 10);
  };
  const hasValue = (v) => v !== null && v !== undefined && v !== "";

  return (
    <div>
      <div className="pt-3 bg-light">
        <div className="container px-3 px-md-5">
          {/* Breadcrumb */}
          <div className="pb-4">
            {/* Breadcrumb with left padding */}
            <div className="ps-0 ps-md-0">
              <nav aria-label="breadcrumb">
                <ol
                  className="breadcrumb"
                  style={{ "--bs-breadcrumb-divider": "'›'" }}
                >
                  <li className="breadcrumb-item">
                    <a href="/" className="text-decoration-none text-dark">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a
                      href="/properties"
                      className="text-decoration-none text-dark"
                    >
                      {formatModus(location.state?.status)}
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a
                      href="/properties/kuala-lumpur"
                      className="text-decoration-none text-dark"
                    >
                      {location.state?.location}
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item active text-dark"
                    aria-current="page"
                  >
                    {product.ads_title}
                  </li>
                </ol>
              </nav>
            </div>

            {/* Ads title (no padding-left) */}
            {template === "template1" && (
              <p className="fs-5 fw-semibold font-poppins">
                {product.ads_title}
              </p>
            )}
          </div>

          {/* Photos */}
          {/* Container for main + thumbnails */}
          <div className="d-flex flex-column flex-md-row gap-3 align-items-start">
            {/* Main Image */}
            <div className="flex-grow-1" style={{ minWidth: "0" }}>
              <div className="position-relative w-100">
                <img
                  src={product.photos[0]}
                  alt="Main Property"
                  onClick={() => {
                    setModalImages(product.photos);
                    setCurrentImageIndex(0);
                    setModalOpen(true);
                  }}
                  className="img-fluid rounded object-fit-cover w-100"
                  style={{ height: "450px", cursor: "pointer" }}
                />

                {/* Mobile Show All Button */}
                <div className="d-md-none position-absolute bottom-0 end-0 m-2">
                  <div
                    className="d-flex align-items-center px-3 py-2 border rounded bg-light text-secondary small font-poppins"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setModalImages(product.photos);
                      setCurrentImageIndex(0);
                      setModalOpen(true);
                    }}
                  >
                    <FiCamera size={16} className="me-1" />
                    <span>Show All</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnails (only ≥ md / 768px) */}
            <div
              className="d-none d-md-grid gap-3"
              style={{
                gridTemplateColumns: "repeat(2, 1fr)",
                width: "320px", // 🔑 fixed width so it doesn’t wrap under
                maxHeight: "450px",
                flexShrink: 0, // 🔑 prevents shrinking
              }}
            >
              {product.photos.slice(1, 5).map((photo, i) => {
                const actualIndex = i + 1;
                if (i === 3 && product.photos.length > 5) {
                  return (
                    <div
                      key="show-all"
                      className="position-relative rounded overflow-hidden bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${photo})`,
                        height: "calc(450px / 2 - 15px)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setModalImages(product.photos);
                        setCurrentImageIndex(actualIndex);
                        setModalOpen(true);
                      }}
                    >
                      <div className="position-absolute bottom-0 end-0 m-2">
                        <div className="d-flex align-items-center px-3 py-2 border rounded bg-light small font-poppins text-secondary">
                          <FiCamera size={16} className="me-1" />
                          <span>Show All</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={photo}
                    className="rounded overflow-hidden bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${photo})`,
                      height: "calc(450px / 2 - 15px)",
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
                  <div className="image-wrapper">
                    <button className="nav-button prev" onClick={showPrev}>
                      &#10094;
                    </button>

                    <img
                      src={modalImages[currentImageIndex]}
                      alt="Full View"
                      className="modal-image"
                    />

                    <button className="nav-button next" onClick={showNext}>
                      &#10095;
                    </button>
                  </div>

                  <div className="image-counter">
                    {currentImageIndex + 1} / {modalImages.length}
                  </div>

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
          <div className="card shadow-sm mt-4 ">
            <div className="row g-4 p-4">
              {/* Pricing + Details */}
              <div className="col-lg-8">
                {/* Price + Share/Save */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                  {/* Left (Price + per sqft) */}
                  <div className="d-flex flex-column flex-md-row gap-2">
                    <h5 className="fw-bold text-dark font-poppins mb-0">
                      RM {product.price}
                    </h5>
                    <h6 className="text-muted fw-semibold font-poppins mb-0">
                      (RM {product.built_price_per_sqft} per sq ft)
                    </h6>
                  </div>

                  {/* Right (Share + Save buttons, desktop only) */}
                  <div className="d-none d-md-flex flex-row gap-2">
                    <button className="btn btn-sm d-flex align-items-center text-dark">
                      <img
                        src={sharImage}
                        alt="Share"
                        className="me-1"
                        style={{ width: "16px", height: "16px" }}
                      />
                      Share
                    </button>
                    <button className="btn btn-sm d-flex align-items-center text-warning">
                      <img
                        src={saveImage}
                        alt="Save"
                        className="me-1"
                        style={{ width: "16px", height: "16px" }}
                      />
                      Save
                    </button>
                  </div>
                </div>

                {/* Property Title */}
                <p className="mb-1 fs-5 fw-normal font-poppins">
                  {product.property_title}
                </p>
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
                      {product.location_description}
                    </div>
                  </div>

                  {/* Category / Type */}
                  <div
                    className="row mt-3 text-muted resp-text1"
                    style={{ lineHeight: "1.3" }}
                  >
                    <div className="col">
                      {product.category_type_title_holding_lottype_storey}
                    </div>
                  </div>

                  {/* Built-up and Land Size */}
                  {product.built_size && product.land_size && (
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
                          Built-up Size: {product.built_size}{" "}
                          {product.built_size_unit}{" "}
                          <small className="text-muted">
                            (RM {product.built_price_per_sqft} per sqft)
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
                          Land Size: {product.land_size}{" "}
                          {product.land_size_unit}{" "}
                          <small className="text-muted">
                            (RM {product.land_price_per_sqft} per sqft)
                          </small>
                        </div>
                      </div>
                    </>
                  )}
                  {product.built_size && !product.land_size && (
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
                        Built-up Size: {product.built_size}{" "}
                        {product.built_size_unit}{" "}
                        <small className="text-muted">
                          (RM {product.built_price_per_sqft} per sqft)
                        </small>
                      </div>
                    </div>
                  )}

                  {/* Only Land Size */}
                  {!product.built_size && product.land_size && (
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
                        Land Size: {product.land_size} {product.land_size_unit}{" "}
                        <small className="text-muted">
                          (RM {product.land_price_per_sqft} per sqft)
                        </small>
                      </div>
                    </div>
                  )}
                </p>

                {/* Bed + Bath */}
                {product.room && product.bathroom > 0 && (
                  <div className="d-flex flex-wrap gap-3 mb-2">
                    <span className="d-flex align-items-center gap-1">
                      <img
                        src={bedIcon}
                        alt="Land Size Icon"
                        width={16}
                        height={16}
                        className="me-2"
                      />{" "}
                      <small className="text-muted">{product.room}</small>
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <img
                        src={bathIcon}
                        alt="Land Size Icon"
                        width={16}
                        height={16}
                        className="me-2"
                      />{" "}
                      <small className="text-muted">{product.bathroom}</small>
                    </span>
                  </div>
                )}
                {!product.room && product.bathroom > 0 && (
                  <div className="d-flex flex-wrap gap-3 mb-2">
                    <span className="d-flex align-items-center gap-1">
                      <img
                        src={bathIcon}
                        alt="Land Size Icon"
                        width={16}
                        height={16}
                        className="me-2"
                      />{" "}
                      <small className="text-muted">{product.bathroom}</small>
                    </span>
                  </div>
                )}
                {product.room && !product.bathroom > 0 && (
                  <div className="d-flex flex-wrap gap-3 mb-2">
                    <span className="d-flex align-items-center gap-1">
                      <img
                        src={bedIcon}
                        alt="Land Size Icon"
                        width={16}
                        height={16}
                        className="me-2"
                      />{" "}
                      <small className="text-muted">{product.room}</small>
                    </span>
                  </div>
                )}
              </div>

              {/* Agent Sidebar (Desktop / Tablet only) */}
              <div className="col-lg-4 d-none d-lg-block">
                <div className="card p-3 border rounded">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={agentInfo.photo}
                      alt="Agent"
                      className="rounded-circle me-3"
                      style={{ width: 60, height: 60 }}
                    />
                    <div>
                      <strong>{agentInfo.name || ""}</strong>
                      <p className="text-muted mb-0 small">
                        {agentInfo.reg_no || ""}
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
                    style={{ backgroundColor: "#F4980E" }}
                  >
                    <i className="bi bi-whatsapp me-2"></i> WhatsApp Agent
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Agent card for Mobile only */}
          <div className="card p-3 border rounded mt-3 d-block d-lg-none">
            <div className="d-flex align-items-center mb-3">
              <img
                src={agentInfo.photo}
                alt="Agent"
                className="rounded-circle me-3"
                style={{ width: 60, height: 60 }}
              />
              <div>
                <strong>{agentInfo.name || ""}</strong>
                <p className="text-muted mb-0 small">
                  {agentInfo.reg_no || ""}
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
              style={{ backgroundColor: "#F4980E" }}
            >
              <i className="bi bi-whatsapp me-2"></i> WhatsApp Agent
            </a>
          </div>

          {/* Property Details */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card p-3 shadow-sm mb-3">
                <p className="fw-semibold fs-6 font-poppins">
                  Property Details
                </p>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <p className="mb-0 fw-normal fs-6">Type:</p>
                    <p className="text-muted">
                      {product.property_type_description}
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="mb-0 fw-normal fs-6">Land Title:</p>
                    <p className="text-muted">
                      {product.property_lot_type_description}
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="mb-0 fw-normal fs-6">Title Type:</p>
                    <p className="text-muted">{product.property_title}</p>
                  </div>
                  <div className="col-6">
                    <p className="mb-0 fw-normal fs-6">Lot:</p>
                    <p className="text-muted">{product.property_title}</p>
                  </div>
                  <div className="col-6">
                    <p className="mb-0 fw-normal fs-6">Tenure:</p>
                    <p className="text-muted">{product.property_holding}</p>
                  </div>
                  <div className="col-6">
                    <p className="mb-0 fw-normal fs-6">Size:</p>
                    {hasValue(product?.built_size) ? (
                      <p className="text-muted">
                        {product.built_size} {product.built_size_unit || "sqft"}
                      </p>
                    ) : hasValue(product?.land_price_per_sqft) ? (
                      <p className="text-muted">
                        {product.land_price_per_sqft}{" "}
                        {product.land_size_unit || "sqft"}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Description */}
          {product.ads_description && (
            <div className="card p-3 shadow-sm">
              {/* Title */}
              <h5 className="fw-semibold mb-3">Description</h5>

              {/* Divider */}
              <hr className="my-3 text-secondary opacity-50" />

              {/* Content */}
              <p
                className="mb-0 text-muted fs-6"
                style={{ whiteSpace: "pre-line" }}
              >
                {formatAdsDescription(product.ads_description)}
              </p>
            </div>
          )}

          {/* Mortgage Calculators */}
          {template === "template1" && (
            <div className="card p-3 shadow-sm mt-3">
              <MortgageCalculator product={product} />
            </div>
          )}
          {template === "template2" && (
            <div className="card p-3 shadow-sm mt-3">
              <MortgageCalculator2 product={product} />
            </div>
          )}
          {template === "template3" && (
            <div className="card p-3 shadow-sm mt-3">
              <MortgageCalculator3 product={product} />
            </div>
          )}
          {template === "template4" && (
            <div className="card p-3 shadow-sm mt-3">
              <MortgageCalculator4 product={product} />
            </div>
          )}

          {/* Similar Listings */}
          <SimilarListing listings={similarListing?.featured_rows ?? []} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
