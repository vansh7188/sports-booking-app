import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://sports-booking-app-pi4g.onrender.com",
});

export default API;