import React, { useState, useEffect } from "react";

const MortgageCalculator = ({ product }) => {
  const [productList, setProductList] = useState(product); // start from 0

  const [propertyPrice, setPropertyPrice] = useState(null); // use null instead of 0

  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [loanTenure, setLoanTenure] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [principal, setPrincipal] = useState(0);
  const [interest, setInterest] = useState(0);

  useEffect(() => {
    calculateMortgage();
    console.log("Product price is:", productList);
  }, [propertyPrice, loanAmount, interestRate, loanTenure]);
  useEffect(() => {
    const rawPrice = product?.price;
    if (rawPrice != null) {
      const clean = String(rawPrice).replace(/,/g, "");
      const parsed = Number(clean);

      console.log("Cleaned price:", clean, "→ Parsed:", parsed);

      if (!isNaN(parsed)) {
        setPropertyPrice(parsed);
      } else {
        console.warn("Product price is not a number:", rawPrice);
      }
    }
  }, [product]);

  const calculateMortgage = () => {
    const P = loanAmount;
    const i = interestRate / 100 / 12;
    const n = loanTenure * 12;

    if (P === 0 || i === 0 || n === 0) {
      setMonthlyPayment(0);
      setPrincipal(0);
      setInterest(0);
      return;
    }

    const monthly = (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const interestOnly = P * i;
    const principalOnly = monthly - interestOnly;

    setMonthlyPayment(monthly);
    setPrincipal(principalOnly);
    setInterest(interestOnly);
  };

  const format = (num) =>
    "RM " + Number(num).toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="card p-4 shadow-sm mt-4" style={{ fontFamily: "Poppins" }}>
      <text style={{fontSize:'20px',fontWeight:600}}>Mortgage Calculator</text>

      <div className="row">
        {/* LEFT SECTION */}
        <div className="col-lg-6 pe-lg-4">
          {/* Mortgage Breakdown */}
          <div className="mb-4">
            <p className="mb-1">Est. monthly repayment</p>
            <h5 className="fw-bold">
              {format(monthlyPayment)}{" "}
              <span className="fw-normal">/ month</span>
            </h5>
            <div className="progress mb-2" style={{ height: "10px" }}>
              <div
                className="progress-bar bg-primary"
                style={{ width: `${(principal / monthlyPayment) * 100 || 0}%` }}
              ></div>
              <div
                className="progress-bar bg-info"
                style={{ width: `${(interest / monthlyPayment) * 100 || 0}%` }}
              ></div>
            </div>
            <div className="d-flex justify-content-between small text-muted">
              <span>🔵 {format(principal)} Principal</span>
              <span>🔵 {format(interest)} Interest</span>
            </div>
          </div>

          {/* Upfront Costs */}
          <div className="mb-4">
            <p className="mb-1">Total Downpayment</p>
            <h5 className="fw-bold">{format(propertyPrice - loanAmount)}</h5>
            <div className="progress mb-2" style={{ height: "10px" }}>
              <div
                className="progress-bar bg-primary"
                style={{
                  width: `${
                    ((propertyPrice - loanAmount) / propertyPrice) * 100 || 0
                  }%`,
                }}
              ></div>
              <div
                className="progress-bar bg-info"
                style={{
                  width: `${(loanAmount / propertyPrice) * 100 || 0}%`,
                }}
              ></div>
            </div>
            <div className="d-flex justify-content-between small text-muted">
              <span>🔵 Downpayment</span>
              <span>
                🔵 {format(loanAmount)} Loan amount at{" "}
                {propertyPrice > 0
                  ? Math.round((loanAmount / propertyPrice) * 100)
                  : 0}
                % Loan-to-value
              </span>
            </div>
          </div>
          <button
            className="btn btn-outline-warning w-129"
            onClick={calculateMortgage}
          >
            Calculate Again
          </button>
        </div>

        {/* RIGHT SECTION - Inputs */}
        <div className="col-lg-6 ps-lg-4">
          <div className="row g-3 mb-4">
            <div className="col-12">
              <label className="form-label">Property Price</label>
              <input
                type="number"
                className="form-control"
                value={propertyPrice === null ? "" : propertyPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  setPropertyPrice(val === "" ? null : Number(val));
                }}
                onBlur={() => {
                  if (propertyPrice === null) setPropertyPrice(0);
                }}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Loan Amount</label>
              <input
                type="number"
                className="form-control"
                value={loanAmount}
                onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                onBlur={(e) => e.target.value === "" && setLoanAmount(0)}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={interestRate}
                onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                onBlur={(e) => e.target.value === "" && setInterestRate(0)}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Loan Tenure (Years)</label>
              <input
                type="number"
                className="form-control"
                value={loanTenure}
                onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
                onBlur={(e) => e.target.value === "" && setLoanTenure(0)}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
