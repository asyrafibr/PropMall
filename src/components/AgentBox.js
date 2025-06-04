import React from "react";
import { useAuth } from "../context/AuthContext";
import agentimage from "../image/Profile.jpg";
import agentBoxbg from "../image/Landing_HeroAgent.jpg";

const AgentBox = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return (
    <div>
      {isLoggedIn && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            height: "146px",
            width: "100%",
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${agentBoxbg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            padding: "20px",
            paddingLeft: "50px",
            display: "flex",
            alignItems: "center",
            color: "#fff",
          }}
        >
          {/* Agent Circle Photo */}
          <img
            src={agentimage}
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
            <div style={{ fontSize: "18px", fontWeight: "bold" }}>John Doe</div>
            <div style={{ fontSize: "14px" }}>XYZ Realty Group</div>
            <div style={{ fontSize: "14px" }}>📞 (123) 456-7890</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentBox;
