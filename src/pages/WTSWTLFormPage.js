import React, { useState, useEffect, useCallback } from "react";
import { getLocationTree, getSubmitSell, getSubmitLet } from "../api/axiosApi";
import { useTemplate } from "../context/TemplateContext";
import "./WTSWTLFormPage.css";
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
  const handleSubmit = useCallback(async () => {
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
        <div
          className="spinner-border custom-spinner text-warning"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="loading-text">Loading property form...</p>
      </div>
    );
  }

  if (isLoading2) {
    return (
      <div className="loading-container">
        <div
          className="spinner-border custom-spinner text-warning"
          role="status"
        >
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
    <div className="container my-5">
  <h3 className="fw-bold mb-5">Property Request Form</h3>
  <div className="card p-4 shadow-sm">
    
    {/* Purpose */}
    <div className="row mb-3 align-items-center">
      <label className="col-sm-4 col-form-label fw-semibold">*Purpose / Objective</label>
   <div className="col-sm-8 d-flex gap-2">
  <button
    type="button"
    className={`btn flex-fill ${purpose === "buy" ? "btn-warning text-white" : "btn-outline-secondary"}`}
    onClick={() => setPurpose("buy")}
  >
    To Buy (WTB)
  </button>
  <button
    type="button"
    className={`btn flex-fill ${purpose === "rent" ? "btn-warning text-white" : "btn-outline-secondary"}`}
    onClick={() => setPurpose("rent")}
  >
    To Rent (WTR)
  </button>
</div>

    </div>

    {/* Name */}
    <div className="row mb-3 align-items-center">
      <label className="col-sm-4 col-form-label fw-semibold">*Name</label>
      <div className="col-sm-8">
        <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </div>

    {/* Phone */}
    <div className="row mb-3 align-items-center">
      <label className="col-sm-4 col-form-label fw-semibold">*Phone Number</label>
      <div className="col-sm-8">
        <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
    </div>

    {/* Email */}
    <div className="row mb-3 align-items-center">
      <label className="col-sm-4 col-form-label fw-semibold">*Email</label>
      <div className="col-sm-8">
        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
    </div>

    {/* Location State */}
    <div className="row mb-3 align-items-center">
      <label className="col-sm-4 col-form-label fw-semibold">*Location State</label>
      <div className="col-sm-8">
        <select className="form-select" value={selectedStateId} onChange={handleStateChange}>
          <option value="">[Please select a State]</option>
          {locationTree?.child_list?.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Location Area */}
    <div className="row mb-3 align-items-center">
      <label className="col-sm-4 col-form-label fw-semibold">*Location Area</label>
      <div className="col-sm-8">
        <select
          className="form-select"
          value={selectedAreaId}
          onChange={(e) => setSelectedAreaId(e.target.value)}
          disabled={!areas.length}
        >
          <option value="">
            {selectedStateId ? "[Please select an Area]" : "[Please select a State first]"}
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
    <div className="row mb-3 align-items-center">
      <label className="col-sm-4 col-form-label fw-semibold">*Address</label>
      <div className="col-sm-8">
        <textarea
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows="3"
        />
      </div>
    </div>

    {/* Google/Waze */}
    <div className="row mb-3 align-items-center">
      <label className="col-sm-4 col-form-label fw-semibold">Google/ Waze Location</label>
      <div className="col-sm-8">
        <input
          type="text"
          className="form-control"
          value={wazeLocation}
          onChange={(e) => setWazeLocation(e.target.value)}
        />
        <p className="small text-muted mt-1">*Key in Google/ Waze Pin Location (if any)</p>
      </div>
    </div>   

        {/* Property Category */}
        {/* --- Property Category --- */}
        <div className="row mb-4 align-items-center">
          <label className="col-sm-4 col-form-label fw-semibold">
            *Property Category
          </label>
          <div className="col-sm-8">
            <select
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setLandType("");
                setHighriseType("");
                setCommercialType("");
                setLandLotType("");
              }}
            >
              <option value="">[Please select a property category]</option>
              <option value="Landed (Terrace/ Semi-D/ Bungalow)">Landed</option>
              <option value="Highrise (Flat/ Apartment/ Condominium)">
                Highrise
              </option>
              <option value="Commercial (Shoplot/ Building/ Hotel)">
                Commercial
              </option>
              <option value="Land (Vacant Lot/ Plantation/ Farm)">Land</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        {/* --- Landed --- */}
        {category === "Landed (Terrace/ Semi-D/ Bungalow)" && (
          <>
            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">Type of Landed</label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  value={landType}
                  onChange={(e) => setLandType(e.target.value)}
                >
                  <option value="">[Select land type]</option>
                  <option value="Terrace">Terrace</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Semi Detached">Semi Detached</option>
                  <option value="Bungalow">Bungalow</option>
                </select>
              </div>
            </div>

            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">How Many Floor</label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  value={floorCount}
                  onChange={(e) => setFloorCount(e.target.value)}
                >
                  <option value="">[Select floor count]</option>
                  {[1, 2, 3, 4, 5].map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">
                How Many Bedroom(s)
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  value={bedroom}
                  onChange={(e) => setBedroom(e.target.value)}
                  placeholder="e.g. 3"
                />
              </div>
            </div>

            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">
                How Many Bathroom(s)
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  value={bathroom}
                  onChange={(e) => setBathroom(e.target.value)}
                  placeholder="e.g. 2"
                />
              </div>
            </div>

            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">
                Land Area (0 if unknown)
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="e.g. 1500"
                />
              </div>
            </div>

            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">
                Built Up Area (0 if unknown)
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(e.target.value)}
                  placeholder="e.g. 1200"
                />
              </div>
            </div>
          </>
        )}

        {/* --- Highrise --- */}
        {category === "Highrise (Flat/ Apartment/ Condominium)" && (
          <>
            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">
                Type of Highrise
              </label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  value={highriseType}
                  onChange={(e) => setHighriseType(e.target.value)}
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
            </div>

            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">
                How Many Bedroom(s)
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  value={bedroom}
                  onChange={(e) => setBedroom(e.target.value)}
                  placeholder="e.g. 2"
                />
              </div>
            </div>

            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">
                How Many Bathroom(s)
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  value={bathroom}
                  onChange={(e) => setBathroom(e.target.value)}
                  placeholder="e.g. 1"
                />
              </div>
            </div>

            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">
                Land Area (0 if unknown)
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="e.g. 850"
                />
              </div>
            </div>
          </>
        )}

        {/* --- Commercial --- */}
        {category === "Commercial (Shoplot/ Building/ Hotel)" && (
          <div className="row mb-4 align-items-center">
            <label className="col-sm-4 col-form-label">
              Type of Commercial
            </label>
            <div className="col-sm-8">
              <select
                className="form-select"
                value={commercialType}
                onChange={(e) => setCommercialType(e.target.value)}
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
          </div>
        )}

        {/* --- Land --- */}
        {category === "Land (Vacant Lot/ Plantation/ Farm)" && (
          <>
            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">Type of Land</label>
              <div className="col-sm-8">
                <select
                  className="form-select"
                  value={landLotType}
                  onChange={(e) => setLandLotType(e.target.value)}
                >
                  <option value="">[Select land type]</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Building">Building</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Don't know">Don't know</option>
                </select>
              </div>
            </div>

            <div className="row mb-4">
              <label className="col-sm-4 col-form-label">Land Status</label>
              <div className="col-sm-8 d-flex flex-wrap gap-3">
                {["Lot NonBumi", "Lot Bumi", "Malay Reserve"].map((status) => (
                  <div className="form-check" key={status}>
                    <input
                      type="checkbox"
                      className="form-check-input"
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
                      id={status}
                    />
                    <label className="form-check-label" htmlFor={status}>
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row mb-4 align-items-center">
              <label className="col-sm-4 col-form-label">Land Area</label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="Enter land area (0 if unknown)"
                />
              </div>
            </div>
          </>
        )}

        {/* --- Others --- */}
        {category === "Others" && (
          <div className="row mb-4 align-items-center">
            <label className="col-sm-4 col-form-label">Others</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
                placeholder="Please specify"
              />
            </div>
          </div>
        )}
    {/* Own Property */}
    <div className="row mb-3 align-items-center">
      <label className="col-sm-4 col-form-label fw-semibold">*Do you own this property?</label>
      <div className="col-sm-8 d-flex gap-2">
        <button
          type="button"
          className={`btn ${ownProperty === "yes" ? "btn-warning text-white" : "btn-outline-secondary"}`}
          onClick={() => setOwnProperty("yes")}
        >
          Yes
        </button>
        <button
          type="button"
          className={`btn ${ownProperty === "no" ? "btn-warning text-white" : "btn-outline-secondary"}`}
          onClick={() => setOwnProperty("no")}
        >
          No
        </button>
      </div>
    </div>

    {/* Help with Selling */}
    <div className="row mb-3">
      <div className="col-sm-12">
        <div className="form-check">
          <input
            type="checkbox"
            id="helpWithSelling"
            className="form-check-input"
            checked={helpWithSelling}
            onChange={(e) => setHelpWithSelling(e.target.checked)}
          />
          <label className="form-check-label small" htmlFor="helpWithSelling">
            I agree to let property agents contact me to help sell my property.
          </label>
        </div>
      </div>
    </div>

    {/* Submit */}
    <div className="text-end">
      <button className="btn btn-warning text-white fw-semibold px-4 py-2" onClick={handleSubmit}>
        Submit Now
      </button>
    </div>
  </div>
</div>


  );
};

export default PropertyRequestForm;
