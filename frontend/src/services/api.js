import axios from "axios";

const API = axios.create({
  baseURL: "https://sports-booking-app-pi4g.onrender.com",
});

export default API;