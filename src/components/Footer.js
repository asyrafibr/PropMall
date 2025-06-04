// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#DDC9B0",
        padding: "15px 30px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 16,
          fontWeight: 400,
          marginBottom: 8,
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
          <span>For sale tab</span>
          <span>For rental tab</span>
          <span>Want to buy tab</span>
          <span>Want to rent tab</span>
          <span>Articles tab</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 600 }}>HomesMatchKL.com</div>
      </div>

      {/* Divider line */}
      <hr style={{ borderColor: "#3A3A3A", margin: "8px 0" }} />

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          fontWeight: 400,
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <span style={{ cursor: "pointer" }}>Terms and condition tab</span>
          <span style={{ cursor: "pointer" }}>Privacy policy tab</span>
        </div>
        <div>
          Copyright © HomesMatchKL.co. All Rights Reserved. Powered by PropMall.co.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
