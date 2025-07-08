import React, { useEffect, useState, useRef } from "react";
import headerImage from "../image/Landing_Hero.jpg";
import AgentBox from "../components/AgentBox";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getAgent } from "../api/axiosApi";
import { useNavigate } from "react-router-dom"; // at top

const Filters = ({
  selectedLocation,
  setSelectedLocation,
  searchTerm,
  setSearchTerm,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef(null); // ✅ ref to the whole dropdown group

  const [activeTab, setActiveTab] = useState("rent");
  const [showModal, setShowModal] = useState(false);
  const [locationTree, setLocationTree] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);
  const [selectedAreaNames, setSelectedAreaNames] = useState([]);
  const { isLoggedIn } = useAuth();
  const [agent, setAgent] = useState({});
    const [domain, setDomain] = useState({});

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedAreaObjects, setSelectedAreaObjects] = useState([]);
  const [loadingLocationData, setLoadingLocationData] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [showModal]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `body.modal-open { overflow: hidden !important; height: 100vh; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const agentRes = await getAgent();
        setAgent(agentRes.data.domain.config);
        setDomain(agentRes.data.domain)
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };
    fetchAgentData();
  }, []);
  useEffect(() => {
   
    if (domain) {
      console.log("domain", domain);
    }
  }, [ domain]);
  const getSubdomain = () => {
  const hostname = window.location.hostname; // e.g., "prohartanah.myhartanah.co"
  const parts = hostname.split(".");
  
  // Handle localhost (e.g., "localhost" or "localhost:3000")
  if (hostname.includes("localhost")) return "localhost";

  // e.g. ["prohartanah", "myhartanah", "co"]
  if (parts.length > 2) return parts[0]; // "prohartanah"
  return null; // fallback if no subdomain
};

  const handleCountryClick = async (country) => {
    try {
      setLoadingLocationData(true);
      setSelectedCountry(country);
          const domain = getSubdomain(); // dynamic domain

      const res = await axios.post(
        "https://dev-agentv3.propmall.net/graph/param/location",
        {
          domain: domain,
          url_fe: window.location.href,
          id_country: country.id_country,
        }
      );
      if (res.data?.country) {
        setLocationTree([res.data.country]);
        setNavigationStack([res.data.country]);
      }
    } catch (err) {
      console.error("Error fetching states/areas:", err);
    } finally {
      setLoadingLocationData(false);
    }
  };

  const handleNodeClick = (node) => {
    if (node.node_level === 2) setSelectedState(node);
    if (node.node_level === 3) {
      handleAreaToggle(node);
    } else if (node.child_count > 0 && node.child_list?.length > 0) {
      setNavigationStack((prev) => [...prev, node]);
    }
  };

  const handleBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack((prev) => prev.slice(0, -1));
    }
  };

  const handleAreaToggle = (area) => {
    const isSelected = selectedAreaIds.includes(area.id);
    if (isSelected) {
      setSelectedAreaIds((prev) => prev.filter((id) => id !== area.id));
      setSelectedAreaNames((prev) => prev.filter((name) => name !== area.name));
      setSelectedAreaObjects((prev) =>
        prev.filter((obj) => obj.id !== area.id)
      );
    } else {
      setSelectedAreaIds((prev) => [...prev, area.id]);
      setSelectedAreaNames((prev) => [...prev, area.name]);
      setSelectedAreaObjects((prev) => [...prev, area]);
    }
  };

  const handleApply = () => {
    const countryName = selectedCountry?.name || "";
    const stateName = selectedState?.name || "";
    const areaNames = selectedAreaNames.join(", ");
    setSelectedLocation(`${countryName}, ${stateName}, ${areaNames}`);
    setShowModal(false);
    setNavigationStack([]);
    setLocationTree([]);
  };

  const handleSearch = async () => {
    try {
    const hostname = window.location.hostname; // e.g., "prohartanah.my"
    const domain = hostname.replace(/^www\./, "").split(".")[0]; // e.g., "prohartanah"
      const response = await axios.post(
        "https://dev-agentv3.propmall.net/graph/me/listing/search",
        {
          domain: domain,
          url_fe: window.location.href,
          listing_search: {
            page_num: 1,
            page_size: 10,
            search_text: searchTerm || null,
            search_fields: {
              title: true,
              description: true,
            },
            search_filters: {
              objective: {
                sale: true,
                rent: true,
                project: true,
                auction: true,
              },
              location: {
                id_country: selectedCountry?.id_country || null,
                id_state: selectedState?.id || null,
                id_area: selectedAreaIds.length ? selectedAreaIds : [],
                id_province: [],
                id_cities: [],
              },
              property_category: null,
              property_holding: null,
              property_lot_type: null,
              room: { min: null, max: null },
              bathroom: { min: null, max: null },
              price: { min: null, max: null },
            },
          },
        }
      );

      // Navigate to /search with state
      navigate("/search", {
        state: {
          products: response.data.listing_search.listing_rows,
          selectedLocationName: selectedState?.name,
          selectedLocationId: selectedState?.id,
          searchType: activeTab,
        },
      });
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };
  const currentLevel = navigationStack[navigationStack.length - 1];
  const displayList = currentLevel?.child_list || [];
  const filters = {
    "All Categories": [
      "Apartmen/Condo (Highrise)",
      "House/Bungalow (Landed)",
      "Commercial/Office/Industry/Building",
      "Land",
      "Hotel/Resort/Homestay",
    ],
    "All Holding Types": [
      "Freehold",
      "Leasehold",
      "Non-Bumi",
      "Bumi",
      "Malay Reserve",
      "Customary Land",
      "Freehold & Non-Bumi",
      "Freehold & Bumi",
      "Freehold & Malay Reserve",
      "Freehold & Customary Land",
      "Leasehold & Non-Bumi",
      "Leasehold & Bumi",
      "Leasehold & Malay Reserve",
      "Leasehold & Customary Land",
    ],
    "Price Ranges (RM)": [
      "Any",
      "Up to RM 250k",
      "Above RM 250k to RM 500k",
      "Above RM 500k to RM 750k",
      "Above RM 750k to RM 1m",
      "Above RM 1m to RM 2.5m",
      "Above RM 2.5m to RM 5m",
      "Above RM 5m to RM 7.5m",
      "Above RM 7.5m to RM 10m",
      "Above RM 10m",
    ],
    "Bedroom(s)": ["Any", "1-3", "4-6", "7-10", ">10"],
    "Bathroom(s)": ["Any", "1-3", "4-6", "7-10", ">10"],
  };


  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };
  const handleClear = () => {
    setSelectedAreaIds([]);
  };
  return (
    <div>
      <div className="order-1 order-md-2 w-100 w-md-auto">
        <AgentBox />
      </div>

      <div
        className="hero-section d-flex flex-column flex-md-row align-items-start justify-content-center flex-wrap"
        style={{
          position: "relative",
          width: "100%",
          minHeight: "541px",
          backgroundImage: `url(${headerImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          color: "white",
        }}
      >
        <div
          className="container-fluid order-2 order-md-1"
          style={{
            position: "relative",
            zIndex: 2,
            flex: 1,
            paddingTop: "100px",
            paddingLeft: "100px",
            paddingRight: "100px",
          }}
        >
          <h4
            className="text-white fw-bold text-end mb-4"
            style={{ fontSize: "34px", fontFamily: "Poppins", fontWeight: 600 }}
          >
            Discover Dream Properties at {domain.name}
          </h4>

          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <div className="d-flex">
              {["rent", "sell"].map((tab) => (
                <button
                  key={tab}
                  className="btn text-white me-3"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: "transparent",
                    fontSize: "16px",
                    fontFamily: "Poppins",
                    borderBottom:
                      activeTab === tab
                        ? "3px solid #F4980E"
                        : "3px solid transparent",
                    borderRadius: 0,
                  }}
                >
                  For {tab === "rent" ? "Rent" : "Sale"}
                </button>
              ))}
            </div>

            <div
              style={{
                borderBottom: "2px solid #3A3A3A",
                marginBottom: "15px",
              }}
            ></div>

            <div className="row g-3">
              <div className="col-12 col-md-3">
                <div
                  className="form-control d-flex align-items-center justify-content-between"
                  onClick={() => setShowModal(true)}
                  style={{
                    height: "60px",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    fontFamily: "Poppins",
                  }}
                >
                  <span>{selectedLocation || "Select Location"}</span>
                  <span style={{ fontSize: "0.8rem" }}>▼</span>
                </div>
              </div>
              <div className="col-12 col-md-9">
                <div className="d-flex flex-column flex-md-row gap-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ height: "60px" }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                    style={{
                      backgroundColor: "#F4980E",
                      borderRadius: "8px",
                      height: "60px",
                      minWidth: "160px",
                      fontFamily: "Poppins",
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="row mt-4" ref={containerRef}>
              <div className="col-12 d-flex flex-column flex-md-row gap-3">
                {Object.entries(filters).map(([label, options]) => (
                  <div
                    key={label}
                    style={{ position: "relative", width: "100%" }}
                  >
                    <button
                      className="btn p-0 d-flex align-items-center"
                      style={{
                        justifyContent: "space-between",
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        fontSize: "16px",
                        fontFamily: "Poppins",
                        color: "white",
                        textDecoration: "none",
                      }}
                      onClick={() => toggleDropdown(label)}
                    >
                      <span style={{ flexGrow: 1, textAlign: "left" }}>
                        {label}
                      </span>
                      <span
                        style={{
                          marginLeft: "6px",
                          fontSize: "0.7rem",
                          flexShrink: 0,
                        }}
                      >
                        ▼
                      </span>
                    </button>

                    {openDropdown === label && (
                      <ul
                        style={{
                          listStyle: "none",
                          margin: 0,
                          padding: "10px",
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          width: "100%",
                          background: "white",
                          color: "#333",
                          borderRadius: "8px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                          zIndex: 1000,
                          maxHeight: "300px",
                          overflowY: "auto",
                        }}
                      >
                        {options.map((item, index) => (
                          <li
                            key={index}
                            style={{
                              padding: "6px 10px",
                              cursor: "pointer",
                              fontFamily: "Poppins",
                              fontSize: "14px",
                            }}
                            onClick={() => {
                              console.log(`Selected: ${item}`);
                              setOpenDropdown(null);
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#f1f1f1")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "750px",
              height: "500px",
              backgroundColor: "white",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <div
              style={{
                backgroundColor: "transparent",
                color: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                fontFamily: "Poppins",
                // borderRadius:"16px"
              }}
            >
              <div>
                {navigationStack.length > 1 && (
                  <button
                    onClick={handleBack}
                    className="btn p-0 d-flex justify-content-center align-items-center"
                    style={{
                      width: "16px",
                      height: "16px",
                      fontSize: "14px",
                      lineHeight: "1",
                      border: "none",
                      background: "transparent",
                      color: "black", marginRight:'10px'
                    }}
                  >
                    &lt;
                  </button>
                )}
              </div>
             <div style={{ flex: 1 }}>
  <h6
    style={{
      margin: 0,
      textAlign: "left",
      fontWeight: "600",
      fontSize: "16px",
      fontFamily: "Poppins",
    }}
  >
    {currentLevel?.node_level === 0
      ? "Select Country"
      : currentLevel?.node_level === 1
      ? "Search by State"
      : currentLevel?.node_level === 2
      ? "Select City/Area"
      : ""}
  </h6>

  {currentLevel?.node_level === 1 && navigationStack[0] && (
    <p
      style={{
        margin: 0,
        fontSize: "14px",
        color: "#555",
        fontFamily: "Poppins",
      }}
    >
      {navigationStack[0].name}
    </p>
  )}

  {currentLevel?.node_level === 2 && navigationStack[1] && (
    <p
      style={{
        margin: 0,
        fontSize: "14px",
        color: "#555",
        fontFamily: "Poppins",
      }}
    >
       {navigationStack[1].name}
    </p>
  )}
</div>

              <div>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-sm"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "white",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {loadingLocationData ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100%" }}
                >
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {navigationStack.length === 0 &&
                    agent?.listing_country?.map((country) => (
                      <div
                        key={country.id_country}
                        className="py-2 d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleCountryClick(country)}
                      >
                        <span>{country.name}</span>
                        <span>&#x276F;</span>
                      </div>
                    ))}
                  {navigationStack.length > 0 &&
                    displayList.map((node) => (
                      <div
                        key={node.id}
                        className="py-2 d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleNodeClick(node)}
                      >
                        {node.node_level === 3 ? (
                          <>
                            <input
                              type={"radio"}
                              className="form-check-input"
                              checked={selectedAreaIds.includes(node.id)}
                              onChange={() => handleAreaToggle(node)}
                              onClick={(e) => e.stopPropagation()}
                              style={{ marginRight: "2%" }}
                            />
                            <span>{node.name}</span>
                          </>
                        ) : (
                          <div
                            key={node.id}
                            className="py-2 d-flex align-items-center justify-content-between w-100"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleNodeClick(node)}
                          >
                            <span>{node.name}</span>
                            <span>&#x276F;</span>
                          </div>
                        )}
                      </div>
                    ))}
                </>
              )}
            </div>

            {currentLevel?.node_level === 2 && (
              <div
                style={{
                  // borderTop: "1px solid #ddd",
                  padding: "15px 20px",
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "space-between", // left & right alignment
                  borderRadius: "16px",
                }}
              >
                <button
                  className="btn btn-outline-secondary px-4"
                  style={{ fontFamily: "Poppins" }}
                  onClick={handleClear}
                >
                  Clear
                </button>

                <button
                  className="btn text-white px-4"
                  style={{ backgroundColor: "#F4980E", fontFamily: "Poppins" }}
                  onClick={handleApply}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
