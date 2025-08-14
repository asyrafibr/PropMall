import React, { useEffect, useMemo, useRef, useState } from "react";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import { debounce } from "lodash";
import "./rangeSliderModal.css";

const RangeSliderModal = ({
  label = "Price Ranges (RM)",
  scale = [],
  range = {},
  setRange,
  setRangeDisplay,
  handleSearch,
  setOpenDropdown,
  setOpenModalLabel,
}) => {
  const [showMinDropdown, setShowMinDropdown] = useState(false);
  const [showMaxDropdown, setShowMaxDropdown] = useState(false);
  const [sliderValue, setSliderValue] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const timeoutRef = useRef(null);

  const minScale = scale[0];
  const maxScale = scale[scale.length - 1];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const min = range?.min ?? minScale;
    const max = range?.max ?? maxScale;
    if (sliderValue[0] !== min || sliderValue[1] !== max) {
      setSliderValue([min, max]);
    }
  }, [range, minScale, maxScale]);

  const formatValue = (val) => {
    if (label === "Price Ranges (RM)") return `RM ${val.toLocaleString()}`;
    return `${val}`;
  };

  // Debounced setter for stable updates
  const debouncedSetRange = useMemo(
    () =>
      debounce((val) => {
        setRange({ min: val[0], max: val[1] });
      }, 30),
    [setRange]
  );

  // const handleSliderChange = (val) => {
  //   // Clamp to avoid undefined when moving fast
  //   const safeValue = [
  //     Math.max(minScale, Math.min(val[0], maxScale)),
  //     Math.max(minScale, Math.min(val[1], maxScale)),
  //   ];

  //   setSliderValue(safeValue);
  //   debouncedSetRange(safeValue);

  //   // Optional: debounce display update
  //   clearTimeout(timeoutRef.current);
  //   timeoutRef.current = setTimeout(() => {
  //     setRangeDisplay(
  //       `${formatValue(safeValue[0])} - ${formatValue(safeValue[1])}`
  //     );
  //   }, 50);
  // };

  // const handleAfterChange = (val) => {
  //   // Final commit after dragging stops
  //   const safeValue = [
  //     Math.max(minScale, Math.min(val[0], maxScale)),
  //     Math.max(minScale, Math.min(val[1], maxScale)),
  //   ];
  //   setRange({ min: safeValue[0], max: safeValue[1] });
  // };

  const handleInputChange = (e, type) => {
    const val = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    if (isNaN(val) && val !== "") return;
    const newRange = {
      ...range,
      [type]: val,
    };
    setRange(newRange);
    setSliderValue([newRange.min ?? minScale, newRange.max ?? maxScale]);
  };

  const handleApply = () => {
    const min = range?.min ?? "";
    const max = range?.max ?? "";
    setRangeDisplay(`${formatValue(min)} - ${formatValue(max)}`);
    setOpenModalLabel(null);
  };

  const nearestIndex = (arr, v) => {
    let lo = 0,
      hi = arr.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    if (lo > 0 && Math.abs(arr[lo - 1] - v) <= Math.abs(arr[lo] - v))
      return lo - 1;
    return lo;
  };

  const formatCurrency = (n) =>
    `RM ${Number(n).toLocaleString("en-MY", { maximumFractionDigits: 0 })}`;

  // Local slider state in INDEX space (equally spaced stoppers)
  const [pos, setPos] = useState([0, Math.max(0, scale.length - 1)]);

  // Keep index positions in sync with external range values
  useEffect(() => {
    if (!scale?.length) return;
    const minV = range?.min ?? scale[0];
    const maxV = range?.max ?? scale[scale.length - 1];
    const next = [nearestIndex(scale, minV), nearestIndex(scale, maxV)];
    if (pos[0] !== next[0] || pos[1] !== next[1]) setPos(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, scale]);

  // Tooltip should show REAL values, not indices
  const handleRender = (node, { value, dragging }) => (
    <Tooltip
      prefixCls="rc-tooltip"
      overlay={formatCurrency(scale[value])}
      visible={dragging}
      placement="top"
      key={value}
      styles={{
        body: {
          backgroundColor: "#F4980E", // background color
          color: "#fff", // text color
          borderRadius: "6px",
          padding: "4px 8px",
        },
      }}
    >
      {node}
    </Tooltip>
  );

  // Build marks from REAL values (optional: comment out to hide labels)
  const indexMarks = useMemo(() => {
    if (!scale?.length) return {};
    // If too dense, only show a subset (e.g., first/last or every Nth)
    return scale.reduce((acc, val, i) => {
      acc[i] = formatCurrency(val);
      return acc;
    }, {});
  }, [scale]);

  // During drag: update local index positions ONLY
  const handleSliderChange = (nextPos) => setPos(nextPos);

  // After drag ends: commit REAL values to parent (prevents feedback loops)
  const handleAfterChange = (finalPos) => {
    const next = { min: scale[finalPos[0]], max: scale[finalPos[1]] };
    setRange((prev) =>
      prev?.min === next.min && prev?.max === next.max ? prev : next
    );
  };

  return (
    <div className="range-modal">
      <div className="my-4 px-2">
        {isClient && (
          <Slider
            range
            min={0}
            max={Math.max(0, scale.length - 1)}
            step={1} // equally spaced stoppers
            value={pos} // indices, not values
            onChange={handleSliderChange}
            onAfterChange={handleAfterChange}
            // marks={indexMarks}               // shows RM 0, RM 100,000, ... correctly
            allowCross={false}
            handleRender={handleRender}
            className="custom-slider"
          />
        )}
      </div>

      {/* Inputs */}
      <div className="row g-3" style={{ marginTop: "5%" }}>
        {/* Min input */}
        <div className="col-6 position-relative">
          <label
            className="form-label"
            style={{ color: "black", fontFamily: "Poppins" }}
          >
            Min {label}
          </label>
          <input
            type="number"
            className="form-control"
            value={range?.min ?? ""}
            onFocus={() => setShowMinDropdown(true)}
            onBlur={() => setTimeout(() => setShowMinDropdown(false), 150)}
            onChange={(e) => handleInputChange(e, "min")}
          />
          {showMinDropdown && (
            <div className="dropdown-scroll">
              {scale.map((val) => (
                <div
                  key={val}
                  style={{ color: "black" }}
                  className="dropdown-item"
                  onClick={() => {
                    const newMin = val;
                    const newMax =
                      range.max && val > range.max ? null : range.max;
                    const newRange = { min: newMin, max: newMax };
                    setRange(newRange);
                    setSliderValue([newMin, newMax ?? maxScale]);
                    setShowMinDropdown(false);
                  }}
                >
                  {formatValue(val)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Max input */}
        <div className="col-6 position-relative">
          <label
            className="form-label"
            style={{ color: "black", fontFamily: "Poppins" }}
          >
            Max {label}
          </label>
          <input
            type="number"
            className="form-control"
            value={range?.max ?? ""}
            onFocus={() => setShowMaxDropdown(true)}
            onBlur={() => setTimeout(() => setShowMaxDropdown(false), 150)}
            onChange={(e) => handleInputChange(e, "max")}
          />
          {showMaxDropdown && (
            <div className="dropdown-scroll">
              {scale.map((val) => (
                <div
                  style={{ color: "black" }}
                  key={val}
                  className="dropdown-item"
                  onClick={() => {
                    const newMax = val;
                    const newMin =
                      range.min && val < range.min ? null : range.min;
                    const newRange = { min: newMin, max: newMax };
                    setRange(newRange);
                    setSliderValue([newMin ?? minScale, newMax]);
                    setShowMaxDropdown(false);
                  }}
                >
                  {formatValue(val)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-end mt-3 d-flex justify-content-between">
        <button
          className="btn"
          onClick={() => {
            // Reset to full range
            setRange({ min: minScale, max: maxScale });
            setRangeDisplay(
              `${formatValue(minScale)} - ${formatValue(maxScale)}`
            );
            setPos([0, Math.max(0, scale.length - 1)]); // reset slider handles
          }}
          style={{
            // backgroundColor: "#DBDBDB",
            color: "black",
            fontFamily: "Poppins",
            borderRadius: 30,
            padding: 16,
            fontSize: 14,
                border: "1px solid var(--Grey-3, #DBDBDB)", // ✅ Added border

          }}
        >
          Clear
        </button>
        <button
          className="btn"
          onClick={handleApply}
          style={{
            backgroundColor: "#F4980E",
            color: "white",
            fontFamily: "Poppins",
            borderRadius: 30,
            padding: 16,
            fontSize: 14,
          }}
        >
          Apply
        </button>
      </div>

      <style jsx>{`
        .dropdown-scroll {
          position: absolute;
          background: white;
          border: 1px solid #ccc;
          max-height: 150px;
          overflow-y: auto;
          z-index: 1000;
          width: 100%;
        }
        .dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background: #f1f1f1;
        }
      `}</style>
    </div>
  );
};

export default RangeSliderModal;
