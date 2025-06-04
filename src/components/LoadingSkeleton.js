// src/components/ListingCardSkeleton.js
import React from "react";

const ListingCardSkeleton = () => {
  return (
    <div
      className="listing-card-skeleton"
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "20px",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#eee",
        animation: "pulse 1.5s infinite",
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: "150px",
          height: "100px",
          backgroundColor: "#ccc",
          borderRadius: "6px",
        }}
      ></div>

      {/* Content placeholder */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: "20px",
            width: "60%",
            backgroundColor: "#ccc",
            marginBottom: "10px",
            borderRadius: "4px",
          }}
        ></div>
        <div
          style={{
            height: "14px",
            width: "40%",
            backgroundColor: "#ddd",
            marginBottom: "8px",
            borderRadius: "4px",
          }}
        ></div>
        <div
          style={{
            height: "14px",
            width: "50%",
            backgroundColor: "#ddd",
            borderRadius: "4px",
          }}
        ></div>
      </div>

      <style>{`
        @keyframes pulse {
          0% {
            background-color: #eee;
          }
          50% {
            background-color: #ddd;
          }
          100% {
            background-color: #eee;
          }
        }
      `}</style>
    </div>
  );
};

export default ListingCardSkeleton;
