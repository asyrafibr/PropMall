import React from "react";
import SideFilter from "../components/SideFilters";
import LegalFeeCalculator from "./LegalFeeCalculator";

const Tools = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // center horizontally
        alignItems: "center",     // center vertically
        minHeight: "100vh",       // take full viewport height
        padding: "40px 20px",
        backgroundColor: "#f9f9f9", // optional for contrast
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px", // space between calculator and filter
          alignItems: "flex-start",
          maxWidth: "1200px",
          width: "100%",
          justifyContent: "center", // keep both elements centered as a group
        }}
      >
        <div style={{ flex: "1 1 700px", maxWidth: "700px" }}>
          <LegalFeeCalculator />
        </div>
        <div style={{ flex: "0 0 350px", maxWidth: "350px" }}>
          <SideFilter />
        </div>
      </div>
    </div>
  );
};

export default Tools;
