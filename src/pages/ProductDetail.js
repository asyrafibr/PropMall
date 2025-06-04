import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaBed, FaBath } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import AgentBox from "../components/AgentBox";
const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const productId = location.state?.productId;
  const [previewImage, setPreviewImage] = useState(null);
  const { isLoggedIn } = useAuth(); // ✅ Get login status

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.post(
          "https://interview.propmall.my/listing/detail",
          { property_id: productId },
          {
            headers: {
              Authentication: "TOKEN 67ce6d78ad121633723921",
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.status === "ok") {
          setProduct(response.data.listing);
        } else {
          setError("Failed to fetch product details.");
        }
      } catch {
        setError("Error fetching product details.");
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProductDetails();
    else {
      setError("Missing property ID.");
      setLoading(false);
    }
  }, [productId]);

  const whatsappMessage = `Hello My Lovely Agent,\nI'm interested in the property that you advertise at website\n${window.location.href}\nand I would love to visit this property.\nMy name is:`;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center mt-5 text-danger fw-bold">{error}</div>;
  }
  if (!product) {
    return (
      <div className="text-center mt-5 text-muted">Product not found.</div>
    );
  }

  return (
    <div
      className="container "
      style={{ maxWidth: "1300px", paddingLeft: "50px", paddingRight: "50px" }}
    >
   {isLoggedIn && (
          <div
            style={{
              width: "100vw", // Full viewport width
              position: "relative",
              left: "50%",
              right: "50%",
              marginLeft: "-50vw",
              marginRight: "-50vw",
              background: "#F0F0F0", // Optional background to distinguish
              padding: "50px 0"
              
            }}
          >
            <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
              <AgentBox />
            </div>
          </div>
        )}
      <div style={{paddingTop:isLoggedIn == true ?'100px':'80px'}}>
        <text className="fw-bold" style={{ fontSize: "20px" }}>
          {product.property_title}
        </text>
      </div>
      <div className="card shadow-sm">
        {/* Responsive Images */}
        {product?.property_photos?.length > 0 && (
          <div
            className="d-flex flex-lg-row flex-column mb-4"
            style={{ gap: "12px", alignItems: "flex-start" }}
          >
            {/* Large Image */}
            <img
              src={product.property_photos[0]}
              alt="Main Property"
              onClick={() => setPreviewImage(product.property_photos[0])}
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

            {/* Small Images Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridTemplateRows: "repeat(2, 236px)",
                gap: "12px",
                width: "100%",
                maxWidth: 638, // 319*2 + gaps approx
              }}
              className="mt-3 mt-lg-0"
            >
              {[1, 2, 3, 4].map(
                (i) =>
                  product.property_photos[i] && (
                    <img
                      key={i}
                      src={product.property_photos[i]}
                      alt={`Property ${i + 1}`}
                      onClick={() =>
                        setPreviewImage(product.property_photos[i])
                      }
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

        {/* PRICING + AGENT INFO */}
        <div className="row g-4 p-4">
          <div className="col-lg-8">
            <h5 className="fw-bold text-dark mb-2">
              RM {parseInt(product.price).toLocaleString()}
            </h5>
            <p className="mb-1">{product.property_title}</p>
            <small className="text-muted d-block mb-3">
              {product.property_location}
            </small>

            <div className="d-flex justify-content-start flex-wrap gap-3">
              <span
                className="d-flex align-items-center"
                style={{ gap: "6px", fontSize: "16px", color: "#444" }}
              >
                <FaBed />
                {product.property_room} beds
              </span>
              <span
                className="d-flex align-items-center"
                style={{ gap: "6px", fontSize: "16px", color: "#444" }}
              >
                <FaBath />
                {product.property_bathroom} baths
              </span>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card p-3"
              style={{
                border: "1px solid #DBDBDB",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                borderRadius: "8px",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <img
                  src="https://i.pravatar.cc/50?img=3"
                  alt="Agent"
                  className="rounded-circle me-3"
                />
                <div>
                  <strong>{product.agent_name || "Stephanie"}</strong>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
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

      {/* Image Preview Modal */}
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

      {/* Property Details and Facilities */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card p-3 shadow-sm mb-3">
            <text className="fw-bold" style={{ fontSize: "20px" }}>
              Property Details
            </text>
            <div className="row">
              <div className="col-6">
                <strong>Type:</strong>
                <br />
                {product.property_type}
              </div>
              <div className="col-6">
                <strong>Land Title:</strong>
                <br />
                {product.land_title}
              </div>
              <div className="col-6">
                <strong>Title Type:</strong>
                <br />
                {product.property_title_type}
              </div>
              <div className="col-6">
                <strong>Lot:</strong>
                <br />
                {product.bumi_lot}
              </div>
              <div className="col-6">
                <strong>Tenure:</strong>
                <br />
                {product.tenure}
              </div>
              <div className="col-6">
                <strong>Size:</strong>
                <br />
                {product.property_built_size} sqft
              </div>
            </div>
          </div>

          <div className="card p-3 shadow-sm mb-3">
            <text className="fw-bold" style={{ fontSize: "20px" }}>
              Property Facilities
            </text>
            <div className="row text-center">
              {product?.property_facilities?.includes("Parking") && (
                <div className="col-6 mb-2">
                  <i className="bi bi-car-front"></i> Parking
                </div>
              )}
              {product?.property_facilities?.includes("Gym") && (
                <div className="col-6 mb-2">
                  <i className="bi bi-barbell"></i> Gym
                </div>
              )}
              {product?.property_facilities?.includes("Swimming Pool") && (
                <div className="col-6 mb-2">
                  <i className="bi bi-water"></i> Swimming Pool
                </div>
              )}
              {product?.property_facilities?.includes("BBQ") && (
                <div className="col-6 mb-2">
                  <i className="bi bi-fire"></i> BBQ
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <div className="mt-5">
        <h5 className="fw-bold mb-3">Similar Properties</h5>
        <div className="row g-3">
          {[1, 2, 3].map((_, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="card shadow-sm">
                <img
                  src="https://via.placeholder.com/400x200"
                  alt="Similar Property"
                  className="img-fluid"
                />
                <div className="p-3">
                  <h6 className="fw-bold">From RM 700,000</h6>
                  <p className="mb-1 text-muted">Tropicana Avalon</p>
                  <small className="text-muted">
                    2-sty Terrace/Link House
                    <br />
                    Genting Highland, Pahang
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
