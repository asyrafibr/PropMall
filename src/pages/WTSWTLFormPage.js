import React, { useState, useEffect } from "react";
import { getLocationTree } from "../api/axiosApi";

const PropertyRequestForm = () => {
  const [purpose, setPurpose] = useState("buy");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [stateLocation, setStateLocation] = useState("");
  const [address, setAddress] = useState("");
  const [wazeLocation, setWazeLocation] = useState("");
  const [category, setCategory] = useState("");
  const [ownProperty, setOwnProperty] = useState(null);
  const [planToSell, setPlanToSell] = useState(null);
  const [helpWithSelling, setHelpWithSelling] = useState(false);
  const [landType, setLandType] = useState("");
  const [highriseType, setHighriseType] = useState("");
  const [commercialType, setCommercialType] = useState("");
  const [floorCount, setFloorCount] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [landArea, setLandArea] = useState("");
  const [builtUpArea, setBuiltUpArea] = useState("");
  const [landLotType, setLandLotType] = useState("");
  const [landStatuses, setLandStatuses] = useState([]); // array of selected checkboxes
  const [otherCategory, setOtherCategory] = useState("");
  const [location, setLocation] = useState([]);
  const [domain, setDomain] = useState({});
  const [locationTree, setLocationTree] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "12px",
    width: "100%",
    fontFamily: "Poppins",
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "12px",
    fontFamily: "Poppins",
  };

  const labelTextStyle = {
    width: "200px",
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: "12px",
    flexShrink: 0,
  };

  const colonStyle = {
    padding: "0 12px",
    width: "12px",
    textAlign: "center",
    fontFamily: "Poppins",
  };

  const labelWrapper = (text) => (
    <>
      <span style={labelTextStyle}>{text}</span>
      <span style={colonStyle}>:</span>
    </>
  );

  useEffect(() => {
    const fetchFilterData = async () => {
      const url_fe = window.location.href;
      try {
        const res = await getLocationTree({ domain, url_fe, id_country: 1 });
        setLocation(res.data.country);
        setLocationTree(res.data.country); // ✅ ensure locationTree is set
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setIsLoading(false); // ✅ done loading
      }
    };
    fetchFilterData();
  }, []);

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedStateId(stateId);
    setSelectedAreaId("");

    const stateObj = locationTree?.child_list?.find(
      (s) => String(s.id) === String(stateId)
    );
    if (stateObj?.child_list) {
      setAreas(stateObj.child_list);
    } else {
      setAreas([]);
    }
  };
  if (isLoading) {
    return (
      <>
        {/* ✅ Spinner keyframes in a <style> tag */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>

        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading property form...</p>
        </div>
      </>
    );
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Poppins",
        background: "#F7F4F0",
        paddingTop: "40px",
      }}
    >
      <div
        style={{
          width: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
          padding: "16px 24px 24px 24px",
          fontFamily: "Poppins",
        }}
      >
        <div style={{ fontWeight: "600", fontSize: "18px" }}>
          Property Request Form
        </div>

        <div
          style={{
            padding: "24px",
            background: "#FAFAFA",
            border: "1px solid #DBDBDB",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            width: "100%",
            fontFamily: "Poppins",
          }}
        >
          {/* Purpose */}
          <div style={rowStyle}>
            {labelWrapper("*Purpose/ Objective")}
            <div style={{ display: "flex", gap: "12px", width: "100%" }}>
              <button
                onClick={() => setPurpose("buy")}
                style={{
                  ...inputStyle,
                  width: "50%",
                  backgroundColor: purpose === "buy" ? "#F4980E" : "#fff",
                  color: purpose === "buy" ? "#FFF" : "#737373",
                }}
              >
                For Sale (WTS)
              </button>
              <button
                onClick={() => setPurpose("rent")}
                style={{
                  ...inputStyle,
                  width: "50%",
                  backgroundColor: purpose === "rent" ? "#F4980E" : "#fff",
                  color: purpose === "rent" ? "#FFF" : "#737373",
                }}
              >
                For Rent (WTL)
              </button>
            </div>
          </div>

          {/* Name */}
          <div style={rowStyle}>
            {labelWrapper("*Name")}
            <input
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Phone + Email */}
          <div style={rowStyle}>
            {labelWrapper("*Phone Number")}
            <input
              style={{ ...inputStyle, width: "50%" }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {labelWrapper("*Email")}

            <input
              style={{ ...inputStyle, width: "50%" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Location State */}
     
          <div style={{ display: "flex", gap: "20px", width: "100%" }}>
            <div style={rowStyle}>
              {labelWrapper("*Location State")}
              <select
                value={selectedStateId}
                onChange={handleStateChange}
                style={inputStyle}
              >
                <option value="">[Please select a State]</option>
                {locationTree?.child_list?.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Area Select */}
            <div style={rowStyle}>
              {labelWrapper("*Location Area")}
              <select
                value={selectedAreaId}
                onChange={(e) => setSelectedAreaId(e.target.value)}
                disabled={!areas.length}
                style={inputStyle}
              >
                <option value="">
                  {selectedStateId
                    ? "[Please select an Area]"
                    : "[Please select a State first]"}
                </option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Address */}
          <div style={rowStyle}>
            {labelWrapper("*Address")}
            <textarea
              style={{ ...inputStyle, height: "60px" }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Google/Waze */}
          <div style={rowStyle}>
            {labelWrapper("Google/ Waze Location")}
            <div style={{ width: "100%" }}>
              <input
                style={inputStyle}
                value={wazeLocation}
                onChange={(e) => setWazeLocation(e.target.value)}
              />
              <p style={{ fontSize: "8px", color: "#777", marginTop: "4px" }}>
                *Key in Google/ Waze Pin Location (if any)
              </p>
            </div>
          </div>

          {/* Property Category */}
          <div style={rowStyle}>
            {labelWrapper("*Property Category")}
            <select
              style={inputStyle}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">[Please select a property category]</option>
              <option value="Landed">Landed</option>
              <option value="Highrise">Highrise</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
            </select>
          </div>

          {/* Own property */}
          <div style={rowStyle}>
            {labelWrapper("*Do you own this property?")}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setOwnProperty("yes")}
                style={{
                  ...inputStyle,
                  width: "400px",
                  backgroundColor: ownProperty === "yes" ? "#F4980E" : "#fff",
                  color: ownProperty === "yes" ? "#fff" : "#737373",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setOwnProperty("no")}
                style={{
                  ...inputStyle,
                  width: "400px",
                  backgroundColor: ownProperty === "no" ? "#F4980E" : "#fff",
                  color: ownProperty === "no" ? "#fff" : "#737373",
                }}
              >
                No
              </button>
            </div>
          </div>
          {category === "Landed" && (
            <>
              <div style={rowStyle}>
                {labelWrapper("Please choose type of land")}
                <select
                  value={landType}
                  onChange={(e) => setLandType(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">[Select land type]</option>
                  <option value="Terrace">Terrace</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Semi Detached">Semi Detached</option>
                  <option value="Bungalow">Bungalow</option>
                </select>
              </div>

              <div style={rowStyle}>
                {labelWrapper("How Many Floor")}
                <select
                  value={floorCount}
                  onChange={(e) => setFloorCount(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">[Select floor count]</option>
                  {[1, 2, 3, 4, 5].map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div style={rowStyle}>
                {labelWrapper("How Many Bedroom(s)")}
                <input
                  type="number"
                  value={bedroom}
                  onChange={(e) => setBedroom(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. 3"
                />
              </div>

              <div style={rowStyle}>
                {labelWrapper("How Many Bathroom(s)")}
                <input
                  type="number"
                  value={bathroom}
                  onChange={(e) => setBathroom(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. 2"
                />
              </div>

              <div style={rowStyle}>
                {labelWrapper("Land Area (0 if unknown)")}
                <input
                  type="number"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. 1500"
                />
              </div>

              <div style={rowStyle}>
                {labelWrapper("Built Up Area (0 if unknown)")}
                <input
                  type="number"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. 1200"
                />
              </div>
            </>
          )}

          {/* --- Highrise Type --- */}
          {category === "Highrise" && (
            <>
              <div style={rowStyle}>
                {labelWrapper("Please choose type of high rise")}
                <select
                  value={highriseType}
                  onChange={(e) => setHighriseType(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">[Select highrise type]</option>
                  <option value="Flat">Flat</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Condominium">Condominium</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Studio (SOHO/SOFO/SOVO)">
                    Studio (SOHO/SOFO/SOVO)
                  </option>
                </select>
              </div>

              <div style={rowStyle}>
                {labelWrapper("How Many Bedroom(s)")}
                <input
                  type="number"
                  value={bedroom}
                  onChange={(e) => setBedroom(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. 2"
                />
              </div>

              <div style={rowStyle}>
                {labelWrapper("How Many Bathroom(s)")}
                <input
                  type="number"
                  value={bathroom}
                  onChange={(e) => setBathroom(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. 1"
                />
              </div>

              <div style={rowStyle}>
                {labelWrapper("Land Area (0 if unknown)")}
                <input
                  type="number"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. 850"
                />
              </div>
            </>
          )}

          {/* --- Commercial Type --- */}
          {category === "Commercial" && (
            <div style={rowStyle}>
              {labelWrapper("Please choose type of commercial")}
              <select
                value={commercialType}
                onChange={(e) => setCommercialType(e.target.value)}
                style={inputStyle}
              >
                <option value="">[Select commercial type]</option>
                <option value="Shop Lot">Shop Lot</option>
                <option value="Shop House">Shop House</option>
                <option value="Office Space">Office Space</option>
                <option value="WareHouse">Warehouse</option>
                <option value="Factory">Factory</option>
                <option value="Hotel">Hotel</option>
                <option value="En bloc building">En bloc building</option>
              </select>
            </div>
          )}
          {category === "Land" && (
            <>
              <div style={rowStyle}>
                {labelWrapper("Please choose type of land")}
                <select
                  value={landLotType}
                  onChange={(e) => setLandLotType(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">[Select land type]</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Building">Building</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Don't know">Don't know</option>
                </select>
              </div>

              <div style={rowStyle}>
                {labelWrapper("Land Status")}
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {["Lot NonBumi", "Lot Bumi", "Malay Reserve"].map(
                    (status) => (
                      <label
                        key={status}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={landStatuses.includes(status)}
                          onChange={() => {
                            if (landStatuses.includes(status)) {
                              setLandStatuses(
                                landStatuses.filter((s) => s !== status)
                              );
                            } else {
                              setLandStatuses([...landStatuses, status]);
                            }
                          }}
                        />
                        {status}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div style={rowStyle}>
                {labelWrapper("Land Area")}
                <input
                  type="number"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter land area (0 if unknown)"
                />
              </div>
            </>
          )}
          {category === "Others" && (
            <div style={rowStyle}>
              {labelWrapper("Others")}
              <input
                type="text"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                style={inputStyle}
                placeholder="Please specify"
              />
            </div>
          )}
          {/* Plan to sell */}
          <div style={rowStyle}>
            {labelWrapper("*Are you planning to sell this property soon?")}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setPlanToSell("yes")}
                style={{
                  ...inputStyle,
                  width: "400px",
                  backgroundColor: planToSell === "yes" ? "#F4980E" : "#fff",
                  color: planToSell === "yes" ? "#fff" : "#737373",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setPlanToSell("no")}
                style={{
                  ...inputStyle,
                  width: "400px",
                  backgroundColor: planToSell === "no" ? "#F4980E" : "#fff",
                  color: planToSell === "no" ? "#fff" : "#737373",
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>

        {/* Help with Selling */}
        <div
          style={{
            backgroundColor: "#FAFAFA",
            border: "1px solid var(--Grey-3, #DBDBDB)",
            display: "flex",
            width: "1150px",
            padding: "16px 24px 24px 24px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "24px",
            borderRadius: "6px",
            fontFamily: "Poppins",
          }}
        >
          <div style={{ fontWeight: "600" }}>Help with selling my property</div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "12px",
              fontFamily: "Poppins",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={helpWithSelling}
              onChange={(e) => setHelpWithSelling(e.target.checked)}
              style={{ display: "none" }} // hide the default checkbox
              id="custom-checkbox"
            />
            <span
              style={{
                width: "18px",
                height: "18px",
                border: "2px solid #ccc",
                borderRadius: "4px",
                backgroundColor: helpWithSelling ? "#F4980E" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "10px",
                transition: "all 0.2s ease",
              }}
            >
              {helpWithSelling ? "✓" : ""}
            </span>
            I agree to let property agents contact me to help sell my property.
          </label>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: "right", width: "100%" }}>
          <button
            style={{
              backgroundColor: "#F4980E",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "6px",
              border: "none",
              fontWeight: "600",
              fontFamily: "Poppins",
            }}
          >
            Submit Now
          </button>
        </div>
      </div>
    </div>
  );
};
const styles = {
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#fafafa",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "6px solid #ddd",
    borderTop: "6px solid #F4980E",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "16px",
    fontSize: "14px",
    fontFamily: "Poppins",
    color: "#555",
  },
};
export default PropertyRequestForm;
