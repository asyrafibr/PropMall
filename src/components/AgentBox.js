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
        setAgent(agentRes.data.agent);
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };

    fetchAgentData();
  }, []);

  const backgroundStyle =
    template === "template1"
      ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${agentBoxbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {
          backgroundColor: "rgba(0,0,0,0.5)",
        };

  return (
    <div
      className="w-100 d-flex align-items-center text-white p-3 ps-5 ps-md-5"
      style={backgroundStyle}
    >
      {agent.photo && (
        <img
          src={agent.photo}
          alt="Agent"
          className="rounded-circle border border-2 me-3 object-fit-cover"
          style={{ width: "80px", height: "80px" }}
        />
      )}
      <div>
        <div className="fs-5">{agent.name}</div>
        <div className="fs-6">{agent.agency_name}</div>
        <div className="fs-6">{agent.phone}</div>
      </div>
    </div>
  );
};

export default AgentBox;
