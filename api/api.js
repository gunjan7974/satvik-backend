import axios from "axios";

const API = axios.create({
  baseURL: "10.223.106.75:5000/api",
});

export default API;