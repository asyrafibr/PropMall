import axios from "axios";

const hostname = window.location.hostname;

const cleanHost = hostname.replace(/^www\./, "");

// Extract subdomain (e.g. 'prohartanah' from 'prohartanah.com')
let subdomain = null;
const parts = cleanHost.split(".");
if (parts.length >= 2) {
  subdomain = parts[0];
}

// Build baseURL dynamically

const coBaseURL = "TEST";


const API = axios.create({
  baseURL: coBaseURL,
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
