import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddGround() {
  const [groundName, setGroundName] = useState("");
  const [sportType, setSportType] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [availableSlots, setAvailableSlots] = useState("");
  const [features, setFeatures] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      },
      () => {
        alert("Unable to fetch your current location");
      }
    );
  };

  const handleAddGround = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("groundName", groundName);
      formData.append("sportType", sportType);
      formData.append("location", location);
      formData.append("latitude", Number(latitude));
      formData.append("longitude", Number(longitude));
      formData.append("pricePerHour", Number(pricePerHour));

      const slotsArray = availableSlots
        .split(",")
        .map((slot) => slot.trim())
        .filter((slot) => slot !== "");

      formData.append("availableSlots", JSON.stringify(slotsArray));

      const featuresArray = features
        .split(",")
        .map((feature) => feature.trim())
        .filter((feature) => feature !== "");

      formData.append("features", JSON.stringify(featuresArray));

      if (image) {
        formData.append("image", image);
      }

      const res = await API.post("/api/grounds", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Ground added:", res.data);
      alert("Ground added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log("Add ground error:", error);
      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);

      alert(error.response?.data?.message || "Failed to add ground");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Add Your Ground
        </h2>

        <form onSubmit={handleAddGround} className="space-y-4">
          <input
            type="text"
            placeholder="Ground Name"
            value={groundName}
            onChange={(e) => setGroundName(e.target.value)}
            required
            className="w-full border p-3 rounded-lg"
          />

          <select
            value={sportType}
            onChange={(e) => setSportType(e.target.value)}
            required
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Select Sport Type</option>
            <option value="cricket">Cricket</option>
            <option value="football">Football</option>
            <option value="badminton">Badminton</option>
            <option value="tennis">Tennis</option>
          </select>

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full border p-3 rounded-lg"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="number"
              step="any"
              placeholder="Latitude (e.g. 28.6139)"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="number"
              step="any"
              placeholder="Longitude (e.g. 77.2090)"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="w-full rounded-lg border border-green-300 bg-green-50 py-2.5 font-semibold text-green-700 transition hover:bg-green-100"
          >
            Use Current Coordinates
          </button>

          <input
            type="number"
            placeholder="Price Per Hour"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            required
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Available Slots (comma separated)"
            value={availableSlots}
            onChange={(e) => setAvailableSlots(e.target.value)}
            required
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Features (comma separated, e.g. Parking, Lighting, Shower)"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border p-3 rounded-lg bg-white"
          />

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full h-60 object-cover rounded-lg border"
            />
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Save Ground
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddGround;