import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
// import ImageSlider from "./ImageSlider";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaBed, FaBath } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import AgentBox from "../components/AgentBox";
import SimilarListing from "./SimilarListingCard";
const DoneDealDetail = (id) => {
  const { productId } = useParams();
  const [listingDetail, setListingDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [previewImage, setPreviewImage] = useState(null);

  // This is your passed prop (from the button)
  const cardData = location.state?.listingCard;

  const id_listing = location.state;

  console.log("Received id_listing:", id_listing);

  // ✅ Fetch Done Deal Detail
  useEffect(() => {
    const fetchDoneDealDetail = async () => {
      try {
        const response = await axios.post(
          "https://dev-agentv3.propmall.net/graph/me/donedeal/info",
          { id_listing }, // Just the ID here
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setListingDetail(response.data.donedeal_info);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id_listing || productId) {
      fetchDoneDealDetail();
    }
  }, [id_listing, productId]);

  // ✅ Fetch Listing Info (for console.log only)
  useEffect(() => {
    const fetchListingInfo = async () => {
      try {
        const response = await axios.post(
          "https://dev-agentv3.propmall.net/graph/me/listing/info",
          {
            domain: "myhartanah.co",
            url_fe: window.location.href,
            id_listing: productId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status === "ok") {
          console.log("Listing Info:", response.data.listing_info);
        }
      } catch (err) {
        console.error("Error fetching listing info:", err);
      }
    };

    if (productId) {
      fetchListingInfo();
    }
  }, [productId]);
  const whatsappMessage = `Hello My Lovely Agent,\nI'm interested in the property that you advertise at website\n${window.location.href}\nand I would love to visit this property.\nMy name is:`;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!listingDetail) return <p>No detail found</p>;

  const {
    ads_title,
    deal_dt,
    price,
    built_size,
    built_size_unit,
    land_size,
    land_size_unit,
    location_area,
    location_state,
    property_type_description,
    photos,
    ads_description,
  } = listingDetail;

  return (
    <div
      className="container"
      style={{ maxWidth: "1300px", paddingLeft: "50px", paddingRight: "50px" }}
    >
      <div
        style={{
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          background: "#F0F0F0",
          padding: "50px 0",
        }}
      >
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          <AgentBox />
        </div>
      </div>
      <div style={{ paddingTop: "100px" }}>
        <h2 className="fw-bold">{listingDetail.ads_title}</h2>
      </div>
      {/* Images */}
      <div className="card shadow-sm">
        {listingDetail.photos?.length > 0 && (
          <div
            className="d-flex flex-lg-row flex-column mb-4"
            style={{ gap: "12px", alignItems: "flex-start" }}
          >
            <img
              src={photos[0]}
              alt="Main"
              onClick={() => setPreviewImage(photos[0])}
              style={{
                width: "100%",
                maxWidth: 646,
                height: "auto",
                maxHeight: 480,
                objectFit: "cover",
                borderRadius: "0.375rem",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridTemplateRows: "repeat(2, 236px)",
                gap: "12px",
                width: "100%",
                maxWidth: 638,
              }}
              className="mt-3 mt-lg-0"
            >
              {[1, 2, 3, 4].map(
                (i) =>
                  photos[i] && (
                    <img
                      key={i}
                      src={photos[i]}
                      alt={`Photo ${i + 1}`}
                      onClick={() => setPreviewImage(photos[i])}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "0.375rem",
                        boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                      }}
                    />
                  )
              )}
            </div>
          </div>
        )}
        {/* Price + Info */}
        <div className="row g-4 p-4">
          <div className="col-lg-8">
            <h5 className="fw-bold text-dark mb-2">
              RM {parseInt(price).toLocaleString()}
            </h5>
            <p className="mb-1">{ads_title}</p>
            <small className="text-muted d-block mb-3">
              {location_area}, {location_state}
            </small>
            <div className="d-flex flex-wrap gap-3">
              <span
                className="d-flex align-items-center"
                style={{ gap: "6px" }}
              >
                <FaBed /> Built-up: {built_size} {built_size_unit}
              </span>
              <span
                className="d-flex align-items-center"
                style={{ gap: "6px" }}
              >
                <FaBath /> Land size: {land_size} {land_size_unit}
              </span>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card p-3 shadow-sm">
              <div className="d-flex align-items-center mb-3">
                <img
                  src="https://i.pravatar.cc/50?img=4"
                  alt="Agent"
                  className="rounded-circle me-3"
                />
                <div>
                  <strong>Agent</strong>
                  <p className="text-muted mb-0">Verified Agent</p>
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

        {/* Image Preview */}
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
              <div className="modal-content bg-transparent border-0 position-relative">
                <div className="modal-body p-0">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{
                      maxHeight: "80vh",
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                  aria-label="Close"
                  onClick={() => setPreviewImage(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Description & Type */}
      <div className="card p-3 shadow-sm mb-3">
        <h5 className="fw-bold mb-2">Property Details22</h5>
        <div className="row">
          <div className="col-md-6 mb-2">
            <strong>Type:</strong> {property_type_description}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Sold Date:</strong> {deal_dt}
          </div>
          <div className="col-12 mt-2">
            <strong>Description:</strong>
            <p className="text-muted mt-1">{ads_description}</p>
          </div>
        </div>
      </div>
      {/* Similar Properties */}
      <SimilarListing></SimilarListing>
    </div>
  );
};

export default DoneDealDetail;
