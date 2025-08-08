import React, { useState } from "react";

const formatCurrency = (value) => {
  return "RM " + value.toLocaleString(undefined, { minimumFractionDigits: 2 });
};

const calculateBuySell = (price) => {
  let legalFees = 0;

  if (price <= 500000) {
    legalFees = price * 0.01;
  } else if (price <= 1000000) {
    legalFees = 5000 + (price - 500000) * 0.008;
  } else if (price <= 3000000) {
    legalFees = 9000 + (price - 1000000) * 0.007;
  } else {
    legalFees = 23000 + (price - 3000000) * 0.006;
  }

  const stampDuty =
    price <= 100000
      ? price * 0.01
      : price <= 500000
      ? 1000 + (price - 100000) * 0.02
      : 9000 + (price - 500000) * 0.03;

  const sst = legalFees * 0.08;

  return {
    legalFees,
    stampDuty,
    sst,
    total: legalFees + stampDuty + sst,
  };
};

const calculateLoan = (loan) => {
  let legalFees = 0;

  if (loan <= 500000) {
    legalFees = loan * 0.01;
  } else if (loan <= 1000000) {
    legalFees = 5000 + (loan - 500000) * 0.008;
  } else if (loan <= 3000000) {
    legalFees = 9000 + (loan - 1000000) * 0.007;
  } else {
    legalFees = 23000 + (loan - 3000000) * 0.006;
  }

  const stampDuty = loan * 0.005;
  const sst = legalFees * 0.08;

  return {
    legalFees,
    stampDuty,
    sst,
    total: legalFees + stampDuty + sst,
  };
};

const calculateTenancy = (monthlyRent, years) => {
  const legalFees = 2400; // usually fixed
  const stampDuty = monthlyRent * years * 12 * 0.002;

  return {
    legalFees,
    stampDuty,
    sst: 0,
    total: legalFees + stampDuty,
  };
};

const LegalFeeCalculator = () => {
  const [buyPrice, setBuyPrice] = useState(388000);
  const [loanAmount, setLoanAmount] = useState(388000);
  const [rent, setRent] = useState(8000);
  const [years, setYears] = useState(2);

  const buy = calculateBuySell(buyPrice);
  const loan = calculateLoan(loanAmount);
  const tenancy = calculateTenancy(rent, years);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Legal Fees / Stamp Duty Calculator</h2>

      {/* Buy / Sell */}
      <div style={{ marginBottom: "30px" }}>
        <h4>Buy / Sell</h4>
        <input
          type="number"
          value={buyPrice}
          onChange={(e) => setBuyPrice(+e.target.value)}
        />
        <div>Legal Fees: <b>{formatCurrency(buy.legalFees)}</b></div>
        <div>Stamp Duty: <b>{formatCurrency(buy.stampDuty)}</b></div>
        <div>SST (8%): <b>{formatCurrency(buy.sst)}</b></div>
        <div style={{ color: "red", marginTop: 5 }}>
          Total Amount: <b>{formatCurrency(buy.total)}</b>
        </div>
      </div>

      {/* Loan */}
      <div style={{ marginBottom: "30px" }}>
        <h4>Loan</h4>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(+e.target.value)}
        />
        <div>Legal Fees: <b>{formatCurrency(loan.legalFees)}</b></div>
        <div>Stamp Duty: <b>{formatCurrency(loan.stampDuty)}</b></div>
        <div>SST (8%): <b>{formatCurrency(loan.sst)}</b></div>
        <div style={{ color: "red", marginTop: 5 }}>
          Total Amount: <b>{formatCurrency(loan.total)}</b>
        </div>
      </div>

      {/* Tenancy */}
      <div>
        <h4>Tenancy</h4>
        <label>
          Monthly Rent:{" "}
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(+e.target.value)}
          />
        </label>
        <br />
        <label>
          Tenancy Duration (Years):{" "}
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(+e.target.value)}
          />
        </label>
        <div>Legal Fees: <b>{formatCurrency(tenancy.legalFees)}</b></div>
        <div>Stamp Duty: <b>{formatCurrency(tenancy.stampDuty)}</b></div>
        <div style={{ color: "red", marginTop: 5 }}>
          Total Amount: <b>{formatCurrency(tenancy.total)}</b>
        </div>
        <small>
          The stamp duty is inclusive of one additional copy of stamping at RM10.
        </small>
      </div>
    </div>
  );
};

export default LegalFeeCalculator;
