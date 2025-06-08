import axios from "axios";

const API = axios.create({
  baseURL: "https://dev-agentv3.propmall.net",
  headers: {
    Authentication: "TOKEN 67ce6d78ad121633723921",
    "Content-Type": "application/json",
  },
});

// Agent profile
export const getAgent = (payload) => API.post("/graph/me", payload);

// Featured listing search
export const getFeaturedList = (payload) =>
  API.post("/graph/me/featured/search", payload);

// Location dropdown options
export const getLocations = (payload) =>
  API.post("/graph/param/location/states/in/country", payload);
// Done Deal
export const getDoneDeal = (payload) =>
  API.post("/graph/me/donedeal/search", payload);



// Listings search
export const getListings = (payload) => API.post("/graph/me/listing/search", payload);
