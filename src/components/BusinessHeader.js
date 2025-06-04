import React from "react";
import { Navbar } from "react-bootstrap";

const BusinessHeader = () => {
  return (
    <Navbar
      variant="dark"
      style={{
        backgroundColor: "#00000080",
        width: "100vw",       // full viewport width, no gaps
        paddingTop: "16px",
        paddingBottom: "16px",
        paddingLeft: 0,
        paddingRight: 0,
        margin: 0,
        boxSizing: "border-box",
      }}
      className="px-0 mx-0"
    >
      <Navbar.Brand
        className="mx-auto text-center fs-4 fw-bold"
        style={{ margin: 0 }}
      >
        ARIF FIKRI - IQI Realty
      </Navbar.Brand>
    </Navbar>
  );
};

export default BusinessHeader;
