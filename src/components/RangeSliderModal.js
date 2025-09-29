import React, { useEffect, useMemo, useState } from "react";
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
  setRangeDisplay,
  setOpenModalLabel,
  setRange, // temp state
  commitRange,
}) => {
  const [showMinDropdown, setShowMinDropdown] = useState(false);
  const [showMaxDropdown, setShowMaxDropdown] = useState(false);
  const [sliderValue, setSliderValue] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const minScale = scale[0];
  const maxScale = scale[scale.length - 1];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!scale.length) return;

    const minVal = range?.min ?? minScale;
    const maxVal = range?.max ?? maxScale;

    // map actual values to their closest index in scale
    const minIndex = nearestIndex(scale, minVal);
    const maxIndex = nearestIndex(scale, maxVal);

    if (sliderValue[0] !== minIndex || sliderValue[1] !== maxIndex) {
      setSliderValue([minIndex, maxIndex]);
    }
  }, [range, minScale, maxScale, scale]);
  useEffect(() => {
    // when component first mounts
    if (isFirstLoad) {
      setRange({ min: minScale, max: maxScale });
      setSliderValue([minScale, maxScale]);
      setRangeDisplay(`${minScale} - ${maxScale}`);
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, minScale, maxScale, setRange, setRangeDisplay]);
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
  const formatValue = (val) => {
    if (label === "Price Ranges (RM)") return `RM ${val.toLocaleString()}`;
    return `${val}`;
  };

  const handleApply = () => {
    if (!range?.min && !range?.max) {
      setRangeDisplay(label); // fallback to label text
      commitRange({ min: null, max: null });
    } else {
      commitRange(range);

      if (label === "Price Ranges (RM)") {
        setRangeDisplay(
          `RM ${range.min ?? minScale} - RM ${range.max ?? maxScale}`
        );
      } else {
        setRangeDisplay(`${range.min ?? minScale} - ${range.max ?? maxScale}`);
      }
    }

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

  const [pos, setPos] = useState([0, Math.max(0, scale.length - 1)]);

  useEffect(() => {
    if (!scale?.length) return;
    const minV = range?.min ?? scale[0];
    const maxV = range?.max ?? scale[scale.length - 1];
    const next = [nearestIndex(scale, minV), nearestIndex(scale, maxV)];
    if (pos[0] !== next[0] || pos[1] !== next[1]) setPos(next);
  }, [range, scale]);

const handleRender = (node, { value, dragging }) => {
  let formatted;

  if (label === "Price Ranges (RM)") {
    // show with RM
    formatted = `RM ${scale[value].toLocaleString("en-MY", {
      maximumFractionDigits: 0,
    })}`;
  } else {
    // numbers only
    formatted = scale[value].toLocaleString("en-MY", {
      maximumFractionDigits: 0,
    });
  }

  return (
    <Tooltip
      prefixCls="rc-tooltip"
      overlay={formatted}
      visible={dragging}
      placement="top"
      key={value}
      overlayInnerStyle={{
        backgroundColor: "#F4980E",
        color: "#fff",
        borderRadius: "6px",
        padding: "4px 8px",
      }}
    >
      {node}
    </Tooltip>
  );
};



  const handleSliderChange = (nextPos) => setPos(nextPos);

  const handleAfterChange = (finalPos) => {
    const next = { min: scale[finalPos[0]], max: scale[finalPos[1]] };
    setRange((prev) =>
      prev?.min === next.min && prev?.max === next.max ? prev : next
    );
  };
  return (
    <div className="range-modal">
      {/* Slider */}
      <div className="my-4 px-2">
        {isClient  && (
          <Slider
            range
            min={0}
            max={Math.max(0, scale.length - 1)}
            step={1}
            value={pos}
            onChange={handleSliderChange}
            onAfterChange={handleAfterChange}
            allowCross={false}
            handleRender={handleRender}
            className="custom-slider"
          />
        )}
      </div>

      {/* Inputs */}
      <div className="row g-3 mt-4">
        {/* Min */}
        <div className="col-6 position-relative">
          <label className="form-label fw-semibold text-dark">
            Min {label}
          </label>
          <input
            type="number"
            className="form-control"
            value={
              range?.min === null || range?.min === undefined
                ? "" // empty after Clear
                : range.min
            }
            onFocus={() => setShowMinDropdown(true)}
            onBlur={() => setTimeout(() => setShowMinDropdown(false), 150)}
            onChange={(e) => handleInputChange(e, "min")}
          />
          {showMinDropdown && (
            <ul className="dropdown-menu show w-100 mt-1">
              {scale.map((val) => (
                <li key={val}>
                  <button
                    type="button"
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
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Max */}
        <div className="col-6 position-relative">
          <label className="form-label fw-semibold text-dark">
            Max {label}
          </label>
          <input
            type="number"
            className="form-control"
            value={
              range?.max === null || range?.max === undefined
                ? "" // empty after Clear
                : range.max
            }
            onFocus={() => setShowMaxDropdown(true)}
            onBlur={() => setTimeout(() => setShowMaxDropdown(false), 150)}
            onChange={(e) => handleInputChange(e, "max")}
          />
          {showMaxDropdown && (
            <ul className="dropdown-menu show w-100 mt-1">
              {scale.map((val) => (
                <li key={val}>
                  <button
                    type="button"
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
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-outline-secondary rounded-pill px-4 py-2"
          onClick={() => {
            setRange({ min: null, max: null }); // reset range
            setRangeDisplay(label); // show default label text
            setPos([0, Math.max(0, scale.length - 1)]);
          }}
        >
          Clear
        </button>
        <button
          className="btn btn-warning text-white rounded-pill px-4 py-2"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default RangeSliderModal;
