import React, { useState, useEffect } from "react";
import agentBoxbg from "../image/Landing_HeroAgent.jpg";
import { getAgent } from "../api/axiosApi";
import { useTemplate } from "../context/TemplateContext";

const AgentBox = () => {
  const [agent, setAgent] = useState({});
  const { template } = useTemplate();

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const agentRes = await getAgent();

        setAgent(agentRes.data.agent); // ✅ schedules agent update

        // ❌ agent is NOT updated here yet
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };

    fetchAgentData();
  }, []);
  useEffect(() => {
    if (agent) {
    }
  }, [agent]);

  return (
    <div
      style={{
        position: "relative",
        inset: 0,
        zIndex: 1,
        height: "146px",
        width: "100%",
        backgroundImage:
          template === "template1"
            ? `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${agentBoxbg})`
            : "none",
        backgroundColor:
          template !== "template1" ? "rgba(0,0,0,0.5)" : "transparent",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        padding: "20px 100px",
        display: "flex",
        alignItems: "center",
        color: "#fff",
      }}
    >
      {/* Agent Circle Photo */}
      <img
        src={agent.photo || null}
        alt="Agent"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: "20px",
          border: "2px solid white",
        }}
      />

      {/* Agent Info */}
      <div>
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>{agent.name}</div>
        <div style={{ fontSize: "12px" }}>{agent.agency_name}</div>
        <div style={{ fontSize: "12px" }}>{agent.phone}</div>
      </div>
    </div>
  );
};

export default AgentBox;
