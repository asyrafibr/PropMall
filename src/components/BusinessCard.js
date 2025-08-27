import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Dropdown } from "react-bootstrap";
import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
  FaFilePdf,
  FaShareAlt,
} from "react-icons/fa";
import profileImage from "../image/Profile.jpg";
import BackgroundImage from "../image/Landing_Hero.jpg";
import BackgroundImage2 from "../image/template2bg.png";
import BackgroundImage3 from "../image/bg3.png";
import BackgroundImage4 from "../image/bg4.jpg";

import icon1 from "../image/door_open.png";
import icon2 from "../image/house.png";
import icon3 from "../image/create_new_folder.png";
import icon4 from "../image/browse.png";
import BusinessHeader from "./BusinessHeader";
import { useTemplate } from "../context/TemplateContext";
import { getAgent } from "../api/axiosApi";

const buttonStyle = {
  width: "660px",
  height: "52px",
  borderRadius: "8px",
  padding: "12px 16px",
  backgroundColor: "#FFFFFF",
  boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.5)",
  border: "none",
  color: "#3A3A3A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative", // <-- make Button relative for icon absolute positioning
  fontWeight: "500",
  fontSize: "14px",
};
const iconContainerStyle = {
  position: "absolute",
  left: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  height: "24px",
};
function BusinessCard() {
    const { template, switchTemplate } = useTemplate(); // ✅ Use Template Context
  
  // const { template } = useTemplate();
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
    const backgroundMap = {
    template1: BackgroundImage,
    template2: BackgroundImage2,
    template3: BackgroundImage3,
    template4: BackgroundImage4,
  };

  // pick the right one (fallback to template1 if not found)
  const bgImage = backgroundMap[template] || BackgroundImage;
  return (
    <div
      style={{
        overflowX: "hidden", // Prevent horizontal scroll globally
      }}
    >
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          position: "relative",
          paddingTop: "150px",
          paddingBottom: "50px",
        }}
      >
        <div
          style={{ position: "absolute", top: 0, width: "100%", zIndex: 10 }}
        >
          <BusinessHeader domain={agent.domain} />
        </div>
        <Container>
          {/* Header Card with Floating Image */}
          <Card
            className="mb-4 shadow-sm position-relative overflow-visible"
            style={{ backgroundColor: "rgba(250, 250, 250, 0.8)" }}
          >
            <Card.Body
              style={{
                boxShadow: "4px 4px 10px rgba(0,0,0,0.5)",
                paddingTop: "60px",
              }}
            >
              <Row className="align-items-start">
                <Col md={4}>
                  {/* Floating Image */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-36px",
                      left: "20px",
                    }}
                  >
                    <img
                      style={{
                        width: "120px",
                        height: "120px",
                        border: "4px solid white",
                      }}
                      src={agent.photo}
                      alt="Agent"
                      className="rounded-circle shadow"
                    />
                  </div>
                  {/* Text Below Image */}
                  <div style={{ marginTop: "100px", marginLeft: "20px" }}>
                    <h5 className="mb-0">{agent.name}</h5>
                    <p className="text-muted mb-1">
                      {agent.title} {agent.reg_no}{" "}
                    </p>
                    <p className="text-muted">
                      {agent.agency_name} {agent.agency_reg_no}
                    </p>
                  </div>
                </Col>

                <Col md={8} className="text-end">
                  {/* Icons */}
                  <div
                    className="mb-2 d-flex justify-content-end"
                    style={{ gap: "20px" }} // 20px gap between icons
                  >
                    <div
                      style={{
                        width: "53px",
                        height: "53px",
                        borderRadius: "99px",
                        backgroundColor: "#DC3545",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaEnvelope color="white" size={24} />
                    </div>
                    <div
                      style={{
                        width: "53px",
                        height: "53px",
                        borderRadius: "99px",
                        backgroundColor: "#FFC107",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaFilePdf color="white" size={24} />
                    </div>
                    <div
                      style={{
                        width: "53px",
                        height: "53px",
                        borderRadius: "99px",
                        backgroundColor: "#0DCAF0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaShareAlt color="white" size={24} />
                    </div>
                    <div
                      style={{
                        width: "53px",
                        height: "53px",
                        borderRadius: "99px",
                        backgroundColor: "#25D366",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FaWhatsapp color="white" size={24} />
                    </div>
                  </div>

                  {/* Stats Cards aligned right */}
                  <div className="d-flex flex-column align-items-end mt-3">
                    <div className="d-flex gap-2 mb-2">
                      {/* Sale */}
                      <Card
                        className="shadow-sm"
                        style={{ width: "146px", height: "62px" }}
                      >
                        <Card.Body className="p-2 text-start d-flex align-items-center">
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#F4980E",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={icon1}
                              alt="Sale"
                              style={{ width: "24px", height: "24px" }}
                            />
                          </div>

                          <div className="ms-2">
                            <small>Sale</small>
                            <p className="mb-0 fw-bold">31,803</p>
                          </div>
                        </Card.Body>
                      </Card>

                      {/* Rent */}
                      <Card
                        className="shadow-sm"
                        style={{ width: "146px", height: "62px" }}
                      >
                        <Card.Body className="p-2 text-start d-flex align-items-center">
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#F4980E",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={icon2}
                              alt="Rent"
                              style={{ width: "24px", height: "24px" }}
                            />
                          </div>

                          <div className="ms-2">
                            <small>Rent</small>
                            <p className="mb-0 fw-bold">31,803</p>
                          </div>
                        </Card.Body>
                      </Card>

                      {/* New Project */}
                      <Card
                        className="shadow-sm"
                        style={{ width: "146px", height: "62px" }}
                      >
                        <Card.Body className="p-2 text-start d-flex align-items-center">
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#F4980E",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={icon3}
                              alt="New Project"
                              style={{ width: "24px", height: "24px" }}
                            />
                          </div>

                          <div className="ms-2">
                            <small
                              style={{ fontSize: "12px", fontWeight: "400" }}
                            >
                              New Project
                            </small>
                            <p className="mb-0 fw-bold">803</p>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    {/* Total Listings */}
                    <Card
                      className="shadow-sm"
                      style={{ width: "455px", height: "62px" }}
                    >
                      <Card.Body className="p-2 text-start d-flex align-items-center">
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "#F4980E",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={icon4}
                            alt="Total Listings"
                            style={{ width: "24px", height: "24px" }}
                          />
                        </div>

                        <div className="ms-2">
                          <small>Total Listings</small>
                          <p className="mb-0 fw-bold">95,409</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>

                  {/* Dropdown aligned right */}
                  {/* Dropdown with Text */}
                  <div
                    className="d-flex justify-content-end align-items-center mt-2"
                    style={{ gap: "10px" }}
                  >
                    <div className="text-end" style={{ flexGrow: 1 }}>
                      Let us assist you with your property needs.
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        style={{ boxShadow: "4px 4px 10px rgba(0,0,0,0.5)" }}
                      >
                        I Want To
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>Buy</Dropdown.Item>
                        <Dropdown.Item>Sell</Dropdown.Item>
                        <Dropdown.Item>Rent</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Video Section */}
          <Card
            className="mb-4 shadow-sm position-relative overflow-visible"
            style={{ backgroundColor: "rgba(250, 250, 250, 0.8)" }}
          >
            <Card.Body style={{ boxShadow: "4px 4px 10px rgba(0,0,0,0.5)" }}>
              <div className="mb-3 text-center" style={{ paddingTop: "20px" }}>
                <video
                  width="640px"
                  height="280px"
                  controls
                  style={{ borderRadius: "12px" }}
                >
                  <source
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p
                className="text-center"
                style={{
                  width: "640px",
                  margin: "0 auto",
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: 400,
                  fontFamily: "Poppins",
                  paddingTop: "20px",
                }}
              >
                Welcome to {agent.domain}! I’m {agent.name}, your trusted
                partner in finding the perfect home. Whether you're buying,
                selling, or investing, I’m here to guide you through the process
                with personalized service and expert market knowledge. Let’s
                make your real estate journey smooth and successful. Visit my
                link below or call today to get started.
              </p>
            </Card.Body>
          </Card>

          {/* Social Section */}
          <Card
            className="mb-4 shadow-sm position-relative overflow-visible"
            style={{ backgroundColor: "rgba(250, 250, 250, 0.8)" }}
          >
            <Card.Body style={{ boxShadow: "4px 4px 10px rgba(0,0,0,0.5)" }}>
              <div className="d-flex flex-column align-items-center gap-2">
                <Button style={buttonStyle}>
                  <span style={iconContainerStyle}>
                    <FaInstagram
                      style={{ color: "#E4405F", fontSize: "18px" }}
                    />
                  </span>
                  Follow @{agent.domain}
                </Button>

                <Button style={buttonStyle}>
                  <span style={iconContainerStyle}>
                    <FaFacebook
                      style={{ color: "#1877F2", fontSize: "18px" }}
                    />
                  </span>
                  Follow @{agent.domain}
                </Button>

                <Button style={buttonStyle}>
                  <span style={iconContainerStyle}>
                    <FaYoutube style={{ color: "#FF0000", fontSize: "18px" }} />
                  </span>
                  Subscribe @{agent.domain}
                </Button>

                <Button style={buttonStyle}>
                  <span style={iconContainerStyle}>
                    <FaTiktok style={{ color: "#000000", fontSize: "18px" }} />
                  </span>
                  Follow @{agent.domain}
                </Button>

                <Button style={buttonStyle}>
                  <span style={iconContainerStyle}>
                    <FaLinkedin
                      style={{ color: "#0A66C2", fontSize: "18px" }}
                    />
                  </span>
                  Follow @{agent.domain}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default BusinessCard;
