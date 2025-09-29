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
    FaGlobe,

} from "react-icons/fa";
import "./BusinessCard.css";
import profileImage from "../image/Profile.jpg";
import BackgroundImage from "../image/Landing_Hero.jpg";
import BackgroundImage2 from "../image/template2bg.png";
import BackgroundImage3 from "../image/bg3.png";
import BackgroundImage4 from "../image/bg4.jpg";
import { Link } from "react-router-dom";

import icon1 from "../image/door_open.png";
import icon2 from "../image/house.png";
import icon3 from "../image/create_new_folder.png";
import icon4 from "../image/browse.png";
import BusinessHeader from "./BusinessHeader";
import { useTemplate } from "../context/TemplateContext";
import { getAgent, getAgentCardInfo } from "../api/axiosApi";

const mockJson = {
  status: "ok",
  message: "Success",
  agent: {
    name: "Adzura bt Mohd Zamedin",
    reg_no: "REN 04287",
    title: "Real Estate Negotiator",
    phone: "60193571325",
    whatsapp: "60193571325",
    telegram: null,
    email: "kaizeniqi@gmail.com",
    domain: "MyHartanah.co",
    photo: "https://cdn.laskea.net/media/img-agent/usrimg100012.jpg?1737639801",
    agency_name: "IQI REALTY SDN. BHD.",
    agency_reg_no: "E (1) 1584",
  },
  domain: {
    name: "MyHartanah.co",
    logo: null,
    template: {
      web: "default",
      card: "default",
    },
    config: {
      default_id_country: 1,
      listing_country: [
        {
          id_country: 1,
          name: "Malaysia",
          url_flag: null,
        },
      ],
      listing_category: {
        sale: true,
        rent: true,
        project: true,
        auction: true,
      },
      i_want_to: true,
      tools: true,
    },
    pixel: {
      facebook: ["286582702013558"],
      linkedin: [],
      youtube: [],
      google_tag: ["GTM-MJCSRKN2"],
      google_analytics: ["G-20V46L3G3W", "G-5FHMDJQ3SP", "G-NYHHEV5NQM"],
      tiktok: [],
      xtwitter: [],
    },
  },
  card: {
    listing_stats: {
      sale: "3,988",
      rent: "53",
      project: "5",
      auction: "0",
      total: "4,046",
    },
    about_me:
      "I am a committed, friendly and hardworking Real Estate Agent with a passion for providing excellent service at all times. My one-stop services will definitely make you feel at ease. If you are looking to buy or invest in a property, you may contact me to assist you. Thank you.",
    youtube_id: "Mi4f0VYYNTQ",
    links: [
      {
        type: "website",
        title: "Want To Sell Your Property?",
        url: "https://jualhartanah.my/",
      },
      {
        type: "website",
        title: "MyHartanah.co",
        url: "https://MyHartanah.co",
      },
      {
        type: "facebook",
        title: "My Facebook",
        url: "https://www.facebook.com/adzura.zamedin",
      },
      {
        type: "instagram",
        title: "My Instagram",
        url: "https://www.instagram.com/adzurazamedin",
      },
      {
        type: "linkedin",
        title: "My LinkedIn",
        url: "https://www.linkedin.com/in/adzura",
      },
      {
        type: "tiktok",
        title: "My TikTok",
        url: "https://www.tiktok.com/@adzurazam",
      },
      {
        type: "whatsapp",
        title: "WhatsApp Me!",
        url: "https://wa.me/60193571325",
      },
    ],
  },
};

function BusinessCard() {
  const { template, switchTemplate } = useTemplate(); // ✅ Use Template Context
  const [listingData, setListingData] = useState(null);

  // const { template } = useTemplate();
  const [agent, setAgent] = useState({});
  const [loading, setLoading] = useState(true);

  const iconMap = {
  instagram: <FaInstagram />,
  facebook: <FaFacebook />,
  youtube: <FaYoutube />,
  tiktok: <FaTiktok />,
  linkedin: <FaLinkedin />,
  website: <FaGlobe />,
  whatsapp: <FaWhatsapp />,
};
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
    const fetchListingInfo = async () => {
      try {
        // get the hostname: e.g. "www.myhartanah.co" or "card.myhartanah.co"
        const hostname = window.location.hostname;

        // domain: remove "www." if present → e.g. "myhartanah.co" / "card.myhartanah.co"
        // const domain = hostname.replace(/^www\./, "");

        // url_fe: protocol + hostname → e.g. "https://card.myhartanah.co"
        // const url_fe = window.location.origin;

        const domain = "myhartanah.co"; // 🔹 fixed for testing
        const url_fe = "https://card.myhartanah.co"; // 🔹 fixed for testing
        console.log("domain:", domain);
        console.log("url_fe:", url_fe);

        const response = await getAgentCardInfo({ domain, url_fe });

        setListingData(response.data);
        // setListingData(mockJson);
        console.log("response123", mockJson);
      } catch (err) {
        console.error("Error fetching listing info:", err);
      }
      finally {
        setLoading(false); // ✅ done fetching
      }
    };

    fetchListingInfo();
  }, []); // ✅ runs once on mount

  useEffect(() => {
    if (agent) {
    }
  }, [agent]);
  if (loading || !agent || !listingData) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  const backgroundMap = {
    template1: BackgroundImage,
    template2: BackgroundImage2,
    template3: BackgroundImage3,
    template4: BackgroundImage4,
  };
  const goWhatsAppCard = () => {
    const vUri = `https://wa.me/${listingData.agent.whatsapp}?text=${window.location.origin}`;
    window.open(vUri, "_blank");
  };

  const goContactCard = () => {
    // Build vCard content
    const vcfContent = `
BEGIN:VCARD
VERSION:3.0
FN:${listingData.agent.name}
ORG:${listingData.agent.agency_name}
TITLE:${listingData.agent.title} (${listingData.agent.reg_no})
TEL:${listingData.agent.phone}
EMAIL:${listingData.agent.email}
END:VCARD
    `.trim();

    // Create blob
    const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8" });

    // Create temporary link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${listingData.agent.name}.vcf`; // ✅ .vcf extension

    // Append link, trigger click, remove link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup URL object
    URL.revokeObjectURL(link.href);
  };

  const goShareCard = async () => {
    try {
      await navigator.share({
        title: listingData.agent.name,
        text: `${listingData.agent.name}\r\n${listingData.agent.title} (${listingData.agent.reg_no})\r\n\r\n${listingData.agent.agency_name} (${listingData.agent.agency_reg_no})\r\n`,
        url: window.location.href,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };
  console.log('id youtube',listingData.card.youtube_id)
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
                  <div className="d-flex justify-content-center justify-content-sm-end mb-2 agent-icons">
                    {/* 📞 Call (Mobile only) */}
                    <a
                      href={`tel:+${listingData.agent.phone}`}
                      className="icon-circle bg-primary d-flex align-items-center justify-content-center d-sm-none"
                      title="Call"
                    >
                      <FaPhone color="white" size={24} />
                    </a>

                    {/* 📧 Email */}
                    <a
                      href={`mailto:${listingData.agent.email}`}
                      className="icon-circle bg-danger d-flex align-items-center justify-content-center"
                      title="Email"
                    >
                      <FaEnvelope color="white" size={24} />
                    </a>

                    {/* 📄 PDF */}
                    <button
                      onClick={goContactCard}
                      className="icon-circle bg-warning d-flex align-items-center justify-content-center border-0"
                      title="Download Contact"
                      style={{ cursor: "pointer" }}
                    >
                      <FaFilePdf color="white" size={24} />
                    </button>

                    {/* 🔗 Share */}
                    <button
                      onClick={goShareCard}
                      className="icon-circle bg-info d-flex align-items-center justify-content-center border-0"
                      title="Share"
                      style={{ cursor: "pointer" }}
                    >
                      <FaShareAlt color="white" size={24} />
                    </button>

                    {/* 💬 WhatsApp */}
                    <button
                      onClick={goWhatsAppCard}
                      className="icon-circle bg-success d-flex align-items-center justify-content-center border-0"
                      title="WhatsApp"
                      style={{ cursor: "pointer" }}
                    >
                      <FaWhatsapp color="white" size={24} />
                    </button>
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
                            <p className="mb-0 fw-bold">
                              {listingData.card.listing_stats.sale}
                            </p>
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
                            <p className="mb-0 fw-bold">
                              {listingData.card.listing_stats.rent}
                            </p>
                          </div>
                        </Card.Body>
                      </Card>
                      <Card className="shadow-sm stat-card">
                        <Card.Body className="p-2 text-start d-flex align-items-center">
                          <div className="stat-icon">
                            <img src={icon3} alt="New Project" />
                          </div>
                          <div className="ms-2">
                            <small className="fw-normal small">Auction</small>
                            <p className="mb-0 fw-bold">
                              {listingData.card.listing_stats.auction}
                            </p>
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
                            <p className="mb-0 fw-bold">
                              {listingData.card.listing_stats.project}
                            </p>
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
                          <p className="mb-0 fw-bold">
                            {listingData.card.listing_stats.total}
                          </p>
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
                        <Dropdown.Item
                          as={Link}
                          to="/i-want-to"
                          state={{ mode: "buy" }}
                        >
                          Buy
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Link}
                          to="/i-want-to-sell"
                          state={{ mode: "sale" }}
                        >
                          Sell
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Link}
                          to="/i-want-to"
                          state={{ mode: "rent" }}
                        >
                          Rent
                        </Dropdown.Item>
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
              {listingData.card.youtube_id && (
                <div className="mb-3 text-center pt-4">
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={`https://www.youtube.com/embed/${mockJson.card.youtube_id}`}
                      title="YouTube video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              <p className="custom-intro-text text-center">
                {listingData.card.about_me}
              </p>
            </Card.Body>
          </Card>

          {/* Social Section */}
          <Card className="mb-4 shadow-sm position-relative overflow-visible bg-light bg-opacity-75">
            <Card.Body className="custom-card-body">
              <div className="d-flex flex-column align-items-center gap-2">
      {listingData.card.links
        .filter((link) => link.url && iconMap[link.type])
        .map((link, idx) => {
          const isYoutube = link.type === "youtube";

          return (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`social-btn ${isYoutube ? "youtube-btn" : ""}`}
            >
              <span className={`icon-container text-${link.type}`}>
                {iconMap[link.type]}
              </span>
              {isYoutube
                ? `Subscribe ${link.title || ""}`
                : `${link.title || ""}`}
            </a>
          );
        })}
    </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default BusinessCard;
