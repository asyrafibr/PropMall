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
import "./BusinessCard.css";
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
    <div className="overflow-hidden">
      <div
        className="bg-cover bg-agent position-relative"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="position-absolute top-0 start-0 w-100 z-3">
          <BusinessHeader domain={agent.domain} />
        </div>
        <Container>
          {/* Header Card with Floating Image */}
          <Card className="mb-4 shadow-sm position-relative overflow-visible agent-card">
            <Card.Body className="agent-card-body pt-3">
              <Row className="align-items-start">
                {/* LEFT SIDE - Agent Info */}
                <Col md={4} className="position-relative">
                  {/* Floating Image */}
                  <div className="agent-photo-wrapper">
                    <img
                      src={agent.photo}
                      alt="Agent"
                      className="agent-photo rounded-circle shadow"
                    />
                  </div>

                  {/* Text Below Image */}
                  <div className="agent-info mt-6 ms-3">
                    <h5 className="mb-0">{agent.name}</h5>
                    <p className="text-muted mb-1">
                      {agent.title} {agent.reg_no}
                    </p>
                    <p className="text-muted">
                      {agent.agency_name} {agent.agency_reg_no}
                    </p>
                  </div>
                </Col>

                {/* RIGHT SIDE - Icons, Stats, Dropdown */}
                <Col md={8} className="text-end">
                  {/* Icons */}
                  <div className="d-flex justify-content-end mb-2 agent-icons">
                    <div className="icon-circle bg-danger">
                      <FaEnvelope color="white" size={24} />
                    </div>
                    <div className="icon-circle bg-warning">
                      <FaFilePdf color="white" size={24} />
                    </div>
                    <div className="icon-circle bg-info">
                      <FaShareAlt color="white" size={24} />
                    </div>
                    <div className="icon-circle whatsapp">
                      <FaWhatsapp color="white" size={24} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="d-flex flex-column align-items-end mt-3">
                    <div className="d-flex gap-2 mb-2 flex-wrap justify-content-end">
                      {/* Sale */}
                      <Card className="shadow-sm stat-card">
                        <Card.Body className="p-2 text-start d-flex align-items-center">
                          <div className="stat-icon">
                            <img src={icon1} alt="Sale" />
                          </div>
                          <div className="ms-2">
                            <small>Sale</small>
                            <p className="mb-0 fw-bold">31,803</p>
                          </div>
                        </Card.Body>
                      </Card>

                      {/* Rent */}
                      <Card className="shadow-sm stat-card">
                        <Card.Body className="p-2 text-start d-flex align-items-center">
                          <div className="stat-icon">
                            <img src={icon2} alt="Rent" />
                          </div>
                          <div className="ms-2">
                            <small>Rent</small>
                            <p className="mb-0 fw-bold">31,803</p>
                          </div>
                        </Card.Body>
                      </Card>

                      {/* New Project */}
                      <Card className="shadow-sm stat-card">
                        <Card.Body className="p-2 text-start d-flex align-items-center">
                          <div className="stat-icon">
                            <img src={icon3} alt="New Project" />
                          </div>
                          <div className="ms-2">
                            <small className="fw-normal small">
                              New Project
                            </small>
                            <p className="mb-0 fw-bold">803</p>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    {/* Total Listings */}
                    <Card className="shadow-sm stat-card total-card">
                      <Card.Body className="p-2 text-start d-flex align-items-center">
                        <div className="stat-icon">
                          <img src={icon4} alt="Total Listings" />
                        </div>
                        <div className="ms-2">
                          <small>Total Listings</small>
                          <p className="mb-0 fw-bold">95,409</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>

                  {/* Dropdown */}
                  <div className="d-flex justify-content-end align-items-center mt-2 gap-2 flex-wrap">
                    <div className="text-end flex-grow-1">
                      Let us assist you with your property needs.
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        className="shadow-sm"
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
          <Card className="mb-4 shadow-sm position-relative overflow-visible custom-card">
            <Card.Body className="custom-card-body">
              <div className="mb-3 text-center pt-4">
                <video className="custom-video" controls>
                  <source
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>

              <p className="custom-intro-text text-center">
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
          <Card className="mb-4 shadow-sm position-relative overflow-visible bg-light bg-opacity-75">
            <Card.Body className="custom-card-body">
              <div className="d-flex flex-column align-items-center gap-2">
                <Button className="social-btn">
                  <span className="icon-container text-instagram">
                    <FaInstagram />
                  </span>
                  Follow @{agent.domain}
                </Button>

                <Button className="social-btn">
                  <span className="icon-container text-facebook">
                    <FaFacebook />
                  </span>
                  Follow @{agent.domain}
                </Button>

                <Button className="social-btn">
                  <span className="icon-container text-youtube">
                    <FaYoutube />
                  </span>
                  Subscribe @{agent.domain}
                </Button>

                <Button className="social-btn">
                  <span className="icon-container text-tiktok">
                    <FaTiktok />
                  </span>
                  Follow @{agent.domain}
                </Button>

                <Button className="social-btn">
                  <span className="icon-container text-linkedin">
                    <FaLinkedin />
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
