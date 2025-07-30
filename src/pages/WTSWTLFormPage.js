import React, { useState } from "react";

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

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
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
    fontSize: "14px",
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
        <div style={{ fontWeight: "600", fontSize: "20px" }}>
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
          <div style={rowStyle}>
            {labelWrapper("*Location State")}
            <select
              style={inputStyle}
              value={stateLocation}
              onChange={(e) => setStateLocation(e.target.value)}
            >
              <option value="">[Please select a State]</option>
              <option value="Selangor">Selangor</option>
              <option value="Kuala Lumpur">Kuala Lumpur</option>
            </select>
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
              <p style={{ fontSize: "10px", color: "#777", marginTop: "4px" }}>
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
              fontSize: "14px",
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
                fontSize: "12px",
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

export default PropertyRequestForm;
