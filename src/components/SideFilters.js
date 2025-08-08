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
      
    >
    
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
