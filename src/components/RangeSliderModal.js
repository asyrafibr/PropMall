import React, { useEffect, useMemo, useState } from "react";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import { debounce } from "lodash";

const RangeSliderModal = ({
  label = "Price",
  scale = [],
  range = {},
  setRange,
  setRangeDisplay,
  handleSearch,
  setOpenDropdown,
}) => {
  const [showMinDropdown, setShowMinDropdown] = useState(false);
  const [showMaxDropdown, setShowMaxDropdown] = useState(false);

  const minScale = scale[0];
  const maxScale = scale[scale.length - 1];
  const [sliderValue, setSliderValue] = useState([minScale, maxScale]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const min = range?.min ?? minScale;
    const max = range?.max ?? maxScale;
    setSliderValue([min, max]);
  }, [range, minScale, maxScale]);

  const formatValue = (val) => {
    if (label === "Price") return `RM ${val.toLocaleString()}`;
    return `${val}`;
  };

  const debouncedSetRange = useMemo(
    () =>
      debounce((val) => {
        setRange({ min: val[0], max: val[1] });
      }, 20),
    [setRange]
  );

  const handleSliderChange = (val) => {
    setSliderValue(val);
    debouncedSetRange(val);
  };

  const handleInputChange = (e, type) => {
    const val = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    if (isNaN(val) && val !== "") return;

    const newRange = {
      ...range,
      [type]: val,
    };

    setRange(newRange);
    setSliderValue([
      newRange.min ?? minScale,
      newRange.max ?? maxScale,
    ]);
  };

  const handleApply = () => {
    const min = range?.min ?? "";
    const max = range?.max ?? "";
    const display = `${formatValue(min)} - ${formatValue(max)}`;
    setRangeDisplay(display);
    setOpenDropdown(null);
    // handleSearch(); // optional
  };

  const sliderMarks = useMemo(
    () => ({
      [minScale]: formatValue(minScale),
      [maxScale]: formatValue(maxScale),
    }),
    [minScale, maxScale]
  );

  const handleRender = (node, { value, dragging }) => {
    if (!isClient) return node;
    return (
      <Tooltip
        prefixCls="rc-tooltip"
        overlay={formatValue(value)}
        visible={dragging}
        placement="top"
        key={value}
      >
        {node}
      </Tooltip>
    );
  };

  return (
    <div className="range-modal">
      <div className="my-4 px-2">
        {isClient && (
          <Slider
            range
            min={minScale}
            max={maxScale}
            step={1}
            value={sliderValue}
            onChange={handleSliderChange}
            marks={sliderMarks}
            allowCross={false}
            handleRender={handleRender}
          />
        )}
      </div>

      <div className="row g-3">
        <div className="col-6 position-relative">
          <label className="form-label">Min {label}</label>
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
                  className="dropdown-item"
                  onClick={() => {
                    const newMin = val;
                    const newMax = range.max && val > range.max ? null : range.max;
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

        <div className="col-6 position-relative">
          <label className="form-label">Max {label}</label>
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
                  key={val}
                  className="dropdown-item"
                  onClick={() => {
                    const newMax = val;
                    const newMin = range.min && val < range.min ? null : range.min;
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

      <div className="text-end mt-3">
        <button className="btn btn-primary" onClick={handleApply}>
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
