import React, { useEffect, useState, useRef } from "react";
import headerImage from "../image/Landing_Hero.jpg";
import AgentBox from "../components/AgentBox";
import axios from "axios";
import { getAgent } from "../api/axiosApi";
import { useNavigate } from "react-router-dom"; // at top
import { FaSearch } from "react-icons/fa";
// import getSubdomain from "../utils/getSubdomain"; // if you’ve extracted it to a helper
import { createPortal } from "react-dom";
import { useTemplate } from "../context/TemplateContext"; // ✅ Import Template Context
import RangeSliderModal from "./RangeSliderModal";
import { useLocation } from "react-router-dom";

import {
  getCategory,
  getHolding,
  getLocationTree,
  getListings,
  getLot,
} from "../api/axiosApi";

const Filters = ({
  selectedLocation,
  setSelectedLocation,
  searchTerm,
  setSearchTerm,
}) => {
  const navigate = useNavigate();

  const containerRef = useRef(null); // ✅ ref to the whole dropdown group
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedHolding, setSelectedHolding] = useState([]);

  const [roomRange, setRoomRange] = useState({ min: null, max: null });
  const [bathroomRange, setBathroomRange] = useState({ min: null, max: null });
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Buy");
  const [showModal, setShowModal] = useState(false);
  const [locationTree, setLocationTree] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);
  const [selectedAreaNames, setSelectedAreaNames] = useState([]);
  // const [agent, setAgent] = useState({});
  const [domain, setDomain] = useState({});
  const [categoryData, setCategory] = useState({});
  const [holding, setHolding] = useState({});
  const [lot, setLot] = useState({});
  const { agent, category } = useTemplate();
  const [displayList, setDisplayList] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);

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
        const lotList = await getLot();
        setHolding([
          ...(holdingList.data.property_holding || []),
          ...(lotList.data?.property_lot_type || []), // Adjust key based on lotList structure
        ]);
        console.log("lot", lotList);
        console.log("holdingList", holdingList);

        // ❌ agent is NOT updated here yet
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };

    fetchData();
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

  const getSubdomain = () => {
    const hostname = window.location.hostname; // e.g., "prohartanah.myhartanah.co"
    const parts = hostname.split(".");

    // Handle localhost (e.g., "localhost" or "localhost:3000")
    if (hostname.includes("localhost")) return "localhost";

    // e.g. ["prohartanah", "myhartanah", "co"]
    if (parts.length > 2) return parts[0]; // "prohartanah"
    return null; // fallback if no subdomain
  };

  // const handleCountryClick = async (country) => {
  //   try {
  //     setLoadingLocationData(true);
  //     setSelectedCountry(country);

  //     const domain = getSubdomain(); // dynamically extracted subdomain
  //     const url_fe = window.location.href;

  //     const res = await getLocationTree({
  //       domain,
  //       url_fe,
  //       id_country: country.id_country,
  //     });

  //     if (res.data?.country) {
  //       setLocationTree([res.data.country]);
  //       setNavigationStack([res.data.country]);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching states/areas:", err);
  //   } finally {
  //     setLoadingLocationData(false);
  //   }
  // };
  // Reusable Modal
  const BUY_AMOUNTS = [
    0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
    1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 2000000, 2500000,
    3000000, 4000000, 5000000, 10000000, 20000000, 30000000, 40000000, 50000000,
    100000000, 200000000, 300000000, 400000000, 500000000, 1000000000,
  ];

  const RENT_AMOUNTS = [
    0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300,
    1400, 1500, 2000, 2500, 3000, 4000, 5000, 10000, 20000, 30000, 40000, 50000,
    100000, 200000, 300000, 400000, 500000, 1000000,
  ];

  const ROOM_COUNTS = Array.from({ length: 21 }, (_, i) => i); // 0..20

  // === Helpers ===
  const nearestIndex = (arr, n) => {
    if (n == null || Number.isNaN(n)) return 0;
    let best = 0,
      diff = Infinity;
    for (let i = 0; i < arr.length; i++) {
      const d = Math.abs(arr[i] - n);
      if (d < diff) {
        best = i;
        diff = d;
      }
    }
    return best;
  };

  const formatRM = (n) => (n == null ? "" : n.toLocaleString("en-MY"));

  // === Reusable Modal (same-file), with optional Portal ===
  function Modal({
    title,
    isOpen,
    onClose,
    children,
    width = 750,
    height = 360,
    usePortal = true,
  }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    React.useEffect(() => {
      if (!isOpen) return;
      const onKey = (e) => e.key === "Escape" && onClose?.();
      window.addEventListener("keydown", onKey);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = prevOverflow;
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const node = (
      <div
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : "Modal"}
        // ✅ Only close if the click is on the overlay itself
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
      >
        <div
          className="modal-box"
          style={{
            width,
            maxWidth: "95vw",
            height,
            maxHeight: "85vh",
            borderRadius: 8,
            backgroundColor: "white",
            padding: 20,
          }}
          // ✅ Prevent events inside the box from bubbling to the overlay
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {title ? (
            <h5 className="mb-3" style={{ fontFamily: "Poppins" }}>
              {title}
            </h5>
          ) : null}
          {children}
        </div>
      </div>
    );

    if (usePortal && mounted && typeof document !== "undefined") {
      const { createPortal } = require("react-dom");
      return createPortal(node, document.body);
    }
    return node;
  }
  // --- Node Click ---
  // --- Node Click ---
  const handleNodeClick = (node) => {
    // If node has a child_list and that child_list has its own child_list
    if (node.child_list && node.child_list.length > 0) {
      // If you want to skip directly to grandchild_list:
      const grandChildList = node.child_list[0]?.child_list || null;

      if (grandChildList && grandChildList.length > 0) {
        setDisplayList(grandChildList);
        setNavigationStack((prev) => [
          ...prev,
          {
            node_level: (node.node_level || 0) + 2,
            name: node.name,
            child_list: grandChildList,
          },
        ]);
        setCurrentLevel((prev) =>
          typeof prev === "object" ? (prev.node_level || 0) + 2 : prev + 2
        );
        return;
      }

      // Otherwise just go to normal child_list
      setDisplayList(node.child_list);
      setNavigationStack((prev) => [
        ...prev,
        {
          node_level: (node.node_level || 0) + 1,
          name: node.name,
          child_list: node.child_list,
        },
      ]);
      setCurrentLevel((prev) =>
        typeof prev === "object" ? (prev.node_level || 0) + 1 : prev + 1
      );
    }
  };

  // --- Area Toggle ---
  const handleAreaToggle = (area) => {
    const isSelected = selectedAreaIds.includes(area.id);

    if (isSelected) {
      setSelectedAreaIds((prev) => prev.filter((id) => id !== area.id));
      setSelectedAreaNames((prev) => prev.filter((name) => name !== area.name));
      setSelectedAreaObjects((prev) =>
        prev.filter((obj) => obj.id !== area.id)
      );
    } else {
      const parentStateId = area.parent_id;
      const isSameState =
        !selectedAreaObjects.length ||
        selectedAreaObjects[0].parent_id === parentStateId;

      if (isSameState) {
        setSelectedAreaIds((prev) => [...prev, area.id]);
        setSelectedAreaNames((prev) => [...prev, area.name]);
        setSelectedAreaObjects((prev) => [...prev, area]);
      } else {
        setSelectedAreaIds([area.id]);
        setSelectedAreaNames([area.name]);
        setSelectedAreaObjects([area]);
      }
    }
  };

  // --- Back Navigation ---
  const handleBack = () => {
    setNavigationStack((prev) => {
      if (prev.length <= 1) return prev;

      const newStack = prev.slice(0, -1);
      const lastNode = newStack[newStack.length - 1];

      // Restore previous level's children
      setDisplayList(lastNode.child_list || []);
      setCurrentLevel(lastNode);

      return newStack;
    });
  };

  // --- Initial Load of Countries ---
  useEffect(() => {
    if (showModal) {
      // Example: fetch countries list here
      fetchRootCountries();
    }
  }, [showModal]);

  const fetchRootCountries = async () => {
    try {
      setLoadingLocationData(true);

      const domain = getSubdomain();
      const url_fe = window.location.href;

      const res = await getLocationTree({ domain, url_fe, id_country: 1 });
      if (res.data?.country) {
        const countries = Array.isArray(res.data.country.child_list)
          ? res.data.country.child_list
          : [];

        setDisplayList(countries);

        setNavigationStack([
          { node_level: 0, name: "Countries", child_list: countries },
        ]);

        setCurrentLevel({ node_level: 0 });
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    } finally {
      setLoadingLocationData(false);
    }
  };

  const handleApply = () => {
    const countryName = selectedCountry?.name || "";
    const stateName = selectedState?.name || "";
    const areaNames = selectedAreaNames.join(", ");
    setSelectedLocation(`${areaNames}`);
    setShowModal(false);
    setNavigationStack([]);
    setLocationTree([]);
  };

  const handleSearch = async () => {
    try {
      const hostname = window.location.hostname;
      const domain = hostname.replace(/^www\./, "").split(".")[0];
      const url_fe = window.location.href;
      console.log("selectedHolding", selectedHolding);
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
            objective: objectiveMap[activeTab] || {},

            location: {
              id_country: selectedCountry?.id_country || null,
              id_state: selectedState?.id || null,
              id_area: selectedAreaIds.length ? selectedAreaIds : [],
              id_province: [],
              id_cities: [],
            },
            property_category: selectedCategory.id || [],
            property_holding: selectedHolding.map((h) => h.id) || [],
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
      console.log("Payload", payload);
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
  const objectiveMap = {
    Buy: { sale: true },
    Rent: { rent: true },
    "New Project": { project: true },
    Auction: { auction: true },
  };
  const tabMap = [
    { label: "Buy", key: "sale" },
    { label: "Rent", key: "rent" },
    { label: "New Project", key: "project" },
    { label: "Auction", key: "auction" },
  ];
  // const currentLevel = navigationStack[navigationStack.length - 1];
  // const displayList = currentLevel?.child_list || [];
  const filters = {
    "All Categories": categoryData, // array from props/state
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
  // console.log("Payload", selectedHolding.id);

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
              {tabMap
                .filter(({ key }) => category[key]) // only include true items
                .map(({ label }) => (
                  <button
                    key={label}
                    className="btn text-white me-3"
                    onClick={() => setActiveTab(label)}
                    style={{
                      background: "transparent",
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      borderBottom:
                        activeTab === label
                          ? "3px solid #F4980E"
                          : "3px solid transparent",
                      borderRadius: 0,
                    }}
                  >
                    {label}
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
                  onClick={() => {
                    console.log("click");
                    setShowModal(true);
                  }}
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

                    {/* --- Keep dropdown ONLY for All Categories / All Holding Types --- */}
                    {openDropdown === label &&
                      (label === "All Categories" ||
                        label === "All Holding Types") && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            width: "100%",
                            // width: "750px",
                            // height: "500px",
                            background: "white",
                            zIndex: 1000,
                            borderRadius: "8px",
                            padding: "10px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                          }}
                        >
                          <ul
                            style={{ listStyle: "none", padding: 0, margin: 0 }}
                          >
                            {(options && Array.isArray(options) ? options : [])
                              .length === 0 ? (
                              <li
                                style={{
                                  padding: "6px 0",
                                  color: "gray",
                                  fontFamily: "Poppins",
                                }}
                              >
                                No options available.
                              </li>
                            ) : (
                              (options || []).map((item, i) => (
                                <li
                                  key={i}
                                  style={{
                                    cursor: "pointer",
                                    padding: "6px 0",
                                  }}
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
                                        fontSize: 16,
                                        fontStyle: "normal",
                                        fontWeight: 400,
                                        lineHeight: "normal",
                                        color: "black",
                                      }}
                                    >
                                      {item.desc}
                                    </span>

                                    {label === "All Holding Types" && (
                                      <label
                                        style={{
                                          position: "relative",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          onChange={(e) => {
                                            e.stopPropagation();
                                            setSelectedHolding((prev) => {
                                              const isChecked =
                                                e.target.checked;
                                              if (isChecked) {
                                                return [
                                                  ...prev,
                                                  {
                                                    id: item.id,
                                                    name: item.desc,
                                                  },
                                                ];
                                              } else {
                                                return prev.filter(
                                                  (holding) =>
                                                    holding.id !== item.id
                                                );
                                              }
                                            });
                                          }}
                                          checked={selectedHolding.some(
                                            (holding) => holding.id === item.id
                                          )}
                                          style={{ display: "none" }} // hide native checkbox
                                        />
                                        <span
                                          style={{
                                            width: "18px",
                                            height: "18px",
                                            border: "2px solid #F4980E",
                                            borderRadius: "3px",
                                            display: "inline-block",
                                            backgroundColor:
                                              selectedHolding.some(
                                                (holding) =>
                                                  holding.id === item.id
                                              )
                                                ? "#F4980E"
                                                : "#fff",
                                            position: "relative",
                                            transition: "all 0.2s ease",
                                          }}
                                        >
                                          {selectedHolding.some(
                                            (holding) => holding.id === item.id
                                          ) && (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 16 16"
                                              fill="white"
                                              width="14"
                                              height="14"
                                              style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform:
                                                  "translate(-50%, -50%)",
                                              }}
                                            >
                                              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7.25 7.25a.5.5 0 0 1-.708 0l-3.25-3.25a.5.5 0 1 1 .708-.708L6.25 10.043l6.896-6.897a.5.5 0 0 1 .708 0z" />
                                            </svg>
                                          )}
                                        </span>
                                      </label>
                                    )}
                                  </label>
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      )}

                    {/* {(label === "Price Ranges (RM)" ||
                      label === "Bedroom(s)" ||
                      label === "Bathroom(s)") && (
                      <Modal
                        isOpen={openDropdown === label}
                        onClose={() => setOpenDropdown(null)}
                        title={
                          label === "Price Ranges (RM)"
                            ? "Select Price Range (RM)"
                            : `Enter ${label.toLowerCase()} range`
                        }
                        width={750}
                        height={380}
                      >
                       
                        <RangeSliderModal
                          label="Price"
                          scale={
                            activeTab === "Buy" ? BUY_AMOUNTS : RENT_AMOUNTS
                          }
                          range={priceRange}
                          setRange={setPriceRange}
                          setRangeDisplay={setPriceRangeDisplay}
                          handleSearch={handleSearch}
                          setOpenDropdown={setOpenDropdown}
                        />

                        {label === "Bedroom(s)" || label === "Bathroom(s)"
                          ? (() => {
                              const isBedroom = label === "Bedroom(s)";
                              const scale = ROOM_COUNTS;

                              const cur = isBedroom ? roomRange : bathroomRange;
                              const setCur = isBedroom
                                ? setRoomRange
                                : setBathroomRange;
                              const setDisplay = isBedroom
                                ? setBedroomDisplay
                                : setBathroomDisplay;

                              const minIdx = nearestIndex(scale, cur?.min ?? 0);
                              const maxIdx = nearestIndex(scale, cur?.max ?? 0);

                              const setMinFromNumber = (num) => {
                                const idx = nearestIndex(scale, num);
                                const v = scale[idx];
                                setCur((r) => {
                                  const nextMax =
                                    r?.max == null ? v : Math.max(v, r.max);
                                  return { ...(r || {}), min: v, max: nextMax };
                                });
                              };

                              const setMaxFromNumber = (num) => {
                                const idx = nearestIndex(scale, num);
                                const v = scale[idx];
                                setCur((r) => {
                                  const nextMin =
                                    r?.min == null ? v : Math.min(v, r.min);
                                  return { ...(r || {}), min: nextMin, max: v };
                                });
                              };

                              return (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 16,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 8,
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: 12,
                                        fontFamily: "Poppins",
                                        color: "black",
                                      }}
                                    >
                                      Min
                                    </div>
                                    <input
                                      type="number"
                                      placeholder="Min"
                                      className="form-control"
                                      value={cur?.min ?? ""}
                                      onChange={(e) => {
                                        const raw = e.target.value
                                          ? +e.target.value
                                          : null;
                                        if (raw == null)
                                          setCur((r) => ({
                                            ...(r || {}),
                                            min: null,
                                          }));
                                        else setMinFromNumber(raw);
                                      }}
                                    />
                                    <input
                                      type="range"
                                      min={0}
                                      max={scale.length - 1}
                                      step={1}
                                      value={minIdx}
                                      onChange={(e) => {
                                        const v = scale[+e.target.value];
                                        setCur((r) => {
                                          const nextMax =
                                            r?.max == null
                                              ? v
                                              : Math.max(v, r.max);
                                          return {
                                            ...(r || {}),
                                            min: v,
                                            max: nextMax,
                                          };
                                        });
                                      }}
                                    />
                                    <div
                                      style={{
                                        fontSize: 12,
                                        fontFamily: "Poppins",
                                      }}
                                    >
                                      {scale[minIdx]}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 8,
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: 12,
                                        fontFamily: "Poppins",
                                        color: "black",
                                      }}
                                    >
                                      Max
                                    </div>
                                    <input
                                      type="number"
                                      placeholder="Max"
                                      className="form-control"
                                      value={cur?.max ?? ""}
                                      onChange={(e) => {
                                        const raw = e.target.value
                                          ? +e.target.value
                                          : null;
                                        if (raw == null)
                                          setCur((r) => ({
                                            ...(r || {}),
                                            max: null,
                                          }));
                                        else setMaxFromNumber(raw);
                                      }}
                                    />
                                    <input
                                      type="range"
                                      min={0}
                                      max={scale.length - 1}
                                      step={1}
                                      value={maxIdx}
                                      onChange={(e) => {
                                        const v = scale[+e.target.value];
                                        setCur((r) => {
                                          const nextMin =
                                            r?.min == null
                                              ? v
                                              : Math.min(v, r.min);
                                          return {
                                            ...(r || {}),
                                            min: nextMin,
                                            max: v,
                                          };
                                        });
                                      }}
                                    />
                                    <div
                                      style={{
                                        fontSize: 12,
                                        fontFamily: "Poppins",
                                      }}
                                    >
                                      {scale[maxIdx]}
                                    </div>
                                  </div>

                                  <div
                                    className="d-flex"
                                    style={{
                                      justifyContent: "space-between",
                                      marginTop: 8,
                                    }}
                                  >
                                    <button
                                      className="btn"
                                      onClick={() => {
                                        setCur({ min: null, max: null });
                                        setDisplay(label);
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
                                      className="btn"
                                      onClick={() => {
                                        const display = `${cur?.min ?? 0} - ${
                                          cur?.max ?? 0
                                        } ${label}`;
                                        setDisplay(display);
                                        setOpenDropdown(null);
                                      }}
                                      style={{
                                        backgroundColor: "#F4980E",
                                        color: "white",
                                        fontFamily: "Poppins",
                                      }}
                                    >
                                      Apply
                                    </button>
                                  </div>
                                </div>
                              );
                            })()
                          : null}
                      </Modal>
                    )} */}
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
            {/* ===== Header ===== */}
            <div
              style={{
                backgroundColor: "transparent",
                color: "black",
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
                {(() => {
                  const levelNum =
                    typeof currentLevel === "object"
                      ? currentLevel?.node_level ?? navigationStack.length - 1
                      : typeof currentLevel === "number"
                      ? currentLevel
                      : navigationStack.length - 1;

                  return (
                    <>
                      <h6
                        style={{
                          margin: 0,
                          textAlign: "left",
                          fontWeight: "600",
                          fontSize: "16px",
                          fontFamily: "Poppins",
                          marginBottom: "5px",
                        }}
                      >
                        {levelNum === 0
                          ? `Search by State`
                          : levelNum === 1
                          ? `Select City/Area`
                          : levelNum === 2
                          ? `Select City/Area`
                          : `Select Area `}
                      </h6>

                      {levelNum === 1 && navigationStack[0] && (
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

                      {levelNum === 2 && navigationStack[1] && (
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
                    </>
                  );
                })()}
              </div>

              <div>
                <button
                  onClick={() => {
                    console.log("data location", selectedCountry);
                    setShowModal(false);
                  }}
                  className="btn btn-sm"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "black",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ===== Content ===== */}
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
                  {navigationStack.length > 0 && (
                    <>
                      {(() => {
                        const depth = navigationStack.length;
                        const isLeafLevel =
                          Array.isArray(displayList) &&
                          displayList.length > 0 &&
                          displayList.every(
                            (n) =>
                              !n.child_list ||
                              (Array.isArray(n.child_list) &&
                                n.child_list.length === 0) ||
                              n.child_count === 0
                          );

                        const showCheckboxes = depth >= 3 || isLeafLevel;

                        return (
                          <>
                            {showCheckboxes && displayList.length > 0 && (
                              <div
                                className="py-2 d-flex align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  const allIds = displayList.map(
                                    (item) => item.id
                                  );
                                  const allObjects = displayList;

                                  const isAllSelected = allIds.every((id) =>
                                    selectedAreaIds.includes(id)
                                  );

                                  if (isAllSelected) {
                                    setSelectedAreaIds([]);
                                    setSelectedAreaNames([]);
                                    setSelectedAreaObjects([]);
                                  } else {
                                    setSelectedAreaIds(allIds);
                                    setSelectedAreaNames(
                                      allObjects.map((a) => a.name)
                                    );
                                    setSelectedAreaObjects(allObjects);
                                  }
                                }}
                              >
                                <input
                                  type="checkbox"
                                  style={{
                                    appearance: "none",
                                    width: "16px",
                                    height: "16px",
                                    border: "2px solid #F4980E",
                                    borderRadius: "4px",
                                    marginRight: "2%",
                                    position: "relative",
                                    cursor: "pointer",
                                    backgroundColor:
                                      displayList.length > 0 &&
                                      displayList.every((item) =>
                                        selectedAreaIds.includes(item.id)
                                      )
                                        ? "#F4980E"
                                        : "#fff",
                                  }}
                                  checked={
                                    displayList.length > 0 &&
                                    displayList.every((item) =>
                                      selectedAreaIds.includes(item.id)
                                    )
                                  }
                                  readOnly
                                />
                                <span>Select All</span>
                              </div>
                            )}

                            {Array.isArray(displayList) &&
                              displayList.map((node) => {
                                const nodeIsLeaf =
                                  !node.child_list ||
                                  (Array.isArray(node.child_list) &&
                                    node.child_list.length === 0) ||
                                  node.child_count === 0;

                                return (
                                  <div
                                    key={node.id}
                                    className="py-2 d-flex align-items-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      node.child_count > 0
                                        ? handleNodeClick(node)
                                        : handleAreaToggle(node)
                                    }
                                  >
                                    {showCheckboxes && nodeIsLeaf ? (
                                      <>
                                        <input
                                          type="checkbox"
                                          checked={selectedAreaIds.includes(
                                            node.id
                                          )}
                                          onChange={() =>
                                            handleAreaToggle(node)
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                          style={{
                                            accentColor: "#F4980E", // ✅ Orange box
                                            color: "white", // ✅ White tick (modern browsers support this)
                                            cursor: "pointer",
                                            marginRight: "2%",
                                          }}
                                        />

                                        <span>{node.name}</span>
                                      </>
                                    ) : (
                                      <div className="py-2 d-flex align-items-center justify-content-between w-100">
                                        <span>{node.name}</span>
                                        {node.child_count > 0 && (
                                          <span>&#x276F;</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </>
                        );
                      })()}
                    </>
                  )}
                </>
              )}
            </div>

            {/* ===== Footer ===== */}
            {(() => {
              const depth = navigationStack.length;
              const isLeafLevel =
                Array.isArray(displayList) &&
                displayList.length > 0 &&
                displayList.every(
                  (n) =>
                    !n.child_list ||
                    (Array.isArray(n.child_list) &&
                      n.child_list.length === 0) ||
                    n.child_count === 0
                );
              const showFooter = depth >= 3 || isLeafLevel;

              return (
                showFooter && (
                  <div
                    style={{
                      padding: "15px 20px",
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "space-between",
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
                      style={{
                        backgroundColor: "#F4980E",
                        fontFamily: "Poppins",
                      }}
                      onClick={handleApply}
                    >
                      Apply
                    </button>
                  </div>
                )
              );
            })()}

            {/* White tick only when checked */}
            {/* <style>
              {`
          input[type="checkbox"][style]:checked::after {
            content: "✔";
            color: white;
            font-size: 12px;
            position: absolute;
            top: -2px;
            left: 2px;
          }
        `}
            </style> */}
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
