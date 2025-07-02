import React from "react";
import image1 from '../image/sidebarimg1.jpg'
import image2 from '../image/sidebarimg2.png'

const SidebarFilters = ({ selectedLocationName, searchType }) => {
  const filters = [
    "All categories",
    "Holding Types",
    "Facilities",
    "Price Range (RM)",
    "Bedrooms",
    "Built-up Size (sq.ft)",
  ];

  const adCards = [
    {
      image: image1, // replace with actual ad image
      title: "Looking for Your Next Investment Property?",
      text: `Join PropMall today to explore a vast range of exclusive listings that update regularly, tailored to meet your needs. Whether you're seeking premium properties or hidden gems, PropMall connects you with the best options in the market.`,
    },
    {
      image: image2, // replace with actual ad image
      title: "Own Resort Style Condo Now!",
      text: `Join PropMall today to explore a vast range of exclusive listings that update regularly, tailored to meet your needs. Whether you're seeking premium properties or hidden gems, PropMall connects you with the best options in the market.`,
    },
  ];

  return (
    <div
      // style={{
      //   width: "400px",
      //   backgroundColor: "#FAFAFA",
      //   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
      //   borderRadius: "8px",
      //   padding: "20px",
      //   boxSizing: "border-box",
      //   display: "flex",
      //   flexDirection: "column",
      //   gap: "20px", // space between filter and ad section
      // }}
    >
      {/* Title */}
      {/* <h2
        style={{
          fontWeight: 600,
          fontSize: "20px",
          textAlign: "center",
          color: "#000",
        }}
      >
        {searchType
          ? `Houses for ${searchType === "sell" ? "sale" : "rent"} in ${
              selectedLocationName || "your location"
            }`
          : `Houses in ${selectedLocationName || "your location"}`}
      </h2> */}

      {/* Dropdown buttons */}
      {/* <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {filters.map((btnText) => (
          <button
            key={btnText}
            type="button"
            className="btn"
            style={{
              width: "100%",
              textAlign: "left",
              fontWeight: 400,
              backgroundColor: "transparent",
              border: "none",
              borderBottom: "1px solid #ccc",
              position: "relative",
              cursor: "pointer",
              fontFamily: "Poppins",
              borderRadius: 0,
              padding: "14px 12px 18px",
            }}
          >
            {btnText}
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #000",
              }}
            />
          </button>
        ))}
      </div> */}

      {/* Advertisement Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {adCards.map((ad, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ padding: "8px", fontSize: "12px", color: "#999" ,textAlign:'center'}}>
              Advertisement
            </div>
            <img
              src={ad.image}
              alt={ad.title}
              style={{
            width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
              }}
            />
            <div style={{ padding: "16px" }}>
              <h5 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>
                {ad.title}
              </h5>
              <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px" }}>
                {ad.text}
              </p>
              <button
                style={{
                  backgroundColor: "#FFA726",
                  border: "none",
                  padding: "8px 16px",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Explore Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarFilters;
