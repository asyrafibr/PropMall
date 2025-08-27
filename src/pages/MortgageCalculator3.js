import React, { useState, useEffect } from "react";

const MortgageCalculator = ({ product }) => {
  const [propertyPrice, setPropertyPrice] = useState(0);
  const [downPaymentPct, setDownPaymentPct] = useState(10);
  const [loanTenure, setLoanTenure] = useState(30);
  const [interestRate, setInterestRate] = useState(3.8);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Sync property price with product
  useEffect(() => {
    const rawPrice = product?.price;
    if (rawPrice) {
      const clean = String(rawPrice).replace(/,/g, "");
      const parsed = Number(clean);
      if (!isNaN(parsed)) setPropertyPrice(parsed);
    }
  }, [product]);

  // Recalculate mortgage whenever inputs change
  useEffect(() => {
    calculateMortgage();
  }, [propertyPrice, downPaymentPct, loanTenure, interestRate]);

  const calculateMortgage = () => {
    const loanAmount = propertyPrice * (1 - downPaymentPct / 100);
    const P = loanAmount;
    const i = interestRate / 100 / 12;
    const n = loanTenure * 12;

    if (P === 0 || i === 0 || n === 0) {
      setMonthlyPayment(0);
      return;
    }

    const monthly = (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    setMonthlyPayment(monthly);
  };

  const formatCurrency = (value) => {
    return (
      "RM " +
      Number(value).toLocaleString("en-MY", {
        minimumFractionDigits: 0,
      })
    );
  };

  const downPaymentValue = (propertyPrice * downPaymentPct) / 100;

  return (
    <div
      //   className="p-4"
      style={{ fontFamily: "Poppins", maxWidth: "600px"}}
    >
      <div style={{ marginBottom: 20 }}>
        {" "}
        <text style={{ fontSize: "18px", fontWeight: 600 }}>
          Mortgage Calculator
        </text>
      </div>

      {/* Top Highlight Box */}
      <div
        style={{
          background: "#FF8C00",
          color: "#fff",
          padding: "10px 15px",
          borderRadius: "6px",
          fontWeight: 600,
          marginBottom: "20px",
          display: "inline-block",
        }}
      >
        Est Mortgage {formatCurrency(monthlyPayment)}/ month
      </div>

      <div className="row g-3">
        {/* LEFT COLUMN */}
        <div className="col-md-6">
          {/* Property Price */}
          <label className="form-label">Property Price</label>
          <div className="input-group">
            <span className="input-group-text">RM</span>
            <input
              type="number"
              className="form-control"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
            />
            {/* show formatted value to keep height/width consistent with Downpayment */}
            <span className="input-group-text">
              {formatCurrency(propertyPrice)}
            </span>
          </div>
          <input
            type="range"
            className="form-range mt-2"
            min="50000"
            max="2000000"
            step="10000"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
          />

          {/* Loan Term */}
          <div className="mt-3">
            <label className="form-label">Loan Term</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
              />
              <span className="input-group-text">Years</span>
            </div>
            <input
              type="range"
              className="form-range mt-2"
              min="5"
              max="35"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-md-6">
          {/* Downpayment */}
          <label className="form-label">Downpayment</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            />
            <span className="input-group-text">%</span>
            <span className="input-group-text">
              {formatCurrency(downPaymentValue)}
            </span>
          </div>
          <input
            type="range"
            className="form-range mt-2"
            min="0"
            max="50"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
          />

          {/* Interest Rate */}
          <div className="mt-3">
            <label className="form-label">Interest Rate</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
              <span className="input-group-text">%</span>
            </div>
            <input
              type="range"
              className="form-range mt-2"
              min="1"
              max="10"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        className="btn btn-outline-warning mt-4"
        style={{ borderWidth: "2px" }}
        onClick={calculateMortgage}
      >
        Calculate Again
      </button>
    </div>
  );
};

export default MortgageCalculator;
