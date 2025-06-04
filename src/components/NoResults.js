import React from "react";

const NoResults = () => {
  return (
    <div
      className="text-center text-muted mt-4 px-3"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowX: "auto",
        whiteSpace: "nowrap",
        fontSize: "1rem",
      }}
    >
      No results found. Try adjusting the filters.
    </div>
  );
};

export default NoResults;
