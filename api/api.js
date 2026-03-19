import axios from "axios";

const API = axios.create({
  baseURL: "https://sattvik.hemkumar.cloud/api",
});

export default API;