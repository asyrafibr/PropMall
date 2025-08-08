import React, { useState } from "react";
const formatCurrency = (value) => {
  return value.toLocaleString("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  });
};
const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
};
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

const calculateTenancy = (monthlyRent, durationMonths) => {
  const annualRent = monthlyRent * durationMonths;
  const stampDuty =
    annualRent <= 2400 ? 0 : annualRent <= 24000 ? 40 : 0.2 * annualRent;
  return {
    stampDuty,
  };
};

const LegalFeeCalculator = () => {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [rentalDuration, setRentalDuration] = useState("");

  const [buySellResult, setBuySellResult] = useState(null);
  const [loanResult, setLoanResult] = useState(null);
  const [tenancyResult, setTenancyResult] = useState(null);
  const [error, setError] = useState("");
  const [rpgtResult, setRpgtResult] = useState(null);
  const [rpgt, setRpgt] = useState({
    purchasePrice: "",
    disposalPrice: "",
    purchaseYear: "",
    disposalYear: "",
    permittedExpenses: "",
  });
  const [mortgageResult, setMortgageResult] = useState(null);
  const [mortgage, setMortgage] = useState({
    propertyPrice: "",
    loanAmount: "",
    interestRate: "",
    loanTenure: "",
  });
  const handleCalculateMortgage = () => {
    console.log("Loan Amount:", mortgage.loanAmount);
    console.log("Interest Rate:", mortgage.interestRate);
    console.log("Loan Tenure:", mortgage.loanTenure);
    const P = parseFloat(mortgage.loanAmount.replace(/,/g, ""));
    const r = parseFloat(mortgage.interestRate) / 100 / 12;
    const n = parseInt(mortgage.loanTenure) * 12;

    if (isNaN(P) || isNaN(r) || isNaN(n)) return;

    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const total = monthly * n;
    const interest = total - P;
    const principal = P;

    const downpayment =
      parseFloat(mortgage.propertyPrice.replace(/,/g, "")) - P;
    console.log("monthly", monthly);
    console.log("P", P);

    console.log("r", r);

    console.log("n", n);

    setMortgageResult({
      monthly: Math.round(monthly),
      principal,
      interest: Math.round(interest),
      downpayment,
    });
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

  const handleCalculateLoan = () => {
    const loanValue = parseFloat(loanAmount.replace(/,/g, ""));
    if (isNaN(loanValue) || loanValue <= 0) return;
    setLoanResult(calculateLoan(loanValue));
  };
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
  const handleCalculateTenancy = () => {
    const rent = parseFloat(monthlyRent.replace(/,/g, ""));
    const duration = parseInt(rentalDuration);
    if (isNaN(rent) || rent <= 0 || isNaN(duration) || duration <= 0) return;
    setTenancyResult(calculateTenancy(rent, duration));
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        alignItems: "flex-start",
        padding: "20px",
      }}
    >
      <div
        style={{
          minWidth: "800px",
          margin: "0 auto",
          fontFamily: "Poppins",
        }}
      >
        <h3 style={{ paddingTop: 40 }}>Legal Fees / Stamp Duty Calculator</h3>

        {/* Section Card */}
        <div style={styles.card}>
          <h4>Buy / Sell</h4>
          <div style={styles.flexRow}>
            <div style={{ ...styles.leftCol, marginBottom: "5%" }}>
              <label style={styles.textTitle}>Purchase Price</label>
              <input
                style={styles.input}
                value={`RM ${price}`}
                onChange={(e) => setPrice(e.target.value)}
              />

              <div style={{ flex: 1 }}>
                <label style={styles.textTitle}>Discount</label>
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    style={{
                      ...styles.input,
                      width: "100%",
                      paddingRight: "30px", // space for %
                    }}
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="0"
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#555",
                      pointerEvents: "none",
                    }}
                  >
                    %
                  </span>
                </div>
              </div>
              <button style={styles.button} onClick={handleCalculateBuySell}>
                Calculate
              </button>
              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}
            </div>

            <div style={styles.rightCol}>
              <text style={styles.textTitle}>Legal Fees :</text>{" "}
              <text style={{ ...styles.textTitle, fontWeight: 600 }}>
                {buySellResult ? formatCurrency(buySellResult.legalFees) : "-"}
              </text>
              <text style={styles.textTitle}>Discount (%) :</text>
              <text style={{ ...styles.textTitle, fontWeight: 600 }}>
                {buySellResult ? discount : "-"}
              </text>
              <text style={styles.textTitle}>Stamp Duty : </text>
              <text style={{ ...styles.textTitle, fontWeight: 600 }}>
                {buySellResult ? formatCurrency(buySellResult.stampDuty) : "-"}
              </text>
              <text style={styles.textTitle}>SST (%) : </text>
              <text style={{ ...styles.textTitle, fontWeight: 600 }}>
                {buySellResult ? formatCurrency(buySellResult.sst) : "-"}
              </text>
              <p style={styles.totalAmount}>Total Amount:</p>
              <p style={styles.totalAmount}>
                {buySellResult ? formatCurrency(buySellResult.total) : "-"}
              </p>
            </div>
          </div>

          {/* Loan */}
          <h4>Loan</h4>
          <div style={styles.flexRow}>
            <div style={styles.leftCol}>
              <label style={styles.textTitle}>Loan Amount</label>
              <input
                style={styles.input}
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
              <button style={styles.button} onClick={handleCalculateLoan}>
                Calculate
              </button>
            </div>

            <div style={styles.rightCol}>
              <text style={styles.textTitle}>Legal Fees </text>
              <text style={{ ...styles.textTitle, fontWeight: 600 }}>
                {loanResult ? formatCurrency(loanResult.legalFees) : "-"}
              </text>
              <text style={styles.textTitle}>Stamp Duty </text>
              <text>
                {loanResult ? formatCurrency(loanResult.stampDuty) : "-"}
              </text>
              <text style={{ ...styles.textTitle, fontWeight: 600 }}>
                {loanResult ? formatCurrency(loanResult.stampDuty) : "-"}
              </text>
              <text style={styles.textTitle}>SST (%) </text>
              <text style={{ ...styles.textTitle, fontWeight: 600 }}>
                {loanResult ? formatCurrency(loanResult.sst) : "-"}
              </text>

              <p style={styles.totalAmount}>Total Amount:</p>
              <p style={styles.totalAmount}>
                {loanResult ? formatCurrency(loanResult.total) : "-"}
              </p>
            </div>
          </div>

          {/* Tenancy */}
          <h4>Tenancy</h4>
          <div style={styles.flexRow}>
            <div style={styles.leftCol}>
              <label style={styles.textTitle}>Enter Monthly Rent</label>
              <input
                style={styles.input}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
              />
              <label style={styles.textTitle}>
                Enter Tenancy Duration (Years)
              </label>
              <input
                type="number"
                style={styles.input}
                value={rentalDuration}
                onChange={(e) => setRentalDuration(e.target.value)}
              />
              <button style={styles.button} onClick={handleCalculateTenancy}>
                Calculate
              </button>
            </div>

            <div style={styles.rightCol}>
              <text style={styles.textTitle}>Legal Fees</text>
              <text style={{ ...styles.textTitle, fontWeight: 600 }}>
                RM 2,400.00
              </text>
              <text style={styles.textTitle}>Stamp Duty </text>
              <text style={{ ...styles.textTitle, fontWeight: 600 }}>
                {tenancyResult ? formatCurrency(tenancyResult.stampDuty) : "-"}
              </text>
              <p style={styles.totalAmount}>Total Amount:</p>
              <p style={styles.totalAmount}>
                {tenancyResult
                  ? formatCurrency(2400 + tenancyResult.stampDuty)
                  : "-"}
              </p>
              <small
                style={{
                  fontSize: "12px",
                  marginTop: "10px",
                  display: "block",
                }}
              >
                The stamp duty above is inclusive of one additional copy of
                stamping at RM10
              </small>
            </div>
          </div>
        </div>
        <div style={styles.card}>
          <h4 style={styles.title}>Mortgage Calculator</h4>
          <div style={styles.flexRow}>
            {/* LEFT COLUMN */}
            <div style={styles.leftCol}>
              {/* Mortgage Breakdown */}
              <div style={styles.section}>
                <p style={styles.sectionTitle}>Mortgage Breakdown</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={styles.smallText}>Est. monthly repayment</p>
                  <h3 style={styles.monthlyText}>
                    {mortgageResult
                      ? formatCurrency(mortgageResult.monthly) + "/ month"
                      : "-"}
                  </h3>
                </div>

                {/* Progress bar */}
                <div style={styles.progressContainer}>
                  <div style={{ ...styles.progressBlue, width: "33%" }}></div>
                  <div style={{ ...styles.progressTeal, width: "67%" }}></div>
                </div>

                {/* Principal & Interest */}
                <div style={styles.legend}>
                  <span style={styles.legendItem}>
                    <span
                      style={{ ...styles.dot, background: "#1E90FF" }}
                    ></span>
                    RM{" "}
                    {mortgageResult
                      ? formatCurrency(
                          mortgageResult.principal /
                            (parseInt(mortgage.loanTenure) * 12)
                        )
                      : "-"}{" "}
                    Principal
                  </span>
                  <span style={styles.legendItem}>
                    <span
                      style={{ ...styles.dot, background: "#20B2AA" }}
                    ></span>
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
              <div style={styles.section}>
                <p style={styles.sectionTitle}>Upfront Costs</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <p style={styles.smallText}>Total Downpayment</p>
                  <h3 style={styles.monthlyText}>
                    {mortgageResult
                      ? formatCurrency(mortgageResult.downpayment)
                      : "-"}
                  </h3>
                </div>

                {/* Downpayment progress bar */}
                <div style={styles.progressContainer}>
                  <div style={{ ...styles.progressBlue, width: "11%" }}></div>
                  <div style={{ ...styles.progressTeal, width: "89%" }}></div>
                </div>

                <div style={styles.legend}>
                  <span style={styles.legendItem}>
                    <span
                      style={{ ...styles.dot, background: "#1E90FF" }}
                    ></span>
                    Downpayment
                  </span>
                  <span style={styles.legendItem}>
                    <span
                      style={{ ...styles.dot, background: "#20B2AA" }}
                    ></span>
                    RM{" "}
                    {mortgage.loanAmount
                      ? parseFloat(
                          mortgage.loanAmount.replace(/,/g, "")
                        ).toLocaleString()
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
              <button
                style={styles.calculateBtn}
                onClick={handleCalculateMortgage}
              >
                Calculate
              </button>
            </div>

            {/* RIGHT COLUMN */}
            <div style={styles.rightCol}>
              <label style={styles.textTitle}>Property Price</label>
              <input
                style={styles.input}
                value={`RM ${mortgage.propertyPrice}`}
                onChange={(e) =>
                  setMortgage({ ...mortgage, propertyPrice: e.target.value })
                }
              />

              <label style={styles.textTitle}>Loan Amount</label>
              <input
                style={styles.input}
                value={`RM ${mortgage.loanAmount}`}
                onChange={(e) =>
                  setMortgage({ ...mortgage, loanAmount: e.target.value })
                }
              />

              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                <div style={{ flex: 1 }}>
                  <label style={styles.textTitle}>Interest Rate</label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <input
                      style={{
                        ...styles.input,
                        width: "100%",
                        paddingRight: "30px", // space for %
                      }}
                      value={mortgage.interestRate}
                      onChange={(e) =>
                        setMortgage({
                          ...mortgage,
                          interestRate: e.target.value,
                        })
                      }
                      placeholder="3.5"
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#555",
                        pointerEvents: "none",
                      }}
                    >
                      %
                    </span>
                  </div>
                </div>

                <div style={{ position: "relative", flex: 1 }}>
                  <label style={styles.textTitle}>Loan Tenure</label>
                  <input
                    style={{
                      ...styles.input,
                      width: "100%",
                      paddingRight: "50px", // space for 'Years'
                    }}
                    value={mortgage.loanTenure}
                    onChange={(e) =>
                      setMortgage({ ...mortgage, loanTenure: e.target.value })
                    }
                    placeholder="30"
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "70%", // adjust for label spacing
                      transform: "translateY(-50%)",
                      color: "#999",
                      pointerEvents: "none",
                    }}
                  >
                    Years
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real Property Gain Tax */}
        <div style={styles.card}>
          <h4 style={{ marginBottom: "15px", fontWeight: "600" }}>
            Real Property Gain Tax
          </h4>

          <div style={{ display: "flex", gap: "20px" }}>
            {/* Left Column */}
            <div style={{ flex: 1 }}>
              <label
                style={{
                  ...styles.textTitle,
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Accuisition Date/ Initial Purchase Date
              </label>
              <input
                style={inputStyle}
                value={`RM ${rpgt.purchasePrice}`}
                onChange={(e) =>
                  setRpgt({ ...rpgt, purchasePrice: e.target.value })
                }
                placeholder="RM 388,000"
              />

              <label
                style={{
                  ...styles.textTitle,
                  display: "block",
                  margin: "15px 0 5px",
                }}
              >
                Disposal Date/ Selling Date
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <div style={{ position: "relative", flex: 1 }}>
                  <input
                    style={{
                      ...inputStyle,
                      width: "100%",
                      paddingRight: "50px", // space for the "Years" text
                      boxSizing: "border-box",
                    }}
                    value={rpgt.disposalPrice}
                    onChange={(e) =>
                      setRpgt({ ...rpgt, disposalPrice: e.target.value })
                    }
                    placeholder="30"
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#999",
                      pointerEvents: "none",
                    }}
                  >
                    Years
                  </span>
                </div>
              </div>

              <label
                style={{
                  ...styles.textTitle,
                  display: "block",
                  margin: "15px 0 5px",
                }}
              >
                Seller’s Nationality
              </label>
              <select
                style={{ ...inputStyle, appearance: "none" }}
                value={rpgt.nationality || ""}
                onChange={(e) =>
                  setRpgt({ ...rpgt, nationality: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="local">Local</option>
                <option value="foreigner">Foreigner</option>
              </select>

              <label
                style={{
                  ...styles.textTitle,
                  display: "block",
                  margin: "15px 0 5px",
                }}
              >
                Property Type
              </label>
              <div style={{ display: "flex", gap: "15px" }}>
                <label>
                  <input
                    type="radio"
                    checked={rpgt.propertyType === "residential"}
                    onChange={() =>
                      setRpgt({ ...rpgt, propertyType: "residential" })
                    }
                  />{" "}
                  Residential
                </label>
                <label>
                  <input
                    type="radio"
                    checked={rpgt.propertyType === "nonResidential"}
                    onChange={() =>
                      setRpgt({ ...rpgt, propertyType: "nonResidential" })
                    }
                  />{" "}
                  Non Residential
                </label>
              </div>

              <label
                style={{
                  ...styles.textTitle,
                  display: "block",
                  margin: "15px 0 5px",
                }}
              >
                Property Would the Seller like to be exempted from Gains Tax
              </label>
              <div style={{ display: "flex", gap: "15px" }}>
                <label>
                  <input
                    type="radio"
                    checked={rpgt.exempt === true}
                    onChange={() => setRpgt({ ...rpgt, exempt: true })}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    checked={rpgt.exempt === false}
                    onChange={() => setRpgt({ ...rpgt, exempt: false })}
                  />{" "}
                  No
                </label>
              </div>

              <button
                style={{
                  marginTop: "20px",
                  padding: "8px 16px",
                  border: "1px solid orange",
                  background: "transparent",
                  color: "orange",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={handleCalculateRPGT}
              >
                Calculate
              </button>
            </div>

            {/* Right Column */}
            <div style={{ flex: 1 }}>
              <label
                style={{
                  ...styles.textTitle,
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                PURCHASE PRICE Acquisition/ Purchase Price
              </label>
              <input
                style={inputStyle}
                value={`RM ${rpgt.purchasePrice}`}
                onChange={(e) =>
                  setRpgt({ ...rpgt, purchasePrice: e.target.value })
                }
                placeholder="RM 388,000"
              />

              <label
                style={{
                  ...styles.textTitle,
                  display: "block",
                  margin: "15px 0 5px",
                }}
              >
                Disposal/ Selling Price
              </label>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  style={{
                    ...inputStyle,
                    width: "100%",
                    paddingRight: "40px", // space for the text
                  }}
                  value={rpgt.disposalPrice}
                  onChange={(e) =>
                    setRpgt({ ...rpgt, disposalPrice: e.target.value })
                  }
                  placeholder="30"
                />
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                    pointerEvents: "none",
                  }}
                >
                  Years
                </span>
              </div>

              <label
                style={{
                  ...styles.textTitle,
                  display: "block",
                  margin: "15px 0 5px",
                }}
              >
                PERMITTED EXPENSES Others Permitted Expenses
              </label>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  style={{
                    ...inputStyle,
                    width: "100%",
                    paddingRight: "40px", // space for 'Years'
                  }}
                  value={rpgt.permittedExpenses}
                  onChange={(e) =>
                    setRpgt({ ...rpgt, permittedExpenses: e.target.value })
                  }
                  placeholder="30"
                />
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                    pointerEvents: "none",
                  }}
                >
                  Years
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  textTitle: {
    fontFamily: "Poppins",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
  },
  flexRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  leftCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  rightCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  button: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "white",
    border: "1px solid orange",
    color: "orange",
    borderRadius: "5px",
    cursor: "pointer",
    width: "120px",
  },
  totalLabel: {
    fontWeight: "bold",
    marginTop: "10px",
  },
  totalAmount: {
    color: "red",
    fontWeight: "bold",
    fontSize: "20px",
  },
  title: { marginBottom: "20px" },
  // flexRow: { display: "flex", gap: "20px" },
  // leftCol: { flex: 1 },
  // rightCol: { flex: 1, display: "flex", flexDirection: "column", gap: "10px" },
  section: { marginBottom: "30px" },
  sectionTitle: { fontWeight: "bold", fontSize: "20px", fontFamily: "Poppins" },
  smallText: { fontSize: "12px", color: "#666" },
  monthlyText: { fontSize: "16px", fontWeight: "bold" },
  progressContainer: {
    display: "flex",
    height: "8px",
    background: "#eee",
    borderRadius: "5px",
    overflow: "hidden",
    margin: "10px 0",
  },
  progressBlue: { background: "#1E90FF" },
  progressTeal: { background: "#20B2AA" },
  legend: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginTop: "8px",
  },
  legendItem: { display: "flex", alignItems: "center", gap: "5px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%" },
  // input: {
  //   border: "1px solid #ccc",
  //   borderRadius: "5px",
  //   padding: "8px"
  // },
  calculateBtn: {
    marginTop: "15px",
    border: "1px solid #ff9900",
    background: "transparent",
    color: "#ff9900",
    padding: "8px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "120px",
  },
};

export default LegalFeeCalculator;
