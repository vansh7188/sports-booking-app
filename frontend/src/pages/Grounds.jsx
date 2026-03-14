import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Grounds() {
  const [grounds, setGrounds] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGround, setSelectedGround] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    try {
      const res = await API.get("/api/grounds");
      console.log("Grounds data:", res.data);
      setGrounds(res.data);
    } catch (error) {
      console.log("Fetch grounds error:", error.response?.data || error.message);
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

  const handleViewDetails = async (ground) => {
    setSelectedGround(ground);
    setShowModal(true);

    try {
      const res = await API.get(`/api/feedback/${ground._id}`);
      setFeedback(res.data);
    } catch (error) {
      console.log("Fetch feedback error:", error);
      setFeedback([]);
    }
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
      const res = await API.post(
        `/api/feedback/${selectedGround._id}`,
        newFeedback,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedback([res.data, ...feedback]);
      setNewFeedback({ rating: 5, comment: "" });
      // Refresh grounds to update average rating
      fetchGrounds();
    } catch (error) {
      console.log("Submit feedback error:", error);
      alert(error.response?.data?.message || "Failed to submit feedback");
    }
  };

  const filteredGrounds = grounds.filter((ground) => {
    const name = ground.groundName || "";
    const location = ground.location || "";
    const sport = ground.sportType || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase()) ||
      sport.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getImageSrc = (image) => {
    if (!image || image.trim() === "") {
      return "https://via.placeholder.com/600x300?text=Sports+Ground";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `https://sports-booking-app-pi4g.onrender.com${image}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-500 py-12 shadow-md">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Find Your Perfect Sports Ground
          </h1>

          <p className="text-green-100 mb-6 text-lg">
            Search by ground name, location, or sport
          </p>

          <input
            type="text"
            placeholder="Search grounds, city, sport..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-2xl px-5 py-3 rounded-xl shadow-lg border-none focus:outline-none focus:ring-4 focus:ring-green-200 text-gray-700"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Available Grounds
        </h2>

        {filteredGrounds.length === 0 ? (
          <p className="text-gray-500 text-lg">No grounds found</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGrounds.map((ground) => (
              <div
                key={ground._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
              >
                <div className="relative">
                  <img
                    src={getImageSrc(ground.image)}
                    alt={ground.groundName}
                    className="w-full h-52 object-cover"
                  />

                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ₹{ground.pricePerHour}/hr
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    {ground.groundName}
                  </h3>

                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">📍 Location:</span>{" "}
                    {ground.location}
                  </p>

                  <div className="mb-3">
                    <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                      {ground.sportType}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    <span className="font-semibold">Slots:</span>{" "}
                    {ground.availableSlots && ground.availableSlots.length > 0
                      ? ground.availableSlots.join(", ")
                      : "No slots available"}
                  </p>

                  <div className="mb-4">
                    {ground.averageRating > 0 ? (
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(ground.averageRating) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {ground.averageRating} ({ground.feedbackCount} reviews)
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No reviews yet</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(ground)}
                      className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleBookNow(ground._id)}
                      className="flex-1 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition font-semibold shadow-md"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ground Details Modal */}
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
                      <span className="font-semibold">💰 Price:</span>{" "}
                      ₹{selectedGround.pricePerHour}/hr
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">⏰ Slots:</span>{" "}
                      {selectedGround.availableSlots && selectedGround.availableSlots.length > 0
                        ? selectedGround.availableSlots.join(", ")
                        : "No slots available"}
                    </p>

                    {selectedGround.averageRating > 0 && (
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(selectedGround.averageRating) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {selectedGround.averageRating} ({selectedGround.feedbackCount} reviews)
                        </span>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      {selectedGround.features && selectedGround.features.length > 0 ? (
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

                  {/* Add Feedback Form */}
                  <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <h4 className="font-semibold mb-3">Add Your Review</h4>
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">Rating:</label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                            className={`text-2xl ${
                              star <= newFeedback.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={newFeedback.comment}
                      onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
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

                  {/* Feedback List */}
                  <div className="space-y-4">
                    {feedback.length === 0 ? (
                      <p className="text-gray-500">No reviews yet. Be the first to review!</p>
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
      )}
    </div>
  );
}

export default Grounds;