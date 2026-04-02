import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await API.get("/api/bookings/mybookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (error) {
      console.log("My bookings error:", error.response?.data || error.message);
      alert("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingCount = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "booked"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "cancelled"
  ).length;

  const getStatusClasses = (status) => {
    const value = (status || "").toLowerCase();

    if (value === "booked") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (value === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-lime-600 pb-14 pt-12 text-white">
        <div className="pointer-events-none absolute -top-28 -right-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-50">
            Player Panel
          </p>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">My Bookings</h2>
          <p className="mt-3 max-w-2xl text-sm text-emerald-50/90 sm:text-base">
            Track all your booked slots, venue details, and booking statuses.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-50/90">Total Bookings</p>
              <p className="mt-1 text-3xl font-extrabold">{bookings.length}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-50/90">Active Bookings</p>
              <p className="mt-1 text-3xl font-extrabold">{upcomingCount}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-50/90">Cancelled</p>
              <p className="mt-1 text-3xl font-extrabold">{cancelledCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-5"
              >
                <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-3/5 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-700">No bookings yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              You have not booked any grounds yet. Explore grounds and book your first slot.
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
            >
              Browse Grounds
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-emerald-700">
                    {booking.ground?.groundName || "Ground"}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                      booking.status
                    )}`}
                  >
                    {booking.status || "pending"}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {booking.ground?.location || "N/A"}
                  </p>

                  <p>
                    <span className="font-semibold">Sport:</span>{" "}
                    {booking.ground?.sportType || "N/A"}
                  </p>

                  <p>
                    <span className="font-semibold">Date:</span> {booking.date}
                  </p>

                  <p>
                    <span className="font-semibold">Slot:</span> {booking.slot}
                  </p>
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                  <span className="font-semibold">Booking ID:</span> {booking._id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;