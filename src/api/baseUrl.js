// utils/baseURL.js
export const getBaseURL = () => {
  const hostname = window.location.hostname;
  const cleanHost = hostname.replace(/^www\./, "");
  const subdomain = cleanHost.split(".")[0] || "agentv3";

  return `https://dev-agentv3-${subdomain}.propmall.net`;
};
