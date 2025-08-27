import React, { useState, useEffect, useRef } from "react";
import "../Dashboard/FilterT2.css";
import bgImage from "../../image/Template2_Sky_Footer.png";
import RangeSliderModal from "../../components/RangeSliderModal";
import {
  getCategory,
  getHolding,
  getLocationTree,
  getListings,
  getLot,
} from "../../api/axiosApi";
import { useTemplate } from "../../context/TemplateContext"; // ✅ Import Template Context
import { useLocation } from "react-router-dom";

const textBlack = { color: "black" };
// const category = {
//   sale: true,
//   rent: true,
//   project: true,
//   auction: false,
// };

const tabMap = [
  { label: "Buy", key: "sale" },
  { label: "Rent", key: "rent" },
  { label: "New Project", key: "project" },
  { label: "Auction", key: "auction" },
];
const DashboardT2 = ({
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
  const location = useLocation();

  const { agent, category } = useTemplate();
  const [locationTree, setLocationTree] = useState([]);

  const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
  // const [selectedCategory, setSelectedCategory] = useState([]);
  // const [selectedHolding, setSelectedHolding] = useState([]);
  // const [priceRangeDisplay, setPriceRangeDisplay] = useState(null);
  // const [bedroomDisplay, setBedroomDisplay] = useState(null);
  // const [bathroomDisplay, setBathroomDisplay] = useState(null);
  const containerRef = useRef(null); // ✅ ref to the whole dropdown group
  const [openDropdown, setOpenDropdown] = useState(null);
  // const [priceRange, setPriceRange] = useState({ min: null, max: null });
  // const [roomRange, setRoomRange] = useState({ min: null, max: null });
  // const [bathroomRange, setBathroomRange] = useState({ min: null, max: null });
  // const [selectedAreaIds, setSelectedAreaIds] = useState([]);
  const [categoryData, setCategory] = useState({});
  const [holding, setHolding] = useState({});
  const [visibleTabs, setVisibleTabs] = useState([]);
  const buttonRefs = useRef({});
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 });
  const [showModal, setShowModal] = useState(false);
  const [navigationStack, setNavigationStack] = useState([]);
  const [loadingLocationData, setLoadingLocationData] = useState(false);
  const [selectedAreaNames, setSelectedAreaNames] = useState([]);
  const [selectedAreaObjects, setSelectedAreaObjects] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [displayList, setDisplayList] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [openModalLabel, setOpenModalLabel] = useState(null);
  const [priceModalOpen, setPriceModalOpen] = useState(false);

  useEffect(() => {
    if (activeTab && buttonRefs.current[activeTab]) {
      const btn = buttonRefs.current[activeTab];
      setHighlightStyle({
        left: btn.offsetLeft + 5,
        width: btn.offsetWidth,
      });
    }
  }, [activeTab, visibleTabs]);
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
  useEffect(() => {
    const activeTabs = tabMap.filter((tab) => category[tab.key]);
    setVisibleTabs(activeTabs);
    if (activeTabs.length > 0) {
      setActiveTab(activeTabs[0].label); // Auto-select first active tab
    }
  }, []);

  const handleToggle = (label) => {
    setActiveTab(label);
  };

  const getPositionLeft = () => {
    const index = visibleTabs.findIndex((tab) => tab.label === activeTab);
    return `${6 + index * (220 / visibleTabs.length)}px`;
  };

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
  const filters = {
    "All Categories": categoryData, // array from props/state
    "All Holding Types": holding, // array from props/state
    "Price Ranges (RM)": [], // now triggers modal
    "Bedroom(s)": ["Custom Range..."],
    "Bathroom(s)": ["Custom Range..."],
  };
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

      const merged = [
        ...(holdingList?.data?.property_holding || []),
        ...(lotList?.data?.property_lot_type || []),
      ];

      console.log("Merged holding data", merged);
      setHolding(merged);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);

  useEffect(() => {
    console.log("locatoion", location);
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state?.activeTab]);

  useEffect(() => {
    // If autoSearch flag is set, run handleSearch after tab is updated
    console.log("LOCATION NOW", location.state.activeTab);
    if (location.state?.autoSearch && location.state?.activeTab) {
      handleSearch(location.state.activeTab);
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
    console.log("locationarea", selectedAreaNames);
    setSelectedLocation(`${areaNames}`);
    setShowModal(false);
    setNavigationStack([]);
    setLocationTree([]);
  };
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [showModal]);
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
  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };
  const handleClear = () => {
    setSelectedAreaIds([]);
  };
  // const handleToggle = (value) => {
  //   setIsBuy(value);
  // };

  return (
    <>
      {/* Hero Section */}

      <div
        // className="hero-section position-relative d-flex flex-column justify-content-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "50px 20px",
          height: "200px",
          color: "#333",
        }}
      >
        {/* Breadcrumb positioned at top left */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            fontFamily: "Poppins",
          }}
        >
          <nav aria-label="breadcrumb">
            <ol
              className="breadcrumb mb-0"
              style={{
                "--bs-breadcrumb-divider": "'›'",
                background: "transparent",
                padding: 0,
              }}
            >
              <li className="breadcrumb-item">
                <a
                  href="/"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <a
                  href="/properties"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  For {activeTab}
                </a>
              </li>
         
            </ol>
          </nav>
        </div>
      </div>

      {/* Filter Box */}
      <div
        className="container"
        style={{
          marginTop: "-100px",
          backgroundColor: "#00000099",
          borderRadius: "16px",
          padding: "24px",
          position: "relative",
          zIndex: 10,
          maxWidth: "1000px",
        }}
      >
        {/* Toggle Buy / Rent */}

        <div className="d-flex justify-content-center mb-3">
          <div
            className="position-relative"
            style={{
              background: "#fff",
              borderRadius: "999px",
              padding: "6px",
              width: "350px",
              height: "52px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "6px",
                left: highlightStyle.left,
                width: highlightStyle.width,
                height: "40px",
                background: "#F4980E",
                borderRadius: "999px",
                transition: "left 0.3s ease, width 0.3s ease",
                zIndex: 1,
              }}
            ></div>

            <div className="d-flex position-relative" style={{ zIndex: 2 }}>
              {visibleTabs.map((tab) => (
                <button
                  key={tab.label}
                  ref={(el) => (buttonRefs.current[tab.label] = el)}
                  className="btn rounded-pill flex-fill"
                  style={{
                    fontSize: "14px",
                    background: "transparent",
                    color: activeTab === tab.label ? "#fff" : "#000",
                    border: "none",
                  }}
                  onClick={() => handleToggle(tab.label)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Search Bar */}
        <div
          className="d-flex align-items-center overflow-hidden"
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            height: "60px",
            fontFamily: "Poppins",
            borderRadius: "16px",
          }}
        >
          {/* Dropdown */}
          <div
            className="d-flex align-items-center px-3"
            style={{
              borderRight: "0.5px solid #ddd",
              height: "100px",
              cursor: "pointer",
              minWidth: "150px",
              borderColor: "#999",
            }}
            onClick={() => setShowModal(true)}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 400,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1,
              }}
            >
              {selectedLocation || "All States"}
            </span>
            <span style={{ fontSize: "0.8rem", marginLeft: "8px" }}>▼</span>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by Location, Neighbourhood or Property Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              padding: "0 16px",
            }}
          />

          {/* Search Button */}
          <button
            className="btn"
            onClick={handleSearch}
            style={{
              backgroundColor: "#f7a21b",
              color: "#fff",
              fontWeight: 500,
              fontSize: "14px",
              height: "100%",
              border: "none",
              borderRadius: "0 16px 16px 0", // keep flush with container
              padding: "0 24px",
            }}
          >
            Search
          </button>
        </div>

        {/* Dropdowns */}
        <div className="row mt-4" ref={containerRef}>
          <div className="col-12 d-flex flex-column flex-md-row gap-3">
            {Object.entries(filters).map(([label, options]) => (
              <div key={label} style={{ position: "relative", width: "100%" }}>
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
                        fontSize: "12px",
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
                            fontSize: "14px",
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
                              fontSize: "12px",
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
                              fontSize: "12px",
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

        
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardT2;
