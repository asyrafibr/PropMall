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
  searchTerm,
  setSelectedLocation,
  selectedLocation,
  activeTab,
  setSearchTerm,
  handleSearch,

  setActiveTab,
}) => {
  const { agent, category } = useTemplate();
  const [locationTree, setLocationTree] = useState([]);

  const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedHolding, setSelectedHolding] = useState([]);
  const [priceRangeDisplay, setPriceRangeDisplay] = useState(null);
  const [bedroomDisplay, setBedroomDisplay] = useState(null);
  const [bathroomDisplay, setBathroomDisplay] = useState(null);
  const containerRef = useRef(null); // ✅ ref to the whole dropdown group
  const [openDropdown, setOpenDropdown] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [roomRange, setRoomRange] = useState({ min: null, max: null });
  const [bathroomRange, setBathroomRange] = useState({ min: null, max: null });
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);
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

  useEffect(() => {
    console.log("activetab123", activeTab);
    if (activeTab && buttonRefs.current[activeTab]) {
      const btn = buttonRefs.current[activeTab];
      setHighlightStyle({
        left: btn.offsetLeft + 5,
        width: btn.offsetWidth,
      });
    }
  }, [activeTab, visibleTabs]);

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryList = await getCategory();

        setCategory(categoryList.data.property_category);

        const holdingList = await getHolding();
        const lotList = await getLot();
        setHolding(holdingList.data.property_holding_and_type || []);

        // ❌ agent is NOT updated here yet
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };

    fetchData();
  }, []);
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
  const currentLevel = navigationStack[navigationStack.length - 1];
  const displayList = currentLevel?.child_list || [];
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
              <li className="breadcrumb-item">
                <a
                  href="/properties/kuala-lumpur"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Kuala Lumpur
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
                    fontSize: "16px",
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
                fontSize: "16px",
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
              fontSize: "16px",
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
              fontSize: "16px",
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
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
                          ))
                        )}
                      </ul>
                    </div>
                  )}

                {(label === "Price Ranges (RM)" ||
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
                      scale={activeTab === "Buy" ? BUY_AMOUNTS : RENT_AMOUNTS}
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
                                        r?.max == null ? v : Math.max(v, r.max);
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
                                        r?.min == null ? v : Math.min(v, r.min);
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
                      marginBottom: "5px",
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
                      color: "black",
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
                    style={{
                      backgroundColor: "#F4980E",
                      fontFamily: "Poppins",
                    }}
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
    </>
  );
};

export default DashboardT2;
