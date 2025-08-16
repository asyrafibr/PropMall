import React from "react";
import { useTemplate } from "../context/TemplateContext";

// ✅ Import all your template components
import ProductDetailT1 from "../pages/ProductDetail"; // Template 1
import ProductDetailT2 from "../pages/ProductDetailT2"; // Template 2
import ProductDetailT3 from "../pages/ProductDetailT3"; // Template 3
import ProductDetailT4 from "../pages/ProductDetailT4"; // Template 4

const ProductDetailPage = () => {
  const { agent, template } = useTemplate();

  // ✅ Mapping template names to components
  const templateMap = {
    template1: <ProductDetailT1 />,
    template2: <ProductDetailT2 />,
    template3: <ProductDetailT3 />,
    template4: <ProductDetailT4 />,
  };

  // ✅ Default to template1 if not found
  return <div>{templateMap[template] || <ProductDetailT1 />}</div>;
};

export default ProductDetailPage;