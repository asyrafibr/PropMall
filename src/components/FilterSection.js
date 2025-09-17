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
import "./FilterSection.css";
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
  const { mainAgent, template } = useTemplate();

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
  const [openModalLabel, setOpenModalLabel] = useState(null);

  // when clicking a button
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
          className="modal-box bg-white p-4 rounded modal-size"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {title ? <h5 className="mb-3 font-poppins">{title}</h5> : null}
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

  return (
    <div className="container-xl px-0">
      <div className="order-1 order-md-2 w-100 w-md-auto">
        <AgentBox />
      </div>

      <div
        className="
    d-flex 
    flex-column flex-md-row
    align-items-start 
    justify-content-center 
    flex-wrap 
    position-relative 
    w-100 
    min-vh-50 
    text-white 
    px-md-5 px-xl-5   <!-- ✅ extra padding at ≥1200px -->
    py-3 py-md-5   <!-- ✅ keep top/bottom responsive -->
        header-section

  "
      >
        <div className="container-xl order-2 order-md-1 position-relative z-2 flex-fill pt-5 responsive-padding">
          <div className="hero-heading text-white fw-bold text-end mb-4">
            Discover Your Dream Properties at {mainAgent.name}
          </div>
          <div className="bg-dark bg-opacity-50 rounded-2 p-4">
            {/* Tabs */}
            <div className="d-flex">
              {tabMap
                .filter(({ key }) => category[key])
                .map(({ label }) => (
                  <button
                    key={label}
                    className={`btn text-white me-3 rounded-0 fs-6 ${
                      activeTab === label ? "border-orange-bottom" : ""
                    }`}
                    onClick={() => setActiveTab(label)}
                  >
                    {label}
                  </button>
                ))}
            </div>

            <div className="border-bottom border-2 border-secondary mb-3"></div>

            {/* Location + Search */}
            <div className="row g-2">
              {/* All States Dropdown */}
              <div className="col-12 col-md-3">
                <div
                  className="form-control d-flex align-items-center justify-content-between cursor-pointer bg-white text-truncate     h-60px
"
                  role="button"
                  onClick={() => setShowModal(true)}
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
                  className="form-control font-poppins"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: "60px", width: "100%" }}
                />
                <button
                  className="btn btn-search text-white w-100 w-md-auto"
                  style={{ height: "60px",maxWidth:'120px' }}
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="row mt-4" ref={containerRef}>
              <div className="col-12 d-flex flex-column flex-md-row gap-3">
                {Object.entries(filters).map(([label, options]) => (
                  <div key={label} className="position-relative w-100">
                    <button
                      onClick={() => handleButtonClick(label)}
                      className="btn w-100 text-white text-decoration-none border-0 d-flex justify-content-between align-items-center fs-6"
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
                      <span className="small ms-2">▼</span>
                    </button>

                    {/* Dropdown for Categories / Holdings */}
                    {openDropdown === label &&
                      (label === "All Categories" ||
                        label === "All Holding Types") && (
                        <div className="position-absolute top-100 w-100 bg-white rounded-2 p-2 shadow">
                          <ul className="list-unstyled m-0">
                            {(options || []).length === 0 ? (
                              <li className="text-muted">
                                No options available.
                              </li>
                            ) : (
                              options.map((item, i) => (
                                <li
                                  key={i}
                                  className="py-1 cursor-pointer"
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
                                  <span className="text-dark fs-6">
                                    {item.desc}
                                  </span>
                                  {label === "All Holding Types" && (
                                    <input
                                      type="checkbox"
                                      className="form-check-input ms-2"
                                      checked={selectedHolding.some(
                                        (holding) => holding.id === item.id
                                      )}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        setSelectedHolding((prev) => {
                                          if (e.target.checked) {
                                            return [
                                              ...prev,
                                              { id: item.id, name: item.desc },
                                            ];
                                          } else {
                                            return prev.filter(
                                              (holding) =>
                                                holding.id !== item.id
                                            );
                                          }
                                        });
                                      }}
                                    />
                                  )}
                                </li>
                              ))
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Modal for Price, Bedroom, Bathroom */}
                    {(label === "Price Ranges (RM)" ||
                      label === "Bedroom(s)" ||
                      label === "Bathroom(s)") &&
                      openModalLabel === label && (
                        <div
                          className="modal-overlay"
                          onClick={() => setPriceModalOpen(false)}
                        >
                          <div
                            className="bg-white rounded-3 p-4 shadow-lg custom-box"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h5 className="text-dark mb-3">
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
      </div>

      {showModal && (
        <div
          className="position-fixed top-0 start-0 vw-100 vh-100 d-flex justify-content-center align-items-start bg-dark bg-opacity-50 z-3 pt-5"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-4 d-flex flex-column position-relative shadow w-100 pt-5 modal-location"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ===== Header ===== */}
            <div className="d-flex align-items-center justify-content-between px-3 py-2">
              <div className="d-flex align-items-center">
                {navigationStack.length > 1 && (
                  <button
                    onClick={handleBack}
                    className="btn p-0 d-flex justify-content-center align-items-center me-2 fs-6 w-25 h-25"
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
                      <h6 className="mb-1 fw-semibold fs-6">
                        {levelNum === 0
                          ? `Search by State`
                          : `Select City/Area`}
                      </h6>
                      {(levelNum === 1 || levelNum === 2) &&
                        navigationStack[levelNum - 1] && (
                          <p className="mb-0 text-secondary fs-7">
                            {navigationStack[levelNum - 1].name}
                          </p>
                        )}
                    </>
                  );
                })()}
              </div>

              <div>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-sm btn-close"
                ></button>
              </div>
            </div>

            {/* ===== Content ===== */}
            <div className="flex-grow-1 overflow-auto p-3">
              {loadingLocationData ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {navigationStack.length > 0 &&
                    (() => {
                      const depth = navigationStack.length;
                      const isLeafLevel =
                        Array.isArray(displayList) &&
                        displayList.length > 0 &&
                        displayList.every(
                          (n) =>
                            !n.child_list ||
                            n.child_list.length === 0 ||
                            n.child_count === 0
                        );

                      const showCheckboxes = depth >= 3 || isLeafLevel;

                      return (
                        <>
                          {showCheckboxes && displayList.length > 0 && (
                            <div
                              className="form-check d-flex align-items-center mb-2 cursor-pointer"
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
                                className="form-check-input checkbox-orange"
                                checked={
                                  displayList.length > 0 &&
                                  displayList.every((item) =>
                                    selectedAreaIds.includes(item.id)
                                  )
                                }
                                readOnly
                              />
                              <label className="form-check-label ms-2 fs-6">
                                Select All
                              </label>
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
                                  className="py-2 d-flex align-items-center cursor-pointer"
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
                                        className="form-check-input checkbox-orange"
                                        checked={selectedAreaIds.includes(
                                          node.id
                                        )}
                                        onChange={() => handleAreaToggle(node)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <label className="form-check-label ms-2 fs-6">
                                        {node.name}
                                      </label>
                                    </>
                                  ) : (
                                    <div className="d-flex justify-content-between w-100 fs-6">
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
                    n.child_list.length === 0 ||
                    n.child_count === 0
                );
              const showFooter = depth >= 3 || isLeafLevel;

              return (
                showFooter && (
                  <div className="d-flex justify-content-between p-3 bg-white rounded-bottom flex-wrap gap-2">
                    <button
                      className="btn btn-outline-secondary fs-6"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                    <button
                      className="btn bg-orange text-white fs-6"
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

      {/* {priceModalOpen && (
        <div className="modal-overlay" onClick={() => setPriceModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h5>Select Price Range (RM)</h5>
            <RangeSliderModal
              label="Price"
              scale={activeTab === "Buy" ? BUY_AMOUNTS : RENT_AMOUNTS}
              range={priceRange}
              setRange={setPriceRange}
              setRangeDisplay={setPriceRangeDisplay}
              handleSearch={handleSearch}
              setOpenDropdown={setOpenDropdown}
            />
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
      )} */}
    </div>
  );
};

export default Filters;
