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
  className="w-100 d-flex align-items-center text-white pb-3 pt-3"
  style={backgroundStyle}
>
  <div className="container-xl px-4 px-md-1">
    <div className="d-flex align-items-center">
      {agent.photo && (
        <img
          src={agent.photo}
          alt="Agent"
          className="rounded-circle border border-2 me-3 object-fit-cover"
          style={{ width: "80px", height: "80px" }}
        />
      )}
      <div>
        <p className="fs-5 lh-1 mb-0">{agent.name}</p>
        <p className="fs-6 mt-2 lh-1 mb-0">{agent.agency_name}</p>
        <p className="fs-6 mt-2 lh-1 mb-0">{agent.phone}</p>
      </div>
    </div>
  </div>
</div>

  );
};

export default AgentBox;
