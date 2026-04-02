import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Grounds({ radiusKm, setRadiusKm, userLocation, requestUserLocation }) {
  const [grounds, setGrounds] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedGround, setSelectedGround] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    setIsLoading(true);

    try {
      const res = await API.get("/api/grounds");
      setGrounds(res.data);
    } catch (error) {
      console.log("Fetch grounds error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = (groundId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    navigate(`/book-ground/${groundId}`);
  };

  const fetchGroundFeedback = async (ground) => {
    try {
      const res = await API.get(`/api/feedback/${ground._id}`);
      setFeedback(res.data);
    } catch (error) {
      console.log("Fetch feedback error:", error.response?.data || error.message);
      setFeedback([]);
    }
  };

  const handleViewDetails = async (ground) => {
    setSelectedGround(ground);
    setShowModal(true);
    await fetchGroundFeedback(ground);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGround(null);
    setFeedback([]);
    setNewFeedback({ rating: 5, comment: "" });
  };

  const handleSubmitFeedback = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!newFeedback.comment.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      await API.post(`/api/feedback/${selectedGround._id}`, newFeedback, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNewFeedback({ rating: 5, comment: "" });
      await fetchGrounds();
      await fetchGroundFeedback(selectedGround);

      alert("Review submitted successfully");
    } catch (error) {
      console.log("Submit feedback error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to submit feedback");
    }
  };

  const filteredGrounds = grounds.filter((ground) => {
    const name = ground.groundName || "";
    const location = ground.location || "";
    const sport = ground.sportType || "";

    const searchMatch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase()) ||
      sport.toLowerCase().includes(search.toLowerCase());

    const sportMatch =
      selectedSport === "all" ||
      sport.toLowerCase() === selectedSport.toLowerCase();

    let radiusMatch = true;

    if (
      userLocation &&
      Number.isFinite(ground.latitude) &&
      Number.isFinite(ground.longitude)
    ) {
      const distance = getDistanceInKm(
        userLocation.latitude,
        userLocation.longitude,
        ground.latitude,
        ground.longitude
      );

      radiusMatch = distance <= radiusKm;
    }

    return searchMatch && sportMatch && radiusMatch;
  });

  const uniqueSports = [
    "all",
    ...new Set(
      grounds
        .map((ground) => ground.sportType)
        .filter((sport) => sport && sport.trim() !== "")
        .map((sport) => sport.toLowerCase())
    ),
  ];

  const avgPricePerHour =
    grounds.length > 0
      ? Math.round(
          grounds.reduce((sum, ground) => sum + (ground.pricePerHour || 0), 0) /
            grounds.length
        )
      : 0;

  const topRatedCount = grounds.filter((ground) => ground.averageRating >= 4).length;

  const getImageSrc = (image) => {
    if (!image || image.trim() === "") {
      return "https://via.placeholder.com/600x300?text=Sports+Ground";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${import.meta.env.VITE_API_URL}${image}`;
  };

  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const toRadians = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;

    const deltaLat = toRadians(lat2 - lat1);
    const deltaLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  };

  const openDirections = (ground) => {
    const hasCoordinates =
      Number.isFinite(ground.latitude) && Number.isFinite(ground.longitude);

    const destination = hasCoordinates
      ? `${ground.latitude},${ground.longitude}`
      : encodeURIComponent(ground.location || ground.groundName);

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(directionsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-lime-600 pb-16 pt-12 text-white">
        <div className="pointer-events-none absolute -top-28 -right-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <p className="mb-4 inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-50">
                Dashboard
              </p>
              <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Find, Compare, and Book
                <br />
                Your Next Ground
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-emerald-50/90 sm:text-base">
                Discover verified sports venues by location, sport, price, and ratings, then reserve your slot in seconds.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="mb-3 text-sm font-semibold text-emerald-50">Quick Search</p>
              <input
                type="text"
                placeholder="Search grounds, city, sport..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/30 bg-white px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-emerald-200"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-50/90">Total Grounds</p>
              <p className="mt-1 text-3xl font-extrabold">{grounds.length}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-50/90">Sports Available</p>
              <p className="mt-1 text-3xl font-extrabold">{uniqueSports.length - 1}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-50/90">Top Rated (4+)</p>
              <p className="mt-1 text-3xl font-extrabold">{topRatedCount}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-50/90">Avg Price / Hour</p>
              <p className="mt-1 text-3xl font-extrabold">₹{avgPricePerHour}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-800">Available Grounds</h2>
          <p className="text-sm text-slate-500">
            Showing {filteredGrounds.length} of {grounds.length}
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Search Radius: {radiusKm} km
              </p>
              <p className="text-xs text-slate-500">
                Filter grounds by distance from your current location.
              </p>
            </div>

            <button
              type="button"
              onClick={requestUserLocation}
              className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {userLocation ? "Update My Location" : "Use My Location"}
            </button>
          </div>

          <input
            type="range"
            min="1"
            max="50"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="mt-3 w-full accent-emerald-600"
          />
        </div>

        {userLocation && (
          <p className="mb-5 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Showing grounds within {radiusKm} km of your current location.
          </p>
        )}

        <div className="mb-8 flex flex-wrap gap-2">
          {uniqueSports.map((sport) => (
            <button
              key={sport}
              type="button"
              onClick={() => setSelectedSport(sport)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                selectedSport === sport
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-48 animate-pulse bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredGrounds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-700">No grounds found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try changing your search text or selecting another sport category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedSport("all");
              }}
              className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGrounds.map((ground) => (
              <div
                key={ground._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative">
                  <img
                    src={getImageSrc(ground.image)}
                    alt={ground.groundName}
                    className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-emerald-700 shadow-lg">
                    ₹{ground.pricePerHour}/hr
                  </div>

                  <span className="absolute bottom-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {ground.sportType}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="mb-2 text-xl font-bold text-emerald-700">
                    {ground.groundName}
                  </h3>

                  <p className="mb-3 text-sm text-slate-600">
                    <span className="font-semibold">Location:</span>{" "}
                    {ground.location}
                  </p>

                  {userLocation &&
                    Number.isFinite(ground.latitude) &&
                    Number.isFinite(ground.longitude) && (
                      <p className="mb-3 text-sm text-emerald-700">
                        Distance: {getDistanceInKm(
                          userLocation.latitude,
                          userLocation.longitude,
                          ground.latitude,
                          ground.longitude
                        ).toFixed(1)} km
                      </p>
                    )}

                  <p className="mb-4 text-sm text-slate-600">
                    <span className="font-semibold">Slots:</span>{" "}
                    {ground.availableSlots && ground.availableSlots.length > 0
                      ? ground.availableSlots.join(", ")
                      : "No slots available"}
                  </p>

                  <div className="mb-5 rounded-lg bg-slate-50 p-2">
                    {ground.averageRating > 0 ? (
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.round(ground.averageRating) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-slate-600">
                          {ground.averageRating} ({ground.feedbackCount} reviews)
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No reviews yet</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewDetails(ground)}
                      className="min-w-[120px] flex-1 rounded-xl bg-slate-800 py-2.5 font-semibold text-white transition hover:bg-slate-900"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleBookNow(ground._id)}
                      className="min-w-[120px] flex-1 rounded-xl bg-emerald-600 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => openDirections(ground)}
                      className="w-full rounded-xl border border-emerald-300 py-2.5 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      Directions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedGround && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedGround.groundName}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={getImageSrc(selectedGround.image)}
                    alt={selectedGround.groundName}
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />

                  <div className="space-y-3">
                    <p className="text-gray-600">
                      <span className="font-semibold">📍 Location:</span>{" "}
                      {selectedGround.location}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">🏆 Sport:</span>{" "}
                      {selectedGround.sportType}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">📌 Coordinates:</span>{" "}
                      {Number.isFinite(selectedGround.latitude) &&
                      Number.isFinite(selectedGround.longitude)
                        ? `${selectedGround.latitude}, ${selectedGround.longitude}`
                        : "Not available"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">💰 Price:</span> ₹
                      {selectedGround.pricePerHour}/hr
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">⏰ Slots:</span>{" "}
                      {selectedGround.availableSlots &&
                      selectedGround.availableSlots.length > 0
                        ? selectedGround.availableSlots.join(", ")
                        : "No slots available"}
                    </p>

                    {selectedGround.averageRating > 0 ? (
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.round(selectedGround.averageRating)
                                ? "★"
                                : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {selectedGround.averageRating} (
                          {selectedGround.feedbackCount} reviews)
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No reviews yet</p>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      {selectedGround.features &&
                      selectedGround.features.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedGround.features.map((feature, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No features listed</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Feedback & Reviews</h3>

                  <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <h4 className="font-semibold mb-3">Add Your Review</h4>

                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Rating:
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setNewFeedback({ ...newFeedback, rating: star })
                            }
                            className={`text-2xl ${
                              star <= newFeedback.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      value={newFeedback.comment}
                      onChange={(e) =>
                        setNewFeedback({
                          ...newFeedback,
                          comment: e.target.value,
                        })
                      }
                      placeholder="Share your experience..."
                      className="w-full p-3 border rounded-lg mb-3"
                      rows="3"
                    />

                    <button
                      onClick={handleSubmitFeedback}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Submit Review
                    </button>
                  </div>

                  <div className="space-y-4">
                    {feedback.length === 0 ? (
                      <p className="text-gray-500">
                        No reviews yet. Be the first to review!
                      </p>
                    ) : (
                      feedback.map((item) => (
                        <div key={item._id} className="bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{item.userName}</span>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>{i < item.rating ? "★" : "☆"}</span>
                              ))}
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-2">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>

                          <p className="text-gray-700">{item.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openDirections(selectedGround)}
                    className="rounded-xl border border-emerald-300 px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Directions
                  </button>
                  <button
                    onClick={() => handleBookNow(selectedGround._id)}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold shadow-md"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Grounds;