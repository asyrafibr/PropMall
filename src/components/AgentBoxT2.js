import React, { useState, useEffect } from "react";
import agentBoxbg from "../image/Landing_HeroAgent.jpg";
import { getAgent } from "../api/axiosApi";

const AgentBox = () => {
  const [agent, setAgent] = useState({});

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
    backgroundColor:'rgba(0, 0, 0, 0.50)',
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
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>{agent.name}</div>
        <div style={{ fontSize: "14px" }}>{agent.agency_name}</div>
        <div style={{ fontSize: "14px" }}>{agent.phone}</div>
      </div>
    </div>
  );
};

export default AgentBox;
