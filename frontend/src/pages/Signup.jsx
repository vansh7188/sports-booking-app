import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link, Navigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (password.trim().length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await API.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      console.log("Signup response:", res.data);
      setFormSuccess("Account created successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      console.log("Signup error:", error.response?.data || error.message);
      setFormError(error.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-lime-200/60 blur-3xl" />

        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-emerald-100 bg-white/90 shadow-2xl backdrop-blur md:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-500 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <p className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                SportsBooking
              </p>
              <h1 className="text-4xl font-extrabold leading-tight">
                Join The League,
                <br />
                Book Smarter
              </h1>
              <p className="mt-4 max-w-sm text-emerald-100">
                Create your account and start booking grounds, tracking matches, and managing your sports routine with ease.
              </p>
            </div>

            <div className="space-y-3 text-sm text-emerald-50/95">
              <p>Discover top-rated grounds nearby</p>
              <p>Secure your preferred time slots quickly</p>
              <p>Manage bookings and hosting in one dashboard</p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mx-auto w-full max-w-md">
              <h2 className="text-3xl font-bold text-emerald-800">Create Account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Set up your account to start booking in minutes.
              </p>

              <form onSubmit={handleSignup} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFormError("");
                    }}
                    required
                    className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFormError("");
                    }}
                    required
                    className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFormError("");
                    }}
                    required
                    className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                {formError && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {formError}
                  </p>
                )}

                {formSuccess && (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {formSuccess}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Creating account..." : "Signup"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;