import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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