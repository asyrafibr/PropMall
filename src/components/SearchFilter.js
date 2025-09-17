import React, { useEffect, useState, useRef } from "react";
import AgentBox from "./AgentBox";
import agentBoxbg from "../image/Landing_HeroAgent.jpg";
import { useTemplate } from "../context/TemplateContext"; // ✅ Import Template Context
import {
  getCategory,
  getHolding,
  getLot,
  getLocationTree,
} from "../api/axiosApi";
import { useLocation } from "react-router-dom";
import RangeSliderModal from "../components/RangeSliderModal";
import "./SearchFilters.css";
const SearchFilter = ({
  locations,
  years,
  selectedLocation,
  selectedYear,
  searchTerm,
  setSelectedLocation,
  setSelectedYear,
  setSearchTerm,
  handleSearch,
  activeTab,
  setActiveTab,
  setSelectedCategory,
  selectedCategory,
  setSelectedHolding,
  selectedHolding,
  setPriceRangeDisplay,
  priceRangeDisplay,
  setBedroomDisplay,
  bedroomDisplay,
  setBathroomDisplay,
  bathroomDisplay,
  setPriceRange,
  priceRange,
  bathroomRange,
  setBathroomRange,
  setRoomRange,
  roomRange,
  setSelectedAreaIds,
  selectedAreaIds,
}) => {
  const { agent, category } = useTemplate();
  const containerRef = useRef(null); // ✅ ref to the whole dropdown group
  // const [selectedCategory, setSelectedCategory] = useState([]);
  // const [selectedHolding, setSelectedHolding] = useState([]);
  // const [priceRangeDisplay, setPriceRangeDisplay] = useState(null);
  // const [bedroomDisplay, setBedroomDisplay] = useState(null);
  // const [bathroomDisplay, setBathroomDisplay] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  // const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [categoryData, setCategory] = useState({});
  const [holding, setHolding] = useState({});
  // const [selectedAreaIds, setSelectedAreaIds] = useState([]);
  // const [bathroomRange, setBathroomRange] = useState({ min: null, max: null });
  // const [roomRange, setRoomRange] = useState({ min: null, max: null });
  const [displayList, setDisplayList] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedAreaNames, setSelectedAreaNames] = useState([]);
  const [selectedAreaObjects, setSelectedAreaObjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingLocationData, setLoadingLocationData] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [locationTree, setLocationTree] = useState([]);
  const location = useLocation();
  const [openModalLabel, setOpenModalLabel] = useState(null);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
const activeTabRef = useRef(activeTab);
      const tabKey = activeTabRef.current; // ✅ always latest

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
   

        // ❌ agent is NOT updated here yet
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log("locatoion123", activeTab);
  //   if (activeTab) {
  //     setActiveTab(activeTab);
  //   }
  // }, [activeTab]);
useEffect(() => {

  console.log("activeTab changed to:",activeTab);
    console.log("activeTab changed to123:",tabKey);

}, [activeTab]);
  useEffect(() => {
    // If autoSearch flag is set, run handleSearch after tab is updated
    console.log("LOCATION NOW123", activeTab);
    if (location.state?.autoSearch || location.state?.activeTab) {
      handleSearch(activeTab);
    }
  }, [location.state?.autoSearch, location.state?.activeTab]);
  // --- Initial Load of Countries ---
  useEffect(() => {
    if (showModal) {
      // Example: fetch countries list here
      fetchRootCountries();
    }
  }, [showModal]);
  const getSubdomain = () => {
    const hostname = window.location.hostname; // e.g., "prohartanah.myhartanah.co"
    const parts = hostname.split(".");

    // Handle localhost (e.g., "localhost" or "localhost:3000")
    if (hostname.includes("localhost")) return "localhost";

    // e.g. ["prohartanah", "myhartanah", "co"]
    if (parts.length > 2) return parts[0]; // "prohartanah"
    return null; // fallback if no subdomain
  };
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
    console.log("location", selectedAreaNames);
    setSelectedLocation(`${areaNames}`);
    setShowModal(false);
    setNavigationStack([]);
    setLocationTree([]);
  };
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
  const handleButtonClick = (label) => {
    if (
      label === "Price Ranges (RM)" ||
      label === "Bedroom(s)" ||
      label === "Bathroom(s)"
    ) {
      setOpenModalLabel(label); // open modal for that label
    } else {
      toggleDropdown(label); // old dropdown logic
    }
  };
  const handleClear = () => {
    setSelectedAreaIds([]);
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const categoryList = await getCategory();

  //       setCategory(categoryList.data.property_category);

  //       const holdingList = await getHolding();
  //       const lotList = await getLot();
  //       setHolding(holdingList.data.property_holding_and_type || []);

  //       // ❌ agent is NOT updated here yet
  //     } catch (error) {
  //       console.error("Error fetching agent:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
  const formatRM = (n) => (n == null ? "" : n.toLocaleString("en-MY"));

  const tabMap = [
    { label: "Buy", key: "sale" },
    { label: "Rent", key: "rent" },
    { label: "New Project", key: "project" },
    { label: "Auction", key: "auction" },
  ];
  return (
    <div className="w-100 d-flex justify-content-center">
      <div
        className="w-100 position-relative"
        style={{ maxWidth: "1300px", zIndex: 2 }}
      >
        <div
          className="
        w-100 
        p-3   /* padding: 20px ~ p-3 (16px), if you want closer to 20px use p-4 (24px) */
        text-white 
      "
          style={{
            backgroundColor: "#FAFAFA", // fallback color
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${agentBoxbg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        >
          {/* Rent / Sell Toggle Buttons */}
          <div className="mb-2">
            {category && (
              <div className="mb-2">
                {tabMap
                  .filter(({ key }) => category[key])
                  .map(({ label,key }) => (
                    <button
                      key={label}
                      className={`btn me-3 px-2 py-1 fw-normal fs-6 text-white rounded-0`}
                      onClick={() => setActiveTab(label)}
                      style={{
                        borderBottom:
                          activeTab === label
                            ? "3px solid #F4980E"
                            : "3px solid transparent",
                      }}
                    >
                      {label}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Filters Row */}
          <div className="row g-2">
            {/* All States Dropdown */}
            <div className="col-12 col-md-3">
              <div
                className="form-control d-flex align-items-center justify-content-between cursor-pointer bg-white text-truncate"
                role="button"
                onClick={() => setShowModal(true)}
                style={{ height: "60px" }}
              >
                <span className="flex-grow-1 text-truncate fs-5 fw-normal">
                  {selectedLocation || "All States"}
                </span>
                <span className="small ms-2">▼</span>
              </div>
            </div>

            {/* Search Input + Button */}
            <div className="col-12 col-md-9 d-flex flex-column flex-md-row gap-2">
              <input
                id="search"
                type="text"
                className="form-control flex-grow-1 h-60 font-poppins"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn btn-search bg-orange text-white flex-shrink-0 h-60 rounded"
                style={{ minWidth: "120px" }} // optional to set desktop width
                onClick={handleSearch}
              >
                Search
              </button>
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
                    onClick={() => handleButtonClick(label)}
                    className="btn p-0 d-flex align-items-center"
                    style={{
                      justifyContent: "space-between",
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      fontSize: "14px",
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
                                      fontSize: 14,
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
                                            const isChecked = e.target.checked;
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
                                          backgroundColor: selectedHolding.some(
                                            (holding) => holding.id === item.id
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

                  {(label === "Price Ranges (RM)" ||
                    label === "Bedroom(s)" ||
                    label === "Bathroom(s)") &&
                    openModalLabel === label && (
                      <div
                        className="modal-overlay"
                        onClick={() => setPriceModalOpen(false)}
                      >
                        <div
                          // className="modal-box"
                          style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: 35,
                            boxShadow: `0 10px 30px rgba(0, 0, 0, 0.25)`,
                            overflow: "auto",
                            zIndex: 2,
                            height: 400,
                            width: 1000,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h5 style={{ color: "black" }}>
                            {label === "Price Ranges (RM)"
                              ? "Select Price Range (RM)"
                              : label === "Bedroom(s)"
                              ? "Select Bedroom Range"
                              : "Select Bathroom Range"}
                          </h5>

                          <RangeSliderModal
                            label={label}
                            setOpenModalLabel={setOpenModalLabel}
                            scale={
                              label === "Price Ranges (RM)"
                                ? activeTab === "Buy"
                                  ? BUY_AMOUNTS
                                  : RENT_AMOUNTS
                                : ROOM_COUNTS
                            }
                            range={
                              label === "Price Ranges (RM)"
                                ? priceRange
                                : label === "Bedroom(s)"
                                ? roomRange
                                : bathroomRange
                            }
                            setRange={
                              label === "Price Ranges (RM)"
                                ? setPriceRange
                                : label === "Bedroom(s)"
                                ? setRoomRange
                                : setBathroomRange
                            }
                            setRangeDisplay={
                              label === "Price Ranges (RM)"
                                ? setPriceRangeDisplay
                                : label === "Bedroom(s)"
                                ? setBedroomDisplay
                                : setBathroomDisplay
                            }
                            handleSearch={handleSearch}
                            setOpenDropdown={setOpenDropdown}
                          />
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal-overlay d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 pt-6"
          onClick={() => setShowModal(false)}
          style={{ zIndex: 9999, paddingTop: "50px" }} // 👈 push down
        >
          <div
            className="
    modal-box 
    bg-white 
    rounded-4 
    d-flex 
    flex-column 
    position-relative 
    mt-5 
    w-100 
    h-auto
    "
            style={{ maxWidth: "750px", maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ===== Header ===== */}
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
              <div>
                {navigationStack.length > 1 && (
                  <button
                    onClick={handleBack}
                    className="btn p-0 d-flex justify-content-center align-items-center text-dark border-0 bg-transparent me-2"
                  >
                    &lt;
                  </button>
                )}
              </div>

              <div className="flex-grow-1">
                {(() => {
                  const levelNum =
                    typeof currentLevel === "object"
                      ? currentLevel?.node_level ?? navigationStack.length - 1
                      : typeof currentLevel === "number"
                      ? currentLevel
                      : navigationStack.length - 1;

                  return (
                    <>
                      <h6 className="m-0 fw-semibold fs-6 text-start mb-1">
                        {levelNum === 0
                          ? "Search by State"
                          : levelNum === 1
                          ? "Select City/Area"
                          : levelNum === 2
                          ? "Select City/Area"
                          : "Select Area"}
                      </h6>

                      {levelNum === 1 && navigationStack[0] && (
                        <p className="m-0 small text-muted">
                          {navigationStack[1].name}
                        </p>
                      )}

                      {levelNum === 2 && navigationStack[1] && (
                        <p className="m-0 small text-muted">
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
                  className="btn btn-sm border-0 bg-transparent text-dark"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* ===== Content ===== */}
            <div className="flex-grow-1 overflow-auto p-4">
              {loadingLocationData ? (
                <div className="d-flex justify-content-center align-items-center h-100">
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
                                role="button"
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
                                  className="form-check-input me-2 border-warning"
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
                                    role="button"
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
                                          className="form-check-input me-2"
                                          checked={selectedAreaIds.includes(
                                            node.id
                                          )}
                                          onChange={() =>
                                            handleAreaToggle(node)
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <span>{node.name}</span>
                                      </>
                                    ) : (
                                      <div className="d-flex justify-content-between align-items-center w-100">
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
                  <div className="d-flex justify-content-between p-3 border-top">
                    <button
                      className="btn btn-outline-secondary px-4"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                    <button
                      className="btn px-4 text-white"
                      style={{ backgroundColor: "#F4980E" }}
                      onClick={handleApply}
                    >
                      Apply
                    </button>
                  </div>
                )
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
