// src/components/Footer.js
import React, { useState,useEffect } from "react";
import { useTemplate } from "../context/TemplateContext";
import { getAgent } from "../api/axiosApi";

const Footer = () => {
    const [domain,setDomain]=useState()

    const { template } = useTemplate();
  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const agentRes = await getAgent();
        setDomain(agentRes.data.domain);
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };
    fetchAgentData();
  }, []);
    useEffect(() => {
      if (domain) {
        console.log("domain123", domain);
      }
    }, [domain]);
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
          fontSize: 16,
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
        <div style={{ fontSize: 20, fontWeight: 600 }}></div>
      </div>

      {/* Divider line */}
      <hr style={{ borderColor: "#3A3A3A", margin: "8px 0" }} />

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          fontWeight: 400,
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <span style={{ cursor: "pointer" }}>Terms and condition tab</span>
          <span style={{ cursor: "pointer" }}>Privacy policy tab</span>
        </div>
        <div>
          Copyright ©  All Rights Reserved. Powered by PropMall.co
        </div>
      </div>
    </footer>
  );
};

export default Footer;
