import axios from "axios";

const API = axios.create({
  baseURL: "https://dev-agentv3.propmall.net",
  headers: {
    Authentication: "TOKEN 67ce6d78ad121633723921",
    "Content-Type": "application/json",
  },
});

export const getAgent = (payload)=> API.post("/graph/me",payload);
export const getLocations = () => API.get("/locations");
export const getPriceYears = () => API.get("/price-years");
export const getListings = (payload) => API.post("/listings", payload);
