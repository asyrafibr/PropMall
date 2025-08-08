import React from "react";
import SideFilter from "../components/SideFilters";
import LegalFeeCalculator from "./LegalFeeCalculator";

const Tools = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      padding: "40px 20px",
    }}>
      <div
        style={{
          display: "flex",
          gap: "20px", // Reduced from 40px to 20px
          alignItems: "flex-start",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        <LegalFeeCalculator />
        <div style={{ maxWidth: "400px", marginTop: "8%" }}>
          <SideFilter />
        </div>
      </div>
    </div>
  );
};

export default Tools;
