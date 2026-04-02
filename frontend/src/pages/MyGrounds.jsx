import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyGrounds() {
  const [grounds, setGrounds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyGrounds();
  }, []);

  const fetchMyGrounds = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await API.get("/api/grounds/mygrounds", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGrounds(res.data);
    } catch (error) {
      console.log("My grounds error:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageSrc = (image) => {
    if (!image || image.trim() === "") {
      return "https://via.placeholder.com/600x300?text=My+Ground";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${import.meta.env.VITE_API_URL}${image}`;
  };

  const avgPricePerHour =
    grounds.length > 0
      ? Math.round(
          grounds.reduce((sum, ground) => sum + (ground.pricePerHour || 0), 0) /
            grounds.length
        )
      : 0;

  const totalSlots = grounds.reduce(
    (sum, ground) => sum + (ground.availableSlots?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-lime-600 pb-14 pt-12 text-white">
        <div className="pointer-events-none absolute -top-28 -right-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-50">
            Owner Panel
          </p>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">
            My Grounds
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-emerald-50/90 sm:text-base">
            View and manage all your listed grounds from one place.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-50/90">Total Grounds</p>
              <p className="mt-1 text-3xl font-extrabold">{grounds.length}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-50/90">Average Price / Hour</p>
              <p className="mt-1 text-3xl font-extrabold">₹{avgPricePerHour}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-50/90">Total Slot Entries</p>
              <p className="mt-1 text-3xl font-extrabold">{totalSlots}</p>
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
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-44 animate-pulse bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : grounds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-700">No grounds yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              You have not added any grounds. Add your first one to start receiving bookings.
            </p>
            <button
              type="button"
              onClick={() => navigate("/add-ground")}
              className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
            >
              + Add Ground
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {grounds.map((ground) => (
              <div
                key={ground._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative">
                  <img
                    src={getImageSrc(ground.image)}
                    alt={ground.groundName}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  <span className="absolute bottom-3 left-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {ground.sportType}
                  </span>

                  <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-emerald-700 shadow-lg">
                    ₹{ground.pricePerHour}/hr
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="mb-2 text-xl font-bold text-emerald-700">
                    {ground.groundName}
                  </h3>

                  <p className="mb-3 text-sm text-slate-600">
                    <span className="font-semibold">Location:</span> {ground.location}
                  </p>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Slots:</span>{" "}
                      {ground.availableSlots && ground.availableSlots.length > 0
                        ? ground.availableSlots.join(", ")
                        : "No slots available"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyGrounds;