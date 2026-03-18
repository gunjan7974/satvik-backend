import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.29.43:5000/api",
});

export default API;