import React, { useState, useEffect, useCallback } from "react";
import { getLocationTree, getSubmitBuy,getSubmitRent } from "../api/axiosApi";
import { useTemplate } from "../context/TemplateContext";
import axios from "axios";

const PropertyRequestForm = () => {
  const [purpose, setPurpose] = useState("buy");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [stateLocation, setStateLocation] = useState("");
  const [areaLocation, setAreaLocation] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [planToBuy, setPlanToBuy] = useState(null);
  const [landType, setLandType] = useState("");
  const [highriseType, setHighriseType] = useState("");
  const [commercialType, setCommercialType] = useState("");
  const [floorCount, setFloorCount] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [landArea, setLandArea] = useState("");
  const [builtUpArea, setBuiltUpArea] = useState("");
  const [landLotType, setLandLotType] = useState("");
  const [landStatuses, setLandStatuses] = useState([]);
  const [otherCategory, setOtherCategory] = useState("");
  const [location, setLocation] = useState([]);
  const [domain, setDomain] = useState({});
  const [locationTree, setLocationTree] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const { mainAgent } = useTemplate();
const [isSuccess, setIsSuccess] = useState(null); // null | true | false

  // ✅ Loading state
  const [isLoading, setIsLoading] = useState(true);
const [isLoading2, setIsLoading2] = useState(false);

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
    fontSize: "12px",
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    gap: "12px",
  };

  const labelTextStyle = {
    width: "200px",
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: "12px",
    flexShrink: 0,
    textAlign: "left",
  };

  const colonStyle = {
    fontWeight: "500",
    fontSize: "12px",
    padding: "0 12px",
    flexShrink: 0,
    textAlign: "center",
    width: "12px",
    display: "inline-block",
  };

  const labelWrapper = (text) => (
    <>
      <span style={labelTextStyle}>{text}</span>
      <span style={colonStyle}>:</span>
    </>
  );
const handleViewDetails = useCallback(async () => {
  const url_fe = window.location.href;
      setIsLoading(true); // ✅ start loading

  setIsSuccess(null);

  try {

    const payload = {
      domain: mainAgent.name,
      url_fe: url_fe,
      id_country: 1,
      [purpose === "buy" ? "want_to_buy" : "want_to_rent"]: {
        leads_objective: purpose === "buy" ? "WTB" : "WTR",
        leads_name: name,
        leads_phone: phone,
        leads_email: email,
        property_id_country: 1,
        property_id_province: null,
        property_id_state: selectedStateId,
        property_id_city: null,
        property_id_area: selectedAreaId,
        property_category: category,
        property_type: landType,
        property_type_others: otherCategory,
        property_floor: floorCount,
        property_room: bedroom,
        property_bathroom: bathroom,
        property_built_size: builtUpArea,
        property_land_size: landArea,
        property_lot_type: landLotType,
        property_budget_price_min: 800000,  // TODO: make dynamic if needed
        property_budget_price_max: 1000000, // TODO: make dynamic if needed
        leads_acquire_soon: planToBuy,
        leads_agree_agent_assist: "YES",
      },
    };

    let response;
    if (purpose === "buy") {
      response = await getSubmitBuy(payload);
      console.log("✅ Success Buy:", response.data);
    } else {
      response = await getSubmitRent(payload);
      console.log("✅ Success Rent:", response.data);
    }
        setIsSuccess(true);

  } catch (err) {
    console.error("❌ Error submitting form:", err);
  } finally {
    setIsLoading(false); // ✅ stop loading
  }
}, [
  purpose,
  mainAgent?.name,
  name,
  phone,
  email,
  selectedStateId,
  selectedAreaId,
  category,
  landType,
  otherCategory,
  floorCount,
  bedroom,
  bathroom,
  builtUpArea,
  landArea,
  landLotType,
  planToBuy,
]);


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
  if (isLoading2) {
  return (
    <>
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
        <p style={styles.loadingText}>Submitting form...</p>
      </div>
    </>
  );
}

if (isSuccess === true) {
  return (
    <div
      style={{
        minHeight: "100vh",      // take full height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <span style={{ fontSize: "60px", color: "green" }}>✔</span>
      <p style={{ color: "green", fontWeight: "600", fontSize: "20px" }}>
        Form successfully submitted!
      </p>
    </div>
  );
}

if (isSuccess === false) {
  return (
    <div
      style={{
        minHeight: "90vh",      // take full height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <span style={{ fontSize: "60px", color: "red" }}>✘</span>
      <p style={{ color: "red", fontWeight: "600", fontSize: "20px" }}>
        Form submission failed. Please try again.
      </p>
    </div>
  );
}



  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "Poppins",
        marginTop: "60px",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            width: "1120px",
            margin: "40px auto 0 auto",
          }}
        >
          <text
            style={{
              fontWeight: "600",
              marginBottom: "40px",
              fontSize: "18px",
              fontFamily: "Poppins",
            }}
          >
            Property Request Form
          </text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "24px",
              width: "100%",
              padding: "24px",
              background: "#FAFAFA",
              border: "1px solid #DBDBDB",
              borderRadius: "8px",
              paddingTop: 40,
              paddingBottom: 40,
              marginBottom: "40px",
            }}
          >
            {/* Purpose */}
            <div style={rowStyle}>
              {labelWrapper("*Purpose / Objective")}
              <div style={{ display: "flex", gap: "12px", flex: 1 }}>
                <button
                  onClick={() => setPurpose("buy")}
                  style={{
                    flex: 1,
                    backgroundColor: purpose === "buy" ? "#F4980E" : "#fff",
                    color: purpose === "buy" ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "6px",
                  }}
                >
                  To Buy (WTB)
                </button>
                <button
                  onClick={() => setPurpose("rent")}
                  style={{
                    flex: 1,
                    backgroundColor: purpose === "rent" ? "#F4980E" : "#fff",
                    color: purpose === "rent" ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "6px",
                  }}
                >
                  To Rent (WTR)
                </button>
              </div>
            </div>

            {/* Name */}
            <div style={rowStyle}>
              {labelWrapper("*Name")}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Phone + Email */}
            <div style={{ display: "flex", gap: "20px", width: "100%" }}>
              <div style={rowStyle}>
                {labelWrapper("*Phone Number")}
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={rowStyle}>
                {labelWrapper("Email")}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* State + Area */}
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

            {/* Property Category */}
            <div style={rowStyle}>
              {labelWrapper("*Property Category")}
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setType("");
                }}
                style={inputStyle}
              >
                <option value="">[Please select a property category]</option>
                <option value="Landed (Terrace/ Semi-D/ Bungalow)">
                  Landed (Terrace/ Semi-D/ Bungalow)
                </option>
                <option value="Highrise (Flat/ Apartment/ Condominium)">
                  Highrise (Flat/ Apartment/ Condominium)
                </option>
                <option value="Commercial (Shoplot/ Building/ Hotel)">
                  Commercial (Shoplot/ Building/ Hotel)
                </option>
                <option value="Land (Vacant Lot/ Plantation/ Farm)">
                  Land (Vacant Lot/ Plantation/ Farm)
                </option>
                <option value="Others">Others</option>
              </select>
            </div>

            {category === "Landed (Terrace/ Semi-D/ Bungalow)" && (
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
            {category === "Highrise (Flat/ Apartment/ Condominium)" && (
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
            {category === "Commercial (Shoplot/ Building/ Hotel)" && (
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
            {category === "Land (Vacant Lot/ Plantation/ Farm)" && (
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
                  <div
                    style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
                  >
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
            {/* Plan to Buy */}
            <div style={rowStyle}>
              {labelWrapper("*Are you planning to buy the property soon?")}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setPlanToBuy("yes")}
                  style={{
                    width: "345px",
                    backgroundColor: planToBuy === "yes" ? "#F4980E" : "#fff",
                    color: planToBuy === "yes" ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setPlanToBuy("no")}
                  style={{
                    width: "345px",
                    backgroundColor: planToBuy === "no" ? "#F4980E" : "#fff",
                    color: planToBuy === "no" ? "#fff" : "#000",
                    border: "1px solid #ccc",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div
            style={{
              textAlign: "right",
              width: "1120px",
              margin: "0 auto",
              marginTop: "24px",
              marginBottom: "7%",
            }}
          >
            <button
              style={{
                backgroundColor: "#F4980E",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "6px",
                border: "none",
                fontWeight: "600",
              }}
              onClick={handleViewDetails}
            >
              Submit Now
            </button>
          </div>
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
