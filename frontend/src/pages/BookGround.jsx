import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function BookGround() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ground, setGround] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    fetchGroundDetails();
  }, []);

  const fetchGroundDetails = async () => {
    try {
      const res = await API.get(`/api/grounds/${id}`);
      setGround(res.data);
    } catch (error) {
      console.log("Ground details error:", error.response?.data || error.message);
      alert("Failed to load ground details");
    }
  };

  const handleDummyPayment = (e) => {
    e.preventDefault();

    if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
      setPaymentStatus("failed");
      setPaymentMessage("Please fill in all payment details.");
      return;
    }

    if (cardNumber.replace(/\s+/g, "").length < 12 || cvv.length < 3) {
      setPaymentStatus("failed");
      setPaymentMessage("Please enter valid dummy card details.");
      return;
    }

    setPaymentStatus("paid");
    setPaymentMessage("Dummy payment successful. You can now confirm the booking.");
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (paymentStatus !== "paid") {
      alert("Please complete the dummy payment first");
      return;
    }

    try {
      const payload = {
        groundId: id,
        date,
        slot,
      };

      const res = await API.post("/api/bookings", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Booking success:", res.data);
      alert("Booking successful");
      navigate("/mybookings");
    } catch (error) {
      console.log("Booking error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  if (!ground) {
    return <div className="p-6 text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-lime-600 p-8 text-white lg:p-10">
            <p className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Secure Checkout
            </p>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              Book Your Ground
            </h2>
            <p className="mt-4 max-w-md text-emerald-50/90">
              Complete a dummy payment first, then confirm the booking. This is a simulated checkout for UI flow only.
            </p>

            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <h3 className="text-xl font-bold">{ground.groundName}</h3>
              <p className="mt-2 text-sm text-emerald-50/90">
                <span className="font-semibold">Sport:</span> {ground.sportType}
              </p>
              <p className="text-sm text-emerald-50/90">
                <span className="font-semibold">Location:</span> {ground.location}
              </p>
              <p className="mt-4 text-2xl font-extrabold">₹{ground.pricePerHour} / hour</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <h3 className="text-lg font-bold text-slate-800">Booking Details</h3>
              <p className="mt-2 text-sm text-slate-600">
                Select your date and time slot, then complete the dummy payment below.
              </p>
            </div>

            <form onSubmit={handleBooking} className="space-y-6">
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Slot</label>
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="">Select Slot</option>
                    {ground.availableSlots?.map((s, index) => (
                      <option key={index} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Dummy Payment</h3>
                    <p className="text-sm text-slate-600">Simulated payment gateway for UI only</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : paymentStatus === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {paymentStatus}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value);
                        setPaymentStatus("pending");
                        setPaymentMessage("");
                      }}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => {
                        setCardNumber(e.target.value);
                        setPaymentStatus("pending");
                        setPaymentMessage("");
                      }}
                      placeholder="4242 4242 4242 4242"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Expiry</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => {
                        setExpiry(e.target.value);
                        setPaymentStatus("pending");
                        setPaymentMessage("");
                      }}
                      placeholder="MM/YY"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => {
                        setCvv(e.target.value);
                        setPaymentStatus("pending");
                        setPaymentMessage("");
                      }}
                      placeholder="123"
                      maxLength={4}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                {paymentMessage && (
                  <p
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${
                      paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {paymentMessage}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleDummyPayment}
                    className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-black"
                  >
                    Pay Now
                  </button>

                  <div className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Dummy amount: <span className="font-bold">₹{ground.pricePerHour}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={paymentStatus !== "paid"
                }
                className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookGround;