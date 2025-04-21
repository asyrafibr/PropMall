import React from "react";

const YearTabs = ({ years, activeYear }) => {
  return (
    <div className="d-flex justify-content-end mb-3 px-2" style={{ fontWeight: "bold" }}>
      {years.map((y) => (
        <div
          key={y}
          style={{
            minWidth: "120px",
            textAlign: "center",
            padding: "4px 8px",
            backgroundColor: activeYear === y.toString() ? "#e0e0e0" : "transparent",
            color: "black",
            borderRadius: "5px",
            marginRight: "5px",
          }}
        >
          {y}
        </div>
      ))}
    </div>
  );
};

export default YearTabs;
