import React from "react";

const ListingsCount = ({ productCount }) => {
  return (
    <div className="mb-4">
      <h5>{productCount} Listings in PropMall</h5>
    </div>
  );
};

export default ListingsCount;
