// src/components/Footer.js
import React, { useState, useEffect } from "react";
import { useTemplate } from "../context/TemplateContext";
import { getAgent } from "../api/axiosApi";
import agentBoxbg from "../image/Template2_Sky_Footer.png";
import bg3 from "../image/bg3.png";
import bg4 from "../image/footer4.png";

const Footer = () => {
  const [domain, setDomain] = useState();
  const { agent, category, mainAgent } = useTemplate();

  const { template } = useTemplate();
  console.log("TEMPLATE", template);

  const renderByTemplate = () => {
    switch (template) {
      case "template1":
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
                fontSize: 14,
                fontWeight: 400,
                marginBottom: 8,
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
                <span>Sale</span>
                <span>Rent</span>
                <span>Want To Buy</span>
                <span>Want To Rent</span>
                <span>Articles</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {mainAgent.name}
              </div>
            </div>

            {/* Divider line */}
            <hr style={{ borderColor: "#3A3A3A", margin: "8px 0" }} />

            {/* Bottom row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                fontWeight: 400,
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <span style={{ cursor: "pointer" }}>
                  Terms and condition tab
                </span>
                <span style={{ cursor: "pointer" }}>Privacy policy tab</span>
              </div>
              <div>
                Copyright © {mainAgent.name} All Rights Reserved. Powered by
                PropMall.co
              </div>
            </div>
          </footer>
        );
      case "template2":
        return (
          <>
            <footer
              style={{
                padding: "15px 30px",

                backgroundImage: `url(${agentBoxbg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 400,
                  marginBottom: 8,
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
                  <span>Sale</span>
                  <span>Rent</span>
                  <span>Want To Buy</span>
                  <span>Want To Rent</span>
                  <span>Articles</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {mainAgent.name}
                </div>
              </div>

              {/* Divider line */}
              <hr style={{ borderColor: "#3A3A3A", margin: "8px 0" }} />

              {/* Bottom row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  fontWeight: 400,
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <span style={{ cursor: "pointer" }}>
                    Terms and condition tab
                  </span>
                  <span style={{ cursor: "pointer" }}>Privacy policy tab</span>
                </div>
                <div>
                  Copyright © {mainAgent.name} All Rights Reserved. Powered by
                  PropMall.co
                </div>
              </div>
            </footer>
          </>
        );
      case "template3":
        return (
          <>
            <footer
              style={{
                padding: "15px 30px",

                backgroundImage: `url(${bg3})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 400,
                  marginBottom: 8,
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
                  <span>Sale</span>
                  <span>Rent</span>
                  <span>Want To Buy</span>
                  <span>Want To Rent</span>
                  <span>Articles</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {mainAgent.name}
                </div>
              </div>

              {/* Divider line */}
              <hr style={{ borderColor: "#3A3A3A", margin: "8px 0" }} />

              {/* Bottom row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  fontWeight: 400,
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <span style={{ cursor: "pointer" }}>
                    Terms and condition tab
                  </span>
                  <span style={{ cursor: "pointer" }}>Privacy policy tab</span>
                </div>
                <div>
                  Copyright © {mainAgent.name} All Rights Reserved. Powered by
                  PropMall.co
                </div>
              </div>
            </footer>
          </>
        );
      case "template4":
        return (
          <>
            <footer
              style={{
                padding: "15px 30px",

                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg4})`,
                backgroundSize: "100%", // zoom out (try 110%, 120%, etc.)
                backgroundRepeat: "no-repeat",
                backgroundPosition: "10% 10%", // shifted right
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 400,
                  marginBottom: 8,
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "25px",
                    flexWrap: "wrap",
                    color: "#FAFAFA",
                  }}
                >
                  <span>Sale</span>
                  <span>Rent</span>
                  <span>Want To Buy</span>
                  <span>Want To Rent</span>
                  <span>Articles</span>
                </div>
                <div
                  style={{ fontSize: 18, fontWeight: 600, color: "#FAFAFA" }}
                >
                  {mainAgent.name}
                </div>
              </div>

              {/* Divider line */}
              <hr style={{ borderColor: "#FAFAFA", margin: "8px 0" }} />

              {/* Bottom row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  fontWeight: 400,
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    color: "#FAFAFA",
                  }}
                >
                  <span style={{ cursor: "pointer" }}>
                    Terms and condition tab
                  </span>
                  <span style={{ cursor: "pointer" }}>Privacy policy tab</span>
                </div>
                <div style={{ color: "#FAFAFA" }}>
                  Copyright © {mainAgent.name} All Rights Reserved. Powered by
                  PropMall.co
                </div>
              </div>
            </footer>
          </>
        );
      default:
        return <p>No template selected</p>;
    }
  };

  return <div>{renderByTemplate()}</div>;
};

export default Footer;
