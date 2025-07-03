import React, { useState } from "react";

const WTBWTRFormPage = ({ mode }) => {
  const isBuy = mode === "buy";

  const [formData, setFormData] = useState([
    { title: "", location: "", budget: "", notes: "" }, // Card 1
    { title: "", location: "", budget: "", notes: "" }, // Card 2
    { title: "", location: "", budget: "", notes: "" }, // Card 3
    { title: "", location: "", budget: "", notes: "" }, // Card 4
  ]);

  const stepLabels = [
    "Base Info",
    "Enquiry Details",
    "Location & Purchase Price Budget",
    "Personal Notes",
  ];

  const handleChange = (cardIndex, field, value) => {
    const updatedData = [...formData];
    updatedData[cardIndex][field] = value;
    setFormData(updatedData);
  };

  const isCardComplete = (card) =>
    card.title && card.location && card.budget && card.notes;

  const allCardsComplete = formData.every(isCardComplete);

  const cardStyle = {
    display: "flex",
    width: "1120px",
    padding: "16px 24px 24px 24px",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "24px",
    borderRadius: "8px",
    border: "1px solid #DBDBDB",
    background: "#FAFAFA",
    marginBottom: "24px",
  };

  const cardTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    fontFamily: "Poppins",
    marginBottom: "8px",
  };

  const renderStepper = () => (
    <div
      className="d-flex justify-content-between mb-40"
      style={{ width: "1120px", marginTop: "84px" ,marginBottom:'100px'}}
    >
      {formData.map((step, index) => {
        const isComplete = isCardComplete(step);
        return (
          <div
            key={index}
            className="d-flex flex-column align-items-center"
            style={{ flex: 1, position: "relative" }}
          >
            {index !== 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "18px",
                  left: "-50%",
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#DBDBDB",
                  zIndex: 0,
                }}
              />
            )}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "20px",
                border: isComplete ? "2px solid #F4980E" : "1px solid #3A3A3A",
                backgroundColor: isComplete ? "#F4980E" : "#FAFAFA",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
                fontWeight: 600,
                color: isComplete ? "#fff" : "#3A3A3A",
              }}
            >
              {`0${index + 1}`}
            </div>
            <div
              style={{
                marginTop: "8px",
                color: "#3A3A3A",
                fontSize: "14px",
                fontFamily: "Poppins",
                textAlign: "center",
              }}
            >
              {stepLabels[index]}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderFormContent = (index) => (
    <div className="col-md-12">
      {/* <div className="mb-4 d-flex justify-content-between align-items-center">
        <h5>{isBuy ? "Buy a Property (WTB)" : "Rent a Property (WTR)"}</h5>
        <span className="badge bg-warning text-dark">Prospect Status: Draft</span>
      </div> */}

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          type="text"
          placeholder="e.g. Looking for landed house"
          value={formData[index].title}
          onChange={(e) => handleChange(index, "title", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Location</label>
        <input
          className="form-control"
          type="text"
          placeholder="e.g. Selangor, Puchong"
          value={formData[index].location}
          onChange={(e) => handleChange(index, "location", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Maximum Budget</label>
        <input
          className="form-control"
          type="number"
          placeholder="e.g. 500000"
          value={formData[index].budget}
          onChange={(e) => handleChange(index, "budget", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Notes</label>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Additional requirements..."
          value={formData[index].notes}
          onChange={(e) => handleChange(index, "notes", e.target.value)}
        ></textarea>
      </div>
    </div>
  );

  return (
    <div className="d-flex flex-column align-items-center py-4" style={{ fontFamily: "Poppins" }}>
      {renderStepper()}

      {/* Card 1 */}
      <div style={cardStyle}>
        <h5 style={cardTitleStyle}>Based Information</h5>
        {renderFormContent(0)}
      </div>

      {/* Card 2 */}
      <div style={cardStyle}>
        <h5 style={cardTitleStyle}>Enquiry Details</h5>
        {renderFormContent(1)}
      </div>

      {/* Card 3 */}
      <div style={cardStyle}>
        <h5 style={cardTitleStyle}>Location and Purchase Price Budget</h5>
        {renderFormContent(2)}
      </div>

      {/* Card 4 */}
      <div style={cardStyle}>
        <h5 style={cardTitleStyle}>Location and Purchase Price Budget</h5>
        {renderFormContent(3)}
      </div>

      <div className="text-end" style={{ width: "1120px" }}>
        <button
          className="btn btn-primary px-4"
          disabled={!allCardsComplete}
          style={{
            opacity: allCardsComplete ? 1 : 0.5,
            cursor: allCardsComplete ? "pointer" : "not-allowed",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default WTBWTRFormPage;
