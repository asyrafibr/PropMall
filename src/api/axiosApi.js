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
const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_BASE
    : window.location.origin;
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
export const getAgent = (payload) =>
  API.post("/graph/me", payload, defaultHeaders);
export const getListingInfo = ({ id_listing, domain, url_fe }) =>
  API.post(
    "/graph/me/listing/info",
    { id_listing, domain, url_fe },
    defaultHeaders
  );
// Featured listing search
export const getFeaturedList = (payload) =>
  API.post("/graph/me/featured/search", payload, defaultHeaders);
export const getLocationTree = (payload) =>
  API.post("/graph/param/location", payload, defaultHeaders);
// Location dropdown options
export const getLocations = () =>
  API.post("/graph/param/location/states/in/country", { id_country: 1 });

// Done Deal
export const getDoneDeal = (payload) =>
  API.post("/graph/me/donedeal/search", payload, defaultHeaders);

// Done Deal Detail
export const getDoneDealDetail = (payload) =>
  API.post("/graph/me/donedeal/info", payload, defaultHeaders);

// Listings search
export const getListings = (payload) =>
  API.post("/graph/me/listing/search", payload, defaultHeaders);

//Category
export const getCategory = (payload) =>
  API.post("/graph/param/property/category", payload);
//Holding
export const getHolding = (payload) =>
  API.post("/graph/param/property/holdingandlottype", payload);
//Lot
export const getLot = (payload) =>
  API.post("/graph/param/property/lottype", payload);