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
    return "RM " + Number(value).toLocaleString("en-MY", {
      minimumFractionDigits: 0,
    });
  };

  const downPaymentValue = (propertyPrice * downPaymentPct) / 100;

  return (
    <div
      className="p-4"
      style={{ fontFamily: "Poppins", maxWidth: "600px", margin: "0 auto" }}
    >
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
        {/* Property Price */}
        <div className="col-12">
          <label className="form-label">Property Price</label>
          <input
            type="number"
            className="form-control"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
          />
          <input
            type="range"
            className="form-range mt-2"
            min="50000"
            max="2000000"
            step="1000"
            value={propertyPrice}
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
          />
        </div>

        {/* Downpayment */}
        <div className="col-12">
          <label className="form-label">Downpayment</label>
          <div className="d-flex align-items-center gap-2">
            <input
              type="number"
              className="form-control"
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            />
            <span>%</span>
            <div
              style={{
                background: "#eee",
                padding: "6px 10px",
                borderRadius: "6px",
                minWidth: "100px",
              }}
            >
              {formatCurrency(downPaymentValue)}
            </div>
          </div>
          <input
            type="range"
            className="form-range mt-2"
            min="0"
            max="50"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
          />
        </div>

        {/* Loan Term */}
        <div className="col-6">
          <label className="form-label">Loan Term</label>
          <input
            type="number"
            className="form-control"
            value={loanTenure}
            onChange={(e) => setLoanTenure(Number(e.target.value))}
          />
          <small>Years</small>
          <input
            type="range"
            className="form-range mt-2"
            min="5"
            max="35"
            value={loanTenure}
            onChange={(e) => setLoanTenure(Number(e.target.value))}
          />
        </div>

        {/* Interest Rate */}
        <div className="col-6">
          <label className="form-label">Interest Rate</label>
          <input
            type="number"
            className="form-control"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
          <small>%</small>
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
