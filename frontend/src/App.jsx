import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

  return (
    <BrowserRouter>
      <Navbar />

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
    </BrowserRouter>
  );
}

export default App;