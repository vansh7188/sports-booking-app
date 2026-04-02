import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link, Navigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim() || !password.trim()) {
      setFormError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      setFormError(error.response?.data?.message || "Login failed");
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
                Welcome Back,
                <br />
                Game Changer
              </h1>
              <p className="mt-4 max-w-sm text-emerald-100">
                Log in to manage your grounds, bookings, and playing schedule from one clean dashboard.
              </p>
            </div>

            <div className="space-y-3 text-sm text-emerald-50/95">
              <p>Quick bookings with live slot visibility</p>
              <p>Track all your reservations in one place</p>
              <p>Add and manage grounds with photos</p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mx-auto w-full max-w-md">
              <h2 className="text-3xl font-bold text-emerald-800">Sign In</h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your details to continue to the dashboard.
              </p>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
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
                    placeholder="Enter your password"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Signing in..." : "Login"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="font-semibold text-emerald-700 hover:text-emerald-800">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;