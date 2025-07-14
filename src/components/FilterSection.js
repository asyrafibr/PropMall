import React, { useEffect, useState, useRef } from "react";
import headerImage from "../image/Landing_Hero.jpg";
import AgentBox from "../components/AgentBox";
import axios from "axios";
import { getAgent } from "../api/axiosApi";
import { useNavigate } from "react-router-dom"; // at top
import { FaSearch } from "react-icons/fa";
// import getSubdomain from "../utils/getSubdomain"; // if you’ve extracted it to a helper

import {
  getCategory,
  getHolding,
  getLocationTree,
  getListings,
} from "../api/axiosApi";
const Filters = ({
  selectedLocation,
  setSelectedLocation,
  searchTerm,
  setSearchTerm,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef(null); // ✅ ref to the whole dropdown group
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [roomRange, setRoomRange] = useState({ min: null, max: null });
  const [bathroomRange, setBathroomRange] = useState({ min: null, max: null });
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("rent");
  const [showModal, setShowModal] = useState(false);
  const [locationTree, setLocationTree] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);
  const [selectedAreaNames, setSelectedAreaNames] = useState([]);
  const [agent, setAgent] = useState({});
  const [domain, setDomain] = useState({});
  const [category, setCategory] = useState({});
  const [holding, setHolding] = useState({});
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [priceRangeDisplay, setPriceRangeDisplay] = useState(null);
  const [bedroomDisplay, setBedroomDisplay] = useState(null);
  const [bathroomDisplay, setBathroomDisplay] = useState(null);
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
    const fetchData = async () => {
      try {
        const categoryList = await getCategory();

        setCategory(categoryList.data.property_category);

        const holdingList = await getHolding();
        setHolding(holdingList.data.property_holding_and_type);

        // ❌ agent is NOT updated here yet
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (category) {
      console.log("Category", category);
    }
    if (holding) {
      console.log("Holding", holding);
    }
  }, [category, holding]);
  useEffect(() => {
    console.log("category");
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
        setDomain(agentRes.data.domain);
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
  }, [domain]);
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

      const domain = getSubdomain(); // dynamically extracted subdomain
      const url_fe = window.location.href;

      const res = await getLocationTree({
        domain,
        url_fe,
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
    if (node.node_level === 2) {
      // Just update selectedState, don't reset checkboxes
      setSelectedState(node);
    }

    if (node.node_level === 3) {
      // This is an area node — do NOT replace the selections
      handleAreaToggle(node);
      return; // stop here — don't push to navigation stack
    }

    if (node.child_count > 0 && node.child_list?.length > 0) {
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
      // Optional check: enforce same-state selection only
      const parentStateId = area.parent_id;
      const isSameState =
        !selectedAreaObjects.length ||
        selectedAreaObjects[0].parent_id === parentStateId;

      if (isSameState) {
        setSelectedAreaIds((prev) => [...prev, area.id]);
        setSelectedAreaNames((prev) => [...prev, area.name]);
        setSelectedAreaObjects((prev) => [...prev, area]);
      } else {
        // clear previous and add new area if different state
        setSelectedAreaIds([area.id]);
        setSelectedAreaNames([area.name]);
        setSelectedAreaObjects([area]);
      }
    }
  };

  const handleApply = () => {
    const countryName = selectedCountry?.name || "";
    const stateName = selectedState?.name || "";
    const areaNames = selectedAreaNames.join(", ");
    setSelectedLocation(`${stateName}, ${areaNames}`);
    setShowModal(false);
    setNavigationStack([]);
    setLocationTree([]);
  };

  const handleSearch = async () => {
    try {
      const hostname = window.location.hostname;
      const domain = hostname.replace(/^www\./, "").split(".")[0];
      const url_fe = window.location.href;

      const payload = {
        domain,
        url_fe,
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
            property_category: selectedCategory || null,
            property_holding: selectedHolding || null,
            property_lot_type: null,
            room: {
              min: roomRange?.min || null,
              max: roomRange?.max || null,
            },
            bathroom: {
              min: bathroomRange?.min || null,
              max: bathroomRange?.max || null,
            },
            price: {
              min: priceRange?.min || null,
              max: priceRange?.max || null,
            },
          },
        },
      };

      const response = await getListings(payload);

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
    "All Categories": category, // array from props/state
    "All Holding Types": holding, // array from props/state
    "Price Ranges (RM)": [], // now triggers modal
    "Bedroom(s)": ["Custom Range..."],
    "Bathroom(s)": ["Custom Range..."],
  };

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };
  const handleClear = () => {
    setSelectedAreaIds([]);
  };
  console.log("select category", selectedCategory);
  console.log("select holding", selectedHolding);

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
              {["Buy", "Rent", "New Project", "Auction"].map((tab) => (
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
                  {tab}
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
                    padding: "0 16px", // add some padding
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "20px",
                      fontWeight: 400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flex: 1,
                    }}
                  >
                    {selectedLocation || "All States"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      marginLeft: "8px",
                      flexShrink: 0,
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
              <div className="col-12 col-md-9">
                <div className="d-flex flex-column flex-md-row gap-3">
                  <div className="position-relative flex-grow-1">
                    <FaSearch
                      style={{
                        position: "absolute",
                        left: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "20px",
                        color: "#999",
                      }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        height: "60px",
                        paddingLeft: "48px", // room for the icon
                        fontFamily: "Poppins",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "normal",
                      }}
                    />
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                    style={{
                      backgroundColor: "#F4980E",
                      borderRadius: "8px",
                      height: "60px",
                      minWidth: "160px",
                      fontFamily: "Poppins",
                      borderWidth: 0,
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
                      onClick={() => toggleDropdown(label)}
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
                    >
                      <span>
                        {label === "All Categories"
                          ? selectedCategory?.name || label
                          : label === "All Holding Types"
                          ? selectedHolding?.name || label
                          : label === "Price Ranges (RM)"
                          ? priceRangeDisplay || label
                          : label === "Bedroom(s)"
                          ? bedroomDisplay || label
                          : label === "Bathroom(s)"
                          ? bathroomDisplay || label
                          : label}
                      </span>
                      <span style={{ marginLeft: "6px", fontSize: "0.7rem" }}>
                        ▼
                      </span>
                    </button>

                    {openDropdown === label && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          width: "100%",
                          background: "white",
                          zIndex: 1000,
                          borderRadius: "8px",
                          padding: "10px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        {label === "Price Ranges (RM)" ? (
                          <>
                            <div
                              className="mb-2"
                              style={{ color: "black", fontFamily: "Poppins" }}
                            >
                              Set Price Range (RM):
                            </div>
                            <div className="d-flex gap-2">
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "Poppins",
                                    color: "black",
                                  }}
                                >
                                  Min
                                </div>
                                <input
                                  type="number"
                                  placeholder="Min"
                                  value={priceRange.min || ""}
                                  onChange={(e) => {
                                    const v = e.target.value
                                      ? +e.target.value
                                      : null;
                                    setPriceRange((r) => ({ ...r, min: v }));
                                  }}
                                  className="form-control"
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "Poppins",
                                    color: "black",
                                  }}
                                >
                                  Max
                                </div>
                                <input
                                  type="number"
                                  placeholder="Max"
                                  value={priceRange.max || ""}
                                  onChange={(e) => {
                                    const v = e.target.value
                                      ? +e.target.value
                                      : null;
                                    setPriceRange((r) => ({ ...r, max: v }));
                                  }}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="d-flex gap-2 mt-2">
                              <button
                                className="btn mt-2 ms-2"
                                onClick={() => {
                                  setPriceRange({ min: null, max: null });
                                  setPriceRangeDisplay("Price Ranges (RM)");
                                  setOpenDropdown(null);
                                }}
                                style={{
                                  backgroundColor: "#6c757d",
                                  color: "white",
                                  fontFamily: "Poppins",
                                }}
                              >
                                Clear
                              </button>
                              <button
                                className="btn mt-2"
                                onClick={() => {
                                  const display = `RM ${
                                    priceRange.min || 0
                                  } - RM ${priceRange.max || 0}`;
                                  setPriceRangeDisplay(display);
                                  setOpenDropdown(null);
                                }}
                                style={{ backgroundColor: "#F4980E" }}
                              >
                                <text
                                  style={{
                                    fontFamily: "Poppins",
                                    color: "white",
                                  }}
                                >
                                  Apply
                                </text>
                              </button>
                            </div>
                          </>
                        ) : label === "Bedroom(s)" ||
                          label === "Bathroom(s)" ? (
                          <>
                            <div
                              className="mb-2"
                              style={{ color: "black", fontFamily: "Poppins" }}
                            >
                              Enter {label.toLowerCase()} range:
                            </div>
                            <div className="d-flex gap-2">
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "Poppins",
                                    color: "black",
                                  }}
                                >
                                  Min
                                </div>
                                <input
                                  type="number"
                                  placeholder="Min"
                                  value={
                                    label === "Bedroom(s)"
                                      ? roomRange.min || ""
                                      : bathroomRange.min || ""
                                  }
                                  onChange={(e) => {
                                    const v = e.target.value
                                      ? +e.target.value
                                      : null;
                                    if (label === "Bedroom(s)") {
                                      setRoomRange((r) => ({ ...r, min: v }));
                                    } else {
                                      setBathroomRange((r) => ({
                                        ...r,
                                        min: v,
                                      }));
                                    }
                                  }}
                                  className="form-control"
                                />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "Poppins",
                                    color: "black",
                                  }}
                                >
                                  Max
                                </div>
                                <input
                                  type="number"
                                  placeholder="Max"
                                  value={
                                    label === "Bedroom(s)"
                                      ? roomRange.max || ""
                                      : bathroomRange.max || ""
                                  }
                                  onChange={(e) => {
                                    const v = e.target.value
                                      ? +e.target.value
                                      : null;
                                    if (label === "Bedroom(s)") {
                                      setRoomRange((r) => ({ ...r, max: v }));
                                    } else {
                                      setBathroomRange((r) => ({
                                        ...r,
                                        max: v,
                                      }));
                                    }
                                  }}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="d-flex gap-2 mt-2">
                              <button
                                className="btn mt-2 ms-2"
                                onClick={() => {
                                  if (label === "Bedroom(s)") {
                                    setRoomRange({ min: null, max: null });
                                    setBedroomDisplay("Bedroom(s)");
                                  } else {
                                    setBathroomRange({ min: null, max: null });
                                    setBathroomDisplay("Bathroom(s)");
                                  }
                                  setOpenDropdown(null);
                                }}
                                style={{
                                  backgroundColor: "#6c757d",
                                  color: "white",
                                  fontFamily: "Poppins",
                                }}
                              >
                                Clear
                              </button>
                              <button
                                className="btn mt-2"
                                onClick={() => {
                                  if (label === "Bedroom(s)") {
                                    const display = `${roomRange.min || 0} - ${
                                      roomRange.max || 0
                                    } Bedroom(s)`;
                                    setBedroomDisplay(display);
                                  } else {
                                    const display = `${
                                      bathroomRange.min || 0
                                    } - ${bathroomRange.max || 0} Bathroom(s)`;
                                    setBathroomDisplay(display);
                                  }
                                  setOpenDropdown(null);
                                }}
                                style={{ backgroundColor: "#F4980E" }}
                              >
                                <text
                                  style={{
                                    fontFamily: "Poppins",
                                    color: "white",
                                  }}
                                >
                                  Apply
                                </text>{" "}
                              </button>
                            </div>
                          </>
                        ) : (
                          <ul
                            style={{ listStyle: "none", padding: 0, margin: 0 }}
                          >
                            {options.map((item, i) => (
                              <li
                                key={i}
                                style={{ cursor: "pointer", padding: "6px 0" }}
                                onClick={() => {
                                  if (label === "All Categories") {
                                    setSelectedCategory({
                                      id: item.id,
                                      name: item.desc,
                                    });
                                    setOpenDropdown(null);
                                  }
                                }}
                              >
                                <label
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: "16px",
                                      fontStyle: "normal",
                                      fontWeight: 400,
                                      lineHeight: "normal",
                                      color: "black",
                                    }}
                                  >
                                    {item.desc}
                                  </span>

                                  {label === "All Holding Types" && (
                                    <input
                                      type="checkbox"
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        setSelectedHolding({
                                          id: item.id,
                                          name: item.desc,
                                        });
                                        setOpenDropdown(null);
                                      }}
                                      checked={selectedHolding?.id === item.id}
                                    />
                                  )}
                                </label>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
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
                      color: "black",
                      marginRight: "10px",
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
                  {navigationStack.length > 0 && (
                    <>
                      {/* ✅ Select All Checkbox (only for area list) */}
                      {currentLevel?.node_level === 2 && (
                        <div
                          className="py-2 d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const allAreaIds = displayList.map(
                              (area) => area.id
                            );
                            const allAreaObjects = displayList;

                            const isAllSelected = allAreaIds.every((id) =>
                              selectedAreaIds.includes(id)
                            );

                            if (isAllSelected) {
                              setSelectedAreaIds([]);
                              setSelectedAreaNames([]);
                              setSelectedAreaObjects([]);
                            } else {
                              setSelectedAreaIds(allAreaIds);
                              setSelectedAreaNames(
                                allAreaObjects.map((a) => a.name)
                              );
                              setSelectedAreaObjects(allAreaObjects);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input"
                            style={{ marginRight: "2%" }}
                            checked={
                              displayList.length > 0 &&
                              displayList.every((area) =>
                                selectedAreaIds.includes(area.id)
                              )
                            }
                            readOnly
                          />
                          <span>Select All</span>
                        </div>
                      )}

                      {/* ✅ Area & Node Listing */}
                      {displayList.map((node) => (
                        <div
                          key={node.id}
                          className="py-2 d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleNodeClick(node)}
                        >
                          {node.node_level === 3 ? (
                            <>
                              <input
                                type={"checkbox"}
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
                              className="py-2 d-flex align-items-center justify-content-between w-100"
                              style={{ cursor: "pointer" }}
                            >
                              <span>{node.name}</span>
                              <span>&#x276F;</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
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
      {priceModalOpen && (
        <div className="modal-overlay" onClick={() => setPriceModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h5>Select Price Range (RM)</h5>
            <div className="d-flex gap-2 my-3">
              <input
                type="number"
                placeholder="Min"
                className="form-control"
                value={priceRange.min || ""}
                onChange={(e) =>
                  setPriceRange((p) => ({
                    ...p,
                    min: e.target.value ? +e.target.value : null,
                  }))
                }
              />
              <input
                type="number"
                placeholder="Max"
                className="form-control"
                value={priceRange.max || ""}
                onChange={(e) =>
                  setPriceRange((p) => ({
                    ...p,
                    max: e.target.value ? +e.target.value : null,
                  }))
                }
              />
            </div>
            {/* Slider can be added here */}
            <button
              className="btn btn-primary"
              onClick={() => {
                setPriceModalOpen(false);
                setOpenDropdown(null);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
