import React, { useState, useEffect } from "react";
import { useParams,useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProductDetail = () => {

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams(); // optional if you want the title
  const location = useLocation();
  const { title } = useParams(); // get the title from the URL

  // Access data from ProductList
  const productId = location.state?.productId;
  // const title = location.state?.title;
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.post(
          "https://interview.propmall.my/listing/detail",
          {
            property_id: productId,
          },
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
      } catch (err) {
        setError("Error fetching product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!product)
    return <div className="text-center mt-5">Product not found.</div>;

  // Construct the WhatsApp message
  const whatsappMessage = `Hello My Lovely Agent,
I'm interested in the property that you advertise at website
${window.location.href}
and I would love to visit this property.
My name is:`;

  return (
    <div className="container my-5">
      {/* TOP ROW - IMAGES + DETAILS */}
      <div className="row g-4">
        {/* IMAGES */}
        <div className="col-lg-5">
          <div className="d-flex flex-column gap-3">
            {product.property_photos.map((photo, index) => (
              <a
                key={index}
                href={photo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={photo}
                  alt={`Property ${index + 1}`}
                  className="img-fluid rounded shadow-sm"
                />
              </a>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="col-lg-7">
          <div className="card shadow-sm p-3">
            <h4 className="fw-bold">{product.property_title}</h4>
            <p>
              <strong>Location:</strong> {product.property_location}
            </p>
            <p>
              <strong>Built Size:</strong> {product.property_built_size} sqft
            </p>
            <p>
              <strong>Land Size:</strong> {product.property_land_size} sqft
            </p>
            <p>
              <strong>Rooms:</strong> {product.property_room}
            </p>
            <p>
              <strong>Bathrooms:</strong> {product.property_bathroom}
            </p>
            <hr />
            <p>
              <strong>Property Description:</strong>
            </p>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {product.property_description}
            </pre>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - ASKING PRICE + WHATSAPP */}
      <div className="mt-5">
        {/* ASKING PRICE */}
        <div className="card p-4 shadow-sm mb-4">
          <h5 className="fw-semibold">Asking Price</h5>
          <table className="table table-bordered mt-2 text-center">
            <thead className="table-light">
              <tr>
                {Object.keys(product.property_prices).map((year) => (
                  <th key={year}>{year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.entries(product.property_prices).map(
                  ([year, price]) => (
                    <td
                      key={year}
                      className={
                        year === "2025" ? "bg-light text-dark fw-bold" : ""
                      }
                    >
                      RM {price.toLocaleString()}
                    </td>
                  )
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {/* WHATSAPP BUTTON */}
        <div className="text-end">
          <a
            href={`https://wa.me/60132936420?text=${encodeURIComponent(
              whatsappMessage
            )}`}
            className="btn btn-success btn-lg px-4 shadow"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-whatsapp me-2"></i> WhatsApp Agent Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
