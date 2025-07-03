import axios from "axios";

const hostname = window.location.hostname;

let baseURL = "https://dev-agentv3.propmall.net"; // default fallback

if (hostname.includes("prohartanah")) {
  baseURL = "https://dev-agentv3-prohartanah.propmall.net";
} else if (hostname.includes("hartawan")) {
  baseURL = "https://dev-agentv3-hartawan.propmall.net";
} else if (hostname.includes("salahproperty")) {
  baseURL = "https://dev-agentv3-salahproperty.propmall.net";
}

const API = axios.create({
  baseURL,
  headers: {
    Authentication: "TOKEN 67ce6d78ad121633723921",
    "Content-Type": "application/json",
  },
});

const defaultHeaders = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Agent profile
export const getAgent = (payload) => API.post("/graph/me", payload, defaultHeaders);

// Featured listing search
export const getFeaturedList = (payload) =>
  API.post("/graph/me/featured/search", payload, defaultHeaders);

// Location dropdown options
export const getLocations = () =>
  API.post("/graph/param/location/states/in/country", { id_country: 1 });

// Done Deal
export const getDoneDeal = (payload) =>
  API.post("/graph/me/donedeal/search", payload, defaultHeaders);

// Listings search
export const getListings = (payload) =>
  API.post("/graph/me/listing/search", payload, defaultHeaders);
