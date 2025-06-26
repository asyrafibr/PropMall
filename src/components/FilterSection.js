import React, { useEffect, useState } from "react";
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

  const [activeTab, setActiveTab] = useState("rent");
  const [showModal, setShowModal] = useState(false);
  const [locationTree, setLocationTree] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);
  const [selectedAreaNames, setSelectedAreaNames] = useState([]);
  const { isLoggedIn } = useAuth();
  const [agent, setAgent] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedAreaObjects, setSelectedAreaObjects] = useState([]);
  const [loadingLocationData, setLoadingLocationData] = useState(false);

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
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };
    fetchAgentData();
  }, []);

  const handleCountryClick = async (country) => {
    try {
      setLoadingLocationData(true);
      setSelectedCountry(country);
      const res = await axios.post("https://dev-agentv3.propmall.net/graph/param/location", {
        domain: "myhartanah.co",
        url_fe: window.location.href,
        id_country: country.id_country,
      });
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
    setSelectedLocation(`${countryName} ${stateName} ${areaNames}`);
    setShowModal(false);
    setNavigationStack([]);
    setLocationTree([]);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(
        "https://dev-agentv3.propmall.net/graph/me/listing/search",
        {
          domain: "myhartanah.co",
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
            Discover 20,000+ Dream Properties at HomesMatchKL.co
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

            <div className="row mt-4">
              <div className="col-12 d-flex flex-column flex-md-row gap-3">
                {[
                  "All Categories",
                  "All Holding Types",
                  "Price Ranges (RM)",
                  "Bedroom(s)",
                  "Bathroom(s)",
                ].map((label) => (
                  <button
                    key={label}
                    className="btn btn-link text-white p-0 d-flex align-items-center"
                    style={{
                      justifyContent: "space-between",
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      fontSize: "16px",
                      fontFamily: "Poppins",
                    }}
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
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <div
              style={{
                backgroundColor: "black",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                fontFamily: "Poppins",
              }}
            >
              <div>
                {navigationStack.length > 1 && (
                  <button
                    onClick={handleBack}
                    className="btn btn-sm"
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "white",
                    }}
                  >
                    ←
                  </button>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h6 style={{ margin: 0, textAlign: "left", fontWeight: "600" }}>
                  {`Select ${
                    currentLevel?.node_level === 1
                      ? "Country"
                      : currentLevel?.node_level === 2
                      ? "State"
                      : "Area"
                  }`}
                </h6>
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
                        className="py-2 border-bottom d-flex justify-content-between align-items-center"
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
                        className="py-2 border-bottom d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleNodeClick(node)}
                      >
                        <span>{node.name}</span>
                        {node.node_level === 3 ? (
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedAreaIds.includes(node.id)}
                            onChange={() => handleAreaToggle(node)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span>&#x276F;</span>
                        )}
                      </div>
                    ))}
                </>
              )}
            </div>

            <div
              style={{
                borderTop: "1px solid #ddd",
                padding: "15px 20px",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn text-white px-4"
                style={{ backgroundColor: "#826044", fontFamily: "Poppins" }}
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
