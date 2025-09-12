import React from "react";
import SideFilter from "../components/SideFilters";
import LegalFeeCalculator from "./LegalFeeCalculator";

const Tools = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 py-4 px-3 bg-light">
<div className="container-xl">
        <div className="row g-4 justify-content-center">
          {/* Main Calculator */}
          <div className="col-12 col-lg-8">
            <LegalFeeCalculator />
          </div>

          {/* Side Filter */}
          <div className="col-12 col-lg-4">
            <SideFilter />
          </div>
        </div>
      </div>
    </div>
  );
};


export default Tools;
