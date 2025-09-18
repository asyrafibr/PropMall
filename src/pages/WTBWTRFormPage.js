import React, { useState, useEffect, useCallback } from "react";
import { getLocationTree, getSubmitBuy, getSubmitRent } from "../api/axiosApi";
import { useTemplate } from "../context/TemplateContext";

const PropertyRequestForm = () => {
  const [purpose, setPurpose] = useState("buy");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
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
  const [locationTree, setLocationTree] = useState(null);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [planToBuy, setPlanToBuy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);

  const { mainAgent } = useTemplate();

  const handleViewDetails = useCallback(async () => {
    setIsSubmitting(true);
    setIsSuccess(null);

    try {
      const payload = {
        domain: mainAgent?.name,
        url_fe: window.location.href,
        id_country: 1,
        [purpose === "buy" ? "want_to_buy" : "want_to_rent"]: {
          leads_objective: purpose === "buy" ? "WTB" : "WTR",
          leads_name: name,
          leads_phone: phone,
          leads_email: email,
          property_id_country: 1,
          property_id_state: selectedStateId,
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
          leads_acquire_soon: planToBuy,
          leads_agree_agent_assist: "YES",
        },
      };

      if (purpose === "buy") {
        await getSubmitBuy(payload);
      } else {
        await getSubmitRent(payload);
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
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
      try {
        const res = await getLocationTree({
          domain: mainAgent?.name,
          url_fe: window.location.href,
          id_country: 1,
        });
        setLocationTree(res.data.country);
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilterData();
  }, [mainAgent?.name]);

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedStateId(stateId);
    setSelectedAreaId("");
    const stateObj = locationTree?.child_list?.find(
      (s) => String(s.id) === String(stateId)
    );
    setAreas(stateObj?.child_list || []);
  };

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3 text-muted">Loading property form...</p>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="mt-3 text-muted">Submitting form...</p>
      </div>
    );
  }

  if (isSuccess === true) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-success">
        <h1>✔</h1>
        <p className="fw-bold fs-5">Form successfully submitted!</p>
      </div>
    );
  }

  if (isSuccess === false) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-danger">
        <h1>✘</h1>
        <p className="fw-bold fs-5">
          Form submission failed. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h4 className="fw-bold mb-4">Property Request Form</h4>
      <div className="p-4 bg-light border rounded-3">
        {/* Purpose */}
        <div className="row mb-3 align-items-center">
          <label className="col-sm-4 col-form-label fw-semibold">
            *Purpose / Objective
          </label>
          <div className="col-sm-8 d-flex gap-2">
            <button
              type="button"
              className={`btn ${
                purpose === "buy"
                  ? "btn-warning text-white"
                  : "btn-outline-secondary"
              } flex-fill`}
              onClick={() => setPurpose("buy")}
            >
              To Buy (WTB)
            </button>
            <button
              type="button"
              className={`btn ${
                purpose === "rent"
                  ? "btn-warning text-white"
                  : "btn-outline-secondary"
              } flex-fill`}
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
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

    {/* Phone Number */}
<div className="row mb-3 align-items-center">
  <label className="col-sm-4 col-form-label fw-semibold">*Phone Number</label>
  <div className="col-sm-8">
    <input
      type="text"
      className="form-control"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />
  </div>
</div>

{/* Email */}
<div className="row mb-3 align-items-center">
  <label className="col-sm-4 col-form-label fw-semibold">Email</label>
  <div className="col-sm-8">
    <input
      type="email"
      className="form-control"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>
</div>

{/* Location State */}
<div className="row mb-3 align-items-center">
  <label className="col-sm-4 col-form-label fw-semibold">*Location State</label>
  <div className="col-sm-8">
    <select
      className="form-select"
      value={selectedStateId}
      onChange={handleStateChange}
    >
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

        {/* Plan to Buy */}
        <div className="row mb-3 align-items-center">
          <label className="col-sm-4 col-form-label fw-semibold">
            *Are you planning to buy the property soon?
          </label>
          <div className="col-sm-8 d-flex gap-2">
            <button
              type="button"
              className={`btn ${
                planToBuy === "yes"
                  ? "btn-warning text-white"
                  : "btn-outline-secondary"
              } flex-fill`}
              onClick={() => setPlanToBuy("yes")}
            >
              Yes
            </button>
            <button
              type="button"
              className={`btn ${
                planToBuy === "no"
                  ? "btn-warning text-white"
                  : "btn-outline-secondary"
              } flex-fill`}
              onClick={() => setPlanToBuy("no")}
            >
              No
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="text-end">
          <button
            type="button"
            className="btn btn-warning text-white fw-bold px-4"
            onClick={handleViewDetails}
          >
            Submit Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyRequestForm;
