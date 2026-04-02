import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isSidebarPage =
    token &&
    (location.pathname === "/dashboard" ||
      location.pathname === "/mybookings" ||
      location.pathname === "/my-grounds" ||
      location.pathname === "/add-ground" ||
      location.pathname.startsWith("/book-ground/"));

  const navLinks = [
    { to: "/dashboard", label: "Grounds", icon: "🏟️" },
    { to: "/mybookings", label: "My Bookings", icon: "📅" },
    { to: "/my-grounds", label: "My Grounds", icon: "📍" },
    { to: "/add-ground", label: "Add Ground", icon: "➕" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isSidebarPage) {
    return (
      <>
        <aside
          className={`fixed left-0 top-0 hidden h-screen border-r border-emerald-100 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-700 text-white shadow-2xl md:flex md:flex-col transition-all duration-300 ${
            sidebarOpen ? "w-72 p-5" : "w-20 p-4"
          }`}
        >
          <div className="mb-8 flex items-center justify-between gap-3">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 font-black tracking-tight ${
                sidebarOpen ? "text-2xl" : "text-lg"
              }`}
            >
              <span className="text-3xl">⚽</span>
              {sidebarOpen && <span>SportsBooking</span>}
            </Link>

            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <svg
                className={`h-5 w-5 transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center rounded-xl py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-emerald-800 shadow-lg"
                      : "text-emerald-50 hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`text-base ${sidebarOpen ? "ml-4 mr-3" : "mx-auto"}`}>
                    {item.icon}
                  </span>
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

          <div className={`mt-auto rounded-xl border border-white/20 bg-white/10 ${sidebarOpen ? "p-4" : "p-3"}`}>
            {sidebarOpen && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                  Account
                </p>
                <p className="mt-1 text-sm text-white/90">You are logged in</p>
              </>
            )}
            <button
              onClick={handleLogout}
              className={`mt-4 w-full rounded-lg border border-red-300 bg-red-500/90 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600 ${
                sidebarOpen ? "" : "flex items-center justify-center"
              }`}
            >
              {sidebarOpen ? "Logout" : "⎋"}
            </button>
          </div>
        </aside>

        <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="text-xl font-black text-emerald-700"
            >
              ⚽ SportsBooking
            </Link>
            <button
              onClick={toggleMenu}
              className="rounded-md p-2 text-slate-700 transition hover:bg-slate-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <span className="font-semibold">Sidebar:</span>
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-md bg-emerald-600 px-3 py-1 font-semibold text-white"
            >
              {sidebarOpen ? "Collapse" : "Expand"}
            </button>
          </div>

          {isMenuOpen && (
            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
              {navLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full rounded-lg border border-red-300 px-3 py-2 text-left font-semibold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-2xl font-bold text-green-600 flex items-center gap-2"
          >
            ⚽ SportsBooking
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 hover:text-green-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Grounds
            </Link>

            {token && (
              <>
                <Link
                  to="/mybookings"
                  className="text-gray-700 hover:text-green-600 font-medium"
                >
                  My Bookings
                </Link>

                <Link
                  to="/my-grounds"
                  className="text-gray-700 hover:text-green-600 font-medium"
                >
                  My Grounds
                </Link>

                <Link
                  to="/add-ground"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  + Add Ground
                </Link>

                <button
                  onClick={handleLogout}
                  className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            )}

            {!token && (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Grounds
              </Link>

              {token && (
                <>
                  <Link
                    to="/mybookings"
                    className="text-gray-700 hover:text-green-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>

                  <Link
                    to="/my-grounds"
                    className="text-gray-700 hover:text-green-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Grounds
                  </Link>

                  <Link
                    to="/add-ground"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    + Add Ground
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="border border-red-500 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition text-left"
                  >
                    Logout
                  </button>
                </>
              )}

              {!token && (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-green-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;