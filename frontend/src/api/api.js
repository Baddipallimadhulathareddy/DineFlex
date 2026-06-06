import axios from "axios";

const API = axios.create({
  baseURL: "https://dineflex-production.up.railway.app/api",
});

export default API;