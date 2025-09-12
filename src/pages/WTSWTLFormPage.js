import React, { useState, useEffect, useCallback } from "react";
import { getLocationTree, getSubmitSell, getSubmitLet } from "../api/axiosApi";
import { useTemplate } from "../context/TemplateContext";
import './WTSWTLFormPage.css'
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
  const { mainAgent } = useTemplate();
const [status, setStatus] = useState(null); 
  const [isLoading2, setIsLoading2] = useState(false);
const [isSuccess, setIsSuccess] = useState(null); // null | true | false



const labelWrapper = (text) => (
  <>
    <span className="label-text">{text}</span>
    <span className="label-colon">:</span>
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
const handleViewDetails = useCallback(async () => {
  const url_fe = window.location.href;
  setIsLoading(true);
  setIsSuccess(null);

  try {
    const payload = {
      domain: mainAgent.name,
      url_fe: url_fe,
      id_country: 1,
      [purpose === "buy" ? "want_to_sell" : "want_to_let"]: {
        leads_objective: purpose === "buy" ? "WTS" : "WTL",
        leads_name: name,
        leads_phone: phone,
        leads_email: email,
        leads_ownership_testimony: ownProperty,
        property_address: address,
        property_location_map_url: wazeLocation,
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
        leads_ownership_testimony: "YES",
        property_asking_price: 700000,
        leads_divest_soon: "YES",
        leads_agree_agent_assist: helpWithSelling === true ? "YES" : "NO",
      },
    };

    if (purpose === "buy") {
      const response = await getSubmitSell(payload);
      console.log("✅ Success Sell:", response.data);
    } else {
      const response = await getSubmitLet(payload);
      console.log("✅ Success Let:", response.data);
    }

    setIsSuccess(true);
  } catch (err) {
    console.error("❌ Error submitting form:", err);
    setIsSuccess(false);
  } finally {
    setIsLoading(false);
  }
}, [
  name,
  phone,
  email,
  selectedStateId,
  category,
  landType,
  otherCategory,
  floorCount,
  bedroom,
  bathroom,
  builtUpArea,
  landArea,
  landLotType,
]);
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
    <div className="loading-container">
      <div className="spinner-border custom-spinner text-warning" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="loading-text">Loading property form...</p>
    </div>
  );
}

if (isLoading2) {
  return (
    <div className="loading-container">
      <div className="spinner-border custom-spinner text-warning" role="status">
        <span className="visually-hidden">Submitting...</span>
      </div>
      <p className="loading-text">Submitting form...</p>
    </div>
  );
}

if (isSuccess === true) {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center gap-3">
      <span className="fs-1 text-success">✔</span>
      <p className="text-success fw-semibold fs-5 mb-0">
        Form successfully submitted!
      </p>
    </div>
  );
}

if (isSuccess === false) {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center gap-3">
      <span className="fs-1 text-danger">✘</span>
      <p className="text-danger fw-semibold fs-5 mb-0">
        Form submission failed. Please try again.
      </p>
    </div>
  );
}


  return (
   <div className="min-vh-100 bg-light">
  <div className="container py-2">
    <div className="d-flex flex-column align-items-start gap-4">
      {/* Heading */}
      <div className="fw-semibold fs-5">Property Request Form</div>

      {/* Form Wrapper */}
      <div className="p-4 bg-white border rounded d-flex flex-column gap-4 w-100">
        {/* Purpose */}
        <div className="row g-3 w-100">
          <div className="col-12">
            {labelWrapper("*Purpose/ Objective")}
            <div className="d-flex gap-2 w-100">
              <button
                onClick={() => setPurpose("buy")}
                className={`btn w-50 ${
                  purpose === "buy"
                    ? "btn-warning text-white"
                    : "btn-outline-secondary"
                }`}
              >
                For Sale (WTS)
              </button>
              <button
                onClick={() => setPurpose("rent")}
                className={`btn w-50 ${
                  purpose === "rent"
                    ? "btn-warning text-white"
                    : "btn-outline-secondary"
                }`}
              >
                For Rent (WTL)
              </button>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="row g-3 w-100">
          <div className="col-12">
            {labelWrapper("*Name")}
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Phone + Email */}
        <div className="row g-3 w-100">
          <div className="col-md-6">
            {labelWrapper("*Phone Number")}
            <input
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            {labelWrapper("*Email")}
            <input
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="row g-3 w-100">
          <div className="col-md-6">
            {labelWrapper("*Location State")}
            <select
              value={selectedStateId}
              onChange={handleStateChange}
              className="form-select"
            >
              <option value="">[Please select a State]</option>
              {locationTree?.child_list?.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            {labelWrapper("*Location Area")}
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              disabled={!areas.length}
              className="form-select"
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
        <div>
          {labelWrapper("*Address")}
          <textarea
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows="3"
          />
        </div>

        {/* Google/Waze */}
        <div>
          {labelWrapper("Google/ Waze Location")}
          <input
            className="form-control"
            value={wazeLocation}
            onChange={(e) => setWazeLocation(e.target.value)}
          />
          <p className="small text-muted mt-1">
            *Key in Google/ Waze Pin Location (if any)
          </p>
        </div>

        {/* Category */}
        <div>
          {labelWrapper("*Property Category")}
          <select
            className="form-select"
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

        {/* Own Property */}
        <div>
          {labelWrapper("*Do you own this property?")}
          <div className="d-flex gap-2 flex-wrap">
            <button
              onClick={() => setOwnProperty("yes")}
              className={`btn w-100 w-md-50 ${
                ownProperty === "yes"
                  ? "btn-warning text-white"
                  : "btn-outline-secondary"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setOwnProperty("no")}
              className={`btn w-100 w-md-50 ${
                ownProperty === "no"
                  ? "btn-warning text-white"
                  : "btn-outline-secondary"
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Help with Selling */}
        <div className="bg-white border rounded p-4 w-100">
          <div className="fw-semibold mb-2">Help with selling my property</div>
          <div className="form-check">
            <input
              type="checkbox"
              id="helpWithSelling"
              className="form-check-input"
              checked={helpWithSelling}
              onChange={(e) => setHelpWithSelling(e.target.checked)}
            />
            <label
              className="form-check-label small"
              htmlFor="helpWithSelling"
            >
              I agree to let property agents contact me to help sell my
              property.
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="text-end w-100">
          <button
            className="btn btn-warning text-white fw-semibold px-4 py-2"
            onClick={handleViewDetails}
          >
            Submit Now
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default PropertyRequestForm;
