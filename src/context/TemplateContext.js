// context/TemplateContext.js
import React, { createContext, useContext, useState } from "react";

const TemplateContext = createContext();

export const useTemplate = () => useContext(TemplateContext);

export const TemplateProvider = ({ children }) => {
  const [template, setTemplate] = useState("template1");

  const switchTemplate = (newTemplate) => setTemplate(newTemplate);

  return (
    <TemplateContext.Provider value={{ template, switchTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};
