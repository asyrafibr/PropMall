import React, { useState } from "react";
import {
  FaHome,
  FaMoneyCheckAlt,
  FaFileContract,
  FaCalculator,
  FaChartLine,
  FaArrowLeft,
} from "react-icons/fa";
import buy from "../image/buy.svg";
import loan from "../image/loan.svg";
import legal from "../image/legal.svg";
import mortgage from "../image/mortgage.svg";
import gtax from "../image/gtax.svg";
import "./LegalFeeCalculator.css";
// Currency formatter
const formatCurrency = (value) =>
  value.toLocaleString("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  });

/* ----- CALCULATORS ----- */

// 1️⃣ Buy / Sell Calculator
const BuySellCalculator = () => {
  const [price, setPrice] = useState("");
  const [result, setResult] = useState(null);
  const [discount, setDiscount] = useState("");
  const [error, setError] = useState("");
  const [buySellResult, setBuySellResult] = useState(null);
  const calculateBuySell = (price, discount = 0) => {
    const discountedPrice = price * (1 - discount / 100);
    let legalFees = 0;

    if (discountedPrice <= 500000) {
      legalFees = discountedPrice * 0.01;
    } else if (discountedPrice <= 1000000) {
      legalFees = 5000 + (discountedPrice - 500000) * 0.008;
    } else if (discountedPrice <= 3000000) {
      legalFees = 9000 + (discountedPrice - 1000000) * 0.007;
    } else {
      legalFees = 23000 + (discountedPrice - 3000000) * 0.006;
    }

    const stampDuty =
      discountedPrice <= 100000
        ? discountedPrice * 0.01
        : discountedPrice <= 500000
        ? 1000 + (discountedPrice - 100000) * 0.02
        : 9000 + (discountedPrice - 500000) * 0.03;

    const sst = legalFees * 0.08;

    return {
      discountedPrice,
      legalFees,
      stampDuty,
      sst,
      total: legalFees + stampDuty + sst,
    };
  };

  const handleCalculateBuySell = () => {
    const priceValue = parseFloat(price.replace(/,/g, ""));
    const discountValue = parseFloat(discount);

    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Please enter a valid purchase price.");
      return;
    }
    if (
      discount &&
      (isNaN(discountValue) || discountValue < 0 || discountValue > 100)
    ) {
      setError("Discount must be between 0 and 100.");
      return;
    }
    setError("");
    setBuySellResult(calculateBuySell(priceValue, discountValue));
  };

  return (
    <div className="legal-card">
      <h4 className="legal-title">Buy / Sell</h4>
      <div className="legal-flex">
        {/* Left Column */}
        <div className="d-flex flex-column gap-2 mb-4 flex-fill">
          <label className="legal-title">Purchase Price</label>
          <input
            className="legal-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div className="flex-fill">
            <label className="legal-title">Discount</label>
            <div className="position-relative w-100">
              <input
                className="legal-input pe-4"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
              />
              <span className="position-absolute top-50 end-0 translate-middle-y me-2 text-secondary">
                %
              </span>
            </div>
          </div>

          <button className="legal-btn" onClick={handleCalculateBuySell}>
            Calculate
          </button>

          {error && <p className="text-danger mt-2">{error}</p>}
        </div>

        {/* Right Column */}
        <div className="d-flex flex-column gap-2 flex-fill">
          <span className="legal-title">Legal Fees :</span>
          <span className="legal-title fw-semibold">
            {buySellResult ? formatCurrency(buySellResult.legalFees) : "-"}
          </span>

          <span className="legal-title">Discount (%) :</span>
          <span className="legal-title fw-semibold">
            {buySellResult ? discount : "-"}
          </span>

          <span className="legal-title">Stamp Duty :</span>
          <span className="legal-title fw-semibold">
            {buySellResult ? formatCurrency(buySellResult.stampDuty) : "-"}
          </span>

          <span className="legal-title">SST (%) :</span>
          <span className="legal-title fw-semibold">
            {buySellResult ? formatCurrency(buySellResult.sst) : "-"}
          </span>

          <p className="legal-total-amount">Total Amount:</p>
          <p className="legal-total-amount">
            {buySellResult ? formatCurrency(buySellResult.total) : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

// 2️⃣ Loan Calculator
const LoanCalculator = () => {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [monthly, setMonthly] = useState(null);
  const [mortgage, setMortgage] = useState({
    propertyPrice: "",
    loanAmount: "",
    interestRate: "",
    loanTenure: "",
  });
  const [loanAmount, setLoanAmount] = useState("");
  const [loanResult, setLoanResult] = useState(null);
  const calculateLoan = (loanAmount) => {
    const legalFees =
      loanAmount <= 500000
        ? loanAmount * 0.01
        : loanAmount <= 1000000
        ? 5000 + (loanAmount - 500000) * 0.008
        : 9000 + (loanAmount - 1000000) * 0.007;

    const stampDuty = loanAmount * 0.005;
    const sst = legalFees * 0.08;

    return {
      legalFees,
      stampDuty,
      sst,
      total: legalFees + stampDuty + sst,
    };
  };
  const handleCalculateLoan = () => {
    const loanValue = parseFloat(loanAmount.replace(/,/g, ""));
    if (isNaN(loanValue) || loanValue <= 0) return;
    setLoanResult(calculateLoan(loanValue));
  };

  return (
    <div className="legal-card">
      {/* Loan */}
      <h4 className="legal-title">Loan</h4>
      <div className="d-flex justify-content-between gap-3">
        {/* Left Column */}
        <div className="d-flex flex-column gap-2 flex-fill">
          <label className="legal-title">Loan Amount</label>
          <input
            className="legal-input"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />

          <button className="legal-btn" onClick={handleCalculateLoan}>
            Calculate
          </button>
        </div>

        {/* Right Column */}
        <div className="d-flex flex-column gap-2 flex-fill">
          <span className="legal-title">Legal Fees</span>
          <span className="legal-title fw-semibold">
            {loanResult ? formatCurrency(loanResult.legalFees) : "-"}
          </span>

          <span className="legal-title">Stamp Duty</span>
          <span className="legal-title fw-semibold">
            {loanResult ? formatCurrency(loanResult.stampDuty) : "-"}
          </span>

          <span className="legal-title">SST (%)</span>
          <span className="legal-title fw-semibold">
            {loanResult ? formatCurrency(loanResult.sst) : "-"}
          </span>

          <p className="legal-total-amount">Total Amount:</p>
          <p className="legal-total-amount">
            {loanResult ? formatCurrency(loanResult.total) : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

// 3️⃣ Tenancy Calculator
const TenancyCalculator = () => {
  const [rent, setRent] = useState("");
  const [months, setMonths] = useState("");
  const [total, setTotal] = useState(null);
  const [monthlyRent, setMonthlyRent] = useState("");
  const [rentalDuration, setRentalDuration] = useState("");
  const [tenancyResult, setTenancyResult] = useState(null);

  const handleCalculateTenancy = () => {
    const rent = parseFloat(monthlyRent.replace(/,/g, ""));
    const duration = parseInt(rentalDuration);
    if (isNaN(rent) || rent <= 0 || isNaN(duration) || duration <= 0) return;
    setTenancyResult(calculateTenancy(rent, duration));
  };
  const calculateTenancy = (monthlyRent, durationMonths) => {
    const annualRent = monthlyRent * durationMonths;
    const stampDuty =
      annualRent <= 2400 ? 0 : annualRent <= 24000 ? 40 : 0.2 * annualRent;
    return {
      stampDuty,
    };
  };

  return (
    <div className="legal-card">
      {/* Tenancy */}
      <h4 className="legal-title">Tenancy</h4>
      <div className="d-flex justify-content-between gap-3">
        {/* Left Column */}
        <div className="d-flex flex-column gap-2 flex-fill">
          <label className="legal-title">Enter Monthly Rent</label>
          <input
            className="legal-input"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
          />

          <label className="legal-title">Enter Tenancy Duration (Years)</label>
          <input
            type="number"
            className="legal-input"
            value={rentalDuration}
            onChange={(e) => setRentalDuration(e.target.value)}
          />

          <button className="legal-btn" onClick={handleCalculateTenancy}>
            Calculate
          </button>
        </div>

        {/* Right Column */}
        <div className="d-flex flex-column gap-2 flex-fill">
          <span className="legal-title">Legal Fees</span>
          <span className="legal-title fw-semibold">RM 2,400.00</span>

          <span className="legal-title">Stamp Duty</span>
          <span className="legal-title fw-semibold">
            {tenancyResult ? formatCurrency(tenancyResult.stampDuty) : "-"}
          </span>

          <p className="legal-total-amount">Total Amount:</p>
          <p className="legal-total-amount">
            {tenancyResult
              ? formatCurrency(2400 + tenancyResult.stampDuty)
              : "-"}
          </p>

          <small className="legal-note">
            The stamp duty above is inclusive of one additional copy of stamping
            at RM10
          </small>
        </div>
      </div>
    </div>
  );
};

// 4️⃣ Mortgage Calculator
const MortgageCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [monthly, setMonthly] = useState(null);
  const [mortgageResult, setMortgageResult] = useState(null);
  const [mortgage, setMortgage] = useState({
    propertyPrice: "",
    loanAmount: "",
    interestRate: "",
    loanTenure: "",
  });
const cleanNumber = (value) =>
  parseFloat(value.replace(/[^\d.]/g, "")) || 0; // keep only digits and decimal

const handleCalculateMortgage = () => {
  const P = cleanNumber(mortgage.loanAmount); // loan amount
  const r = parseFloat(mortgage.interestRate) / 100 / 12; // monthly interest
  const n = parseInt(mortgage.loanTenure) * 12; // tenure in months
  const propertyPrice = cleanNumber(mortgage.propertyPrice);

  if (!P || !r || !n || !propertyPrice) return;

  // Standard mortgage formula
  const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const total = monthly * n;
  const interest = total - P;
  const principal = P;

  const downpayment = propertyPrice - P;

  setMortgageResult({
    monthly: Math.round(monthly),
    principal,
    interest: Math.round(interest),
    downpayment,
  });
};

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (p && r && n) {
      const m = (p * r) / (1 - Math.pow(1 + r, -n));
      setMonthly(m);
    }
  };
  const formatNumber = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
   <div className="legal-card">
  <h4 className="mb-3">Mortgage Calculator</h4>

  {/* Responsive layout */}
  <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
    
    {/* LEFT COLUMN */}
    <div className="d-flex flex-column gap-3 w-100 w-md-50">
      {/* Mortgage Breakdown */}
      <div className="legal-section">
        <p className="legal-section-title">Mortgage Breakdown</p>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <p className="legal-small mb-0">Est. monthly repayment</p>
          <h3 className="legal-monthly mb-0">
            {mortgageResult
              ? formatCurrency(mortgageResult.monthly) + "/ month"
              : "-"}
          </h3>
        </div>

        {/* Progress bar */}
        <div className="progress-container w-100">
          <div className="progress-blue" style={{ width: "33%" }}></div>
          <div className="progress-teal" style={{ width: "67%" }}></div>
        </div>

        {/* Principal & Interest */}
        <div className="legend d-flex flex-column flex-sm-row gap-2">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: "#1E90FF" }}></span>
            RM{" "}
            {mortgageResult
              ? formatCurrency(
                  mortgageResult.principal /
                    (parseInt(mortgage.loanTenure) * 12)
                )
              : "-"}{" "}
            Principal
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: "#20B2AA" }}></span>
            RM{" "}
            {mortgageResult
              ? formatCurrency(
                  mortgageResult.interest /
                    (parseInt(mortgage.loanTenure) * 12)
                )
              : "-"}{" "}
            Interest
          </span>
        </div>
      </div>

      {/* Upfront Costs */}
      <div className="legal-section">
        <p className="legal-section-title">Upfront Costs</p>
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <p className="legal-small mb-0">Total Downpayment</p>
          <h3 className="legal-monthly mb-0">
            {mortgageResult
              ? formatCurrency(mortgageResult.downpayment)
              : "-"}
          </h3>
        </div>

        <div className="progress-container w-100">
          <div className="progress-blue" style={{ width: "11%" }}></div>
          <div className="progress-teal" style={{ width: "89%" }}></div>
        </div>

        <div className="legend d-flex flex-column gap-2">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: "#1E90FF" }}></span>
            Downpayment
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: "#20B2AA" }}></span>
            RM{" "}
            {mortgage.loanAmount
              ? parseFloat(mortgage.loanAmount.replace(/,/g, "")).toLocaleString()
              : "-"}{" "}
            loan amount at{" "}
            {Math.round(
              (parseFloat(mortgage.loanAmount.replace(/,/g, "")) /
                parseFloat(mortgage.propertyPrice.replace(/,/g, ""))) *
                100
            )}
            % Loan-to-value
          </span>
        </div>
      </div>

      {/* Desktop button (inside LEFT column only) */}
      <button
        className="legal-btn d-none d-md-block"
        onClick={handleCalculateMortgage}
      >
        Calculate
      </button>
    </div>

    {/* RIGHT COLUMN */}
    <div className="d-flex flex-column gap-2 w-100 w-md-50">
      <label className="legal-title">Property Price</label>
      <input
        className="legal-input"
        value={`RM ${mortgage.propertyPrice}`}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "");
          setMortgage({ ...mortgage, propertyPrice: raw });
        }}
        placeholder="RM 0"
      />

      <label className="legal-title">Loan Amount</label>
      <input
        className="legal-input"
        value={`RM ${formatNumber(mortgage.loanAmount)}`}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "");
          setMortgage({ ...mortgage, loanAmount: raw });
        }}
        placeholder="RM 0"
      />

      <div className="d-flex flex-column flex-sm-row gap-3 align-items-stretch">
        <div className="flex-fill position-relative">
          <label className="legal-title">Interest Rate</label>
          <input
            className="legal-input pe-5"
            value={mortgage.interestRate}
            onChange={(e) =>
              setMortgage({ ...mortgage, interestRate: e.target.value })
            }
            placeholder="3.5"
          />
          <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted">
            %
          </span>
        </div>

        <div className="flex-fill position-relative">
          <label className="legal-title">Loan Tenure</label>
          <input
            className="legal-input pe-5"
            value={mortgage.loanTenure}
            onChange={(e) =>
              setMortgage({ ...mortgage, loanTenure: e.target.value })
            }
            placeholder="30"
          />
          <span className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted">
            Years
          </span>
        </div>
      </div>

      {/* Mobile button (inside RIGHT column only) */}
      <button
        className="legal-btn mt-3 d-block d-md-none"
        onClick={handleCalculateMortgage}
      >
        Calculate
      </button>
    </div>
  </div>
</div>


  );
};

// 5️⃣ RPGT Calculator
const RPGTCalculator = () => {
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [gain, setGain] = useState(null);
  const [rpgtResult, setRpgtResult] = useState(null);

  const [rpgt, setRpgt] = useState({
    purchasePrice: "",
    disposalPrice: "",
    purchaseYear: "",
    disposalYear: "",
    permittedExpenses: "",
  });
  const handleCalculateRPGT = () => {
    const purchase = parseFloat(rpgt.purchasePrice.replace(/,/g, ""));
    const disposal = parseFloat(rpgt.disposalPrice.replace(/,/g, ""));
    const expense = parseFloat(rpgt.permittedExpenses.replace(/,/g, "")) || 0;
    const gain = disposal - purchase - expense;
    const holdingPeriod =
      parseInt(rpgt.disposalYear) - parseInt(rpgt.purchaseYear);

    let taxRate = 0;

    if (holdingPeriod <= 3) taxRate = 0.3;
    else if (holdingPeriod === 4) taxRate = 0.2;
    else if (holdingPeriod === 5) taxRate = 0.15;
    else if (holdingPeriod > 5) taxRate = 0.05;

    const tax = gain > 0 ? gain * taxRate : 0;

    setRpgtResult({
      gain,
      taxRate,
      tax,
    });
  };

  const handleCalculate = () => {
    const p = parseFloat(price);
    const c = parseFloat(cost);
    if (!isNaN(p) && !isNaN(c)) {
      setGain(p - c);
    }
  };

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h4 className="mb-3 fw-semibold">Real Property Gain Tax</h4>

      <div className="row g-4">
        {/* LEFT COLUMN */}
        <div className="col-md-6">
          {/* Acquisition Date */}
          <div className="mb-3">
            <label className="form-label">
              Acquisition Date / Initial Purchase Date
            </label>
            <input
              type="date"
              className="form-control"
              value={rpgt.acquisitionDate || ""}
              onChange={(e) =>
                setRpgt({ ...rpgt, acquisitionDate: e.target.value })
              }
            />
          </div>

          {/* Disposal Date */}
          <div className="mb-3">
            <label className="form-label">Disposal Date / Selling Date</label>
            <input
              type="date"
              className="form-control"
              value={rpgt.disposalDate || ""}
              onChange={(e) =>
                setRpgt({ ...rpgt, disposalDate: e.target.value })
              }
            />
          </div>

          {/* Seller Nationality */}
          <div className="mb-3">
            <label className="form-label">Seller’s Nationality</label>
            <select
              className="form-select"
              value={rpgt.nationality || ""}
              onChange={(e) =>
                setRpgt({ ...rpgt, nationality: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="local">Local</option>
              <option value="foreigner">Foreigner</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="mb-3">
            <label className="form-label">Property Type</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  checked={rpgt.propertyType === "residential"}
                  onChange={() =>
                    setRpgt({ ...rpgt, propertyType: "residential" })
                  }
                />
                <label className="form-check-label">Residential</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  checked={rpgt.propertyType === "nonResidential"}
                  onChange={() =>
                    setRpgt({ ...rpgt, propertyType: "nonResidential" })
                  }
                />
                <label className="form-check-label">Non Residential</label>
              </div>
            </div>
          </div>

          {/* Exemption */}
          <div className="mb-3">
            <label className="form-label">Exempt from Gains Tax?</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  checked={rpgt.exempt === true}
                  onChange={() => setRpgt({ ...rpgt, exempt: true })}
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  checked={rpgt.exempt === false}
                  onChange={() => setRpgt({ ...rpgt, exempt: false })}
                />
                <label className="form-check-label">No</label>
              </div>
            </div>
          </div>

          <button
            className="btn btn-outline-warning mt-2"
            onClick={handleCalculateRPGT}
          >
            Calculate
          </button>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-md-6">
          {/* Purchase Price */}
          <div className="mb-3">
            <label className="form-label">Purchase Price (RM)</label>
            <input
              type="number"
              className="form-control"
              value={rpgt.purchasePrice || ""}
              onChange={(e) =>
                setRpgt({ ...rpgt, purchasePrice: e.target.value })
              }
              placeholder="388000"
            />
          </div>

          {/* Disposal Price */}
          <div className="mb-3">
            <label className="form-label">Disposal / Selling Price (RM)</label>
            <input
              type="number"
              className="form-control"
              value={rpgt.disposalPrice || ""}
              onChange={(e) =>
                setRpgt({ ...rpgt, disposalPrice: e.target.value })
              }
              placeholder="500000"
            />
          </div>

          {/* Permitted Expenses */}
          <div className="mb-3">
            <label className="form-label">Permitted Expenses (RM)</label>
            <input
              type="number"
              className="form-control"
              value={rpgt.permittedExpenses || ""}
              onChange={(e) =>
                setRpgt({ ...rpgt, permittedExpenses: e.target.value })
              }
              placeholder="20000"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ----- MAIN PAGE ----- */
const CalculatorMenuPage = () => {
  const [selectedCalculator, setSelectedCalculator] = useState(null);

  const calculators = [
    {
      id: "buySell",
      name: "Buy & Sell Legal Fee & Stamp Duty",
      icon: <img src={buy} alt="Buy & Sell" className="img-fluid icon-40" />,
      component: <BuySellCalculator />,
    },
    {
      id: "loan",
      name: "Loan Legal Fee & Stamp Duty",
      icon: <img src={loan} alt="Loan Legal" className="img-fluid icon-40" />,
      component: <LoanCalculator />,
    },
    {
      id: "tenancy",
      name: "Tenancy Legal Fee & Stamp Duty",
      icon: (
        <img src={legal} alt="Tenancy Legal" className="img-fluid icon-40" />
      ),
      component: <TenancyCalculator />,
    },
    {
      id: "mortgage",
      name: "Mortgage Loan",
      icon: (
        <img src={mortgage} alt="Mortgage Loan" className="img-fluid icon-40" />
      ),
      component: <MortgageCalculator />,
    },
    {
      id: "rpgt",
      name: "Real Property Gain Tax (RPGT",
      icon: (
        <img
          src={gtax}
          alt="Real Property Gain Tax"
          className="img-fluid icon-40"
        />
      ),
      component: <RPGTCalculator />,
    },
  ];

  if (selectedCalculator) {
    const calc = calculators.find((c) => c.id === selectedCalculator);
    return (
      <div className="p-3">
        <button
          onClick={() => setSelectedCalculator(null)}
          className="btn btn-light d-flex align-items-center gap-2 mb-3"
        >
          <FaArrowLeft /> Back
        </button>

        {calc?.component}
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Top row (1 per row on mobile, 3 per row on md and up) */}
      <div className="row g-3">
        {calculators.slice(0, 3).map((calc) => (
          <div className="col-12 col-md-4" key={calc.id}>
            <div
              onClick={() => setSelectedCalculator(calc.id)}
              className="text-center bg-light rounded-3 p-3 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center"
              role="button"
            >
              {calc.icon}
              <p className="mt-2 mb-0">{calc.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row (1 per row on mobile, 2 per row on md and up) */}
      <div className="row g-3 mt-3">
        {calculators.slice(3).map((calc) => (
          <div className="col-12 col-md-6" key={calc.id}>
            <div
              onClick={() => setSelectedCalculator(calc.id)}
              className="text-center bg-light rounded-3 p-3 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center"
              role="button"
            >
              {calc.icon}
              <p className="mt-2 mb-0">{calc.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorMenuPage;
