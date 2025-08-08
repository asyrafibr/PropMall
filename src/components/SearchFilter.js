import React, { useEffect, useState, useRef } from "react";
import AgentBox from "./AgentBox";
import agentBoxbg from "../image/Landing_HeroAgent.jpg";
import { useTemplate } from "../context/TemplateContext"; // ✅ Import Template Context
import { getCategory, getHolding, getLot } from "../api/axiosApi";
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
  roomRange
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
  const [selectedAreaIds, setSelectedAreaIds] = useState([]);
  // const [bathroomRange, setBathroomRange] = useState({ min: null, max: null });
  // const [roomRange, setRoomRange] = useState({ min: null, max: null });

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
  console.log(
    "Tabs shown:",
    selectedCategory
  );
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "1300px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ✅ AgentBox with full-width container (not sticky) */}
        {/* <AgentBox /> */}

        <div
          style={{
            backgroundColor: "#FAFAFA",
            borderRadius: "8px",
            padding: "20px 15px",
            width: "100%",
          }}
        >
          {/* Rent / Sell Toggle Buttons */}
          <div style={{ marginBottom: "10px" }}>
            {category && (
              <div style={{ marginBottom: "10px" }}>
                {tabMap
                  .filter(({ key }) => category[key])
                  .map(({ label }) => (
                    <button
                      key={label}
                      className="btn me-3"
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
                        color: "black",
                      }}
                    >
                      {label}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Filters Row */}
          <div className="row justify-content-left">
            <div className="col-12 col-md-3 mb-3">
              <label
                htmlFor="location"
                className="form-label"
                style={{ fontFamily: "Poppins" }}
              >
                Location:
              </label>
              <select
                id="location"
                className="form-select"
                onChange={(e) => setSelectedLocation(e.target.value)}
                value={selectedLocation}
                style={{ height: "60px", fontFamily: "Poppins" }}
              >
                <option value="">All Location</option>
                {locations.map((loc) => (
                  <option key={loc.location_id} value={loc.id_state}>
                    {loc.state_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-9 d-flex align-items-start mb-3">
              <div
                style={{
                  width: "834px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label
                  htmlFor="search"
                  className="form-label"
                  style={{ marginBottom: "6px", fontFamily: "Poppins" }}
                >
                  Search:
                </label>
                <input
                  id="search"
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    height: "60px",
                    padding: "6px 12px",
                    boxSizing: "border-box",
                    fontFamily: "Poppins",
                  }}
                />
              </div>

              <button
                className="btn btn-primary ms-3"
                onClick={handleSearch}
                style={{
                  backgroundColor: "#F4980E",
                  borderColor: "#F4980E",
                  width: "160px",
                  borderRadius: "8px",
                  height: "60px",
                  padding: "6px 0",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "30px",
                  justifyContent: "center",
                  fontFamily: "Poppins",
                }}
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
                    onClick={() => toggleDropdown(label)}
                    className="btn p-0 d-flex align-items-center"
                    style={{
                      justifyContent: "space-between",
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      color: "black",
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

                  {/* --- Modal for Price Ranges / Bedroom(s) / Bathroom(s) --- */}
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
                      {label === "Price Ranges (RM)"
                        ? (() => {
                            const scale =
                              activeTab === "Buy" ? BUY_AMOUNTS : RENT_AMOUNTS;

                            const minIdx = nearestIndex(
                              scale,
                              priceRange?.min ?? 0
                            );
                            const maxIdx = nearestIndex(
                              scale,
                              priceRange?.max ?? 0
                            );

                            const setMinFromNumber = (num) => {
                              const idx = nearestIndex(scale, num);
                              const v = scale[idx];
                              setPriceRange((r) => {
                                const nextMax =
                                  r?.max == null ? v : Math.max(v, r.max);
                                return { ...(r || {}), min: v, max: nextMax };
                              });
                            };

                            const setMaxFromNumber = (num) => {
                              const idx = nearestIndex(scale, num);
                              const v = scale[idx];
                              setPriceRange((r) => {
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
                                {/* Min column */}
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
                                    value={priceRange?.min ?? ""}
                                    onChange={(e) => {
                                      const raw = e.target.value
                                        ? +e.target.value
                                        : null;
                                      if (raw == null)
                                        setPriceRange((r) => ({
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
                                      setPriceRange((r) => {
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
                                    RM {formatRM(scale[minIdx])}
                                  </div>
                                </div>

                                {/* Max column */}
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
                                    value={priceRange?.max ?? ""}
                                    onChange={(e) => {
                                      const raw = e.target.value
                                        ? +e.target.value
                                        : null;
                                      if (raw == null)
                                        setPriceRange((r) => ({
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
                                      setPriceRange((r) => {
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
                                    RM {formatRM(scale[maxIdx])}
                                  </div>
                                </div>

                                {/* Actions */}
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
                                    className="btn"
                                    onClick={() => {
                                      const display = `RM ${formatRM(
                                        priceRange?.min ?? 0
                                      )} - RM ${formatRM(
                                        priceRange?.max ?? 0
                                      )}`;
                                      setPriceRangeDisplay(display);
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
                                {/* Min column */}
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

                                {/* Max column */}
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

                                {/* Actions */}
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
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
