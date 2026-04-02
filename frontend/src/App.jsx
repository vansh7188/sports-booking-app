import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Grounds from "./pages/Grounds";
import MyBookings from "./pages/MyBookings";
import AddGround from "./pages/AddGround";
import MyGrounds from "./pages/MyGrounds";
import BookGround from "./pages/BookGround";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [radiusKm, setRadiusKm] = useState(10);
  const [userLocation, setUserLocation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedValue = localStorage.getItem("sidebarOpen");
    return savedValue === null ? true : savedValue === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen));
  }, [sidebarOpen]);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        alert("Unable to access your location");
      }
    );
  };

  const AppShell = () => {
    const location = useLocation();
    const showSidebarLayout =
      location.pathname === "/dashboard" ||
      location.pathname === "/mybookings" ||
      location.pathname === "/my-grounds" ||
      location.pathname === "/add-ground" ||
      location.pathname.startsWith("/book-ground/");
    const leftPaddingClass = showSidebarLayout
      ? sidebarOpen
        ? "md:pl-72"
        : "md:pl-20"
      : "";

    return (
      <div className={leftPaddingClass}>
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {showSidebarLayout && !sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="fixed left-4 top-4 z-50 hidden rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 md:block"
            aria-label="Open sidebar"
          >
            ☰ Menu
          </button>
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Grounds
                  radiusKm={radiusKm}
                  setRadiusKm={setRadiusKm}
                  userLocation={userLocation}
                  requestUserLocation={requestUserLocation}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/mybookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-ground"
            element={
              <ProtectedRoute>
                <AddGround />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-grounds"
            element={
              <ProtectedRoute>
                <MyGrounds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-ground/:id"
            element={
              <ProtectedRoute>
                <BookGround />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;