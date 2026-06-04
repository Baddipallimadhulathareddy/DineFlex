import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import UserSignup from "./pages/UserSignup";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import SuperLogin from "./pages/SuperLogin";
import SuperDashboard from "./pages/SuperDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<Login />} />

        {/* Signup Routes */}
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/admin-signup" element={<AdminSignup />} />

        {/* Admin Dashboard Route */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* User Dashboard Route */}
        <Route path="/user-dashboard" element={<UserDashboard />} />

        {/* Super User Routes */}
        <Route path="/super-login" element={<SuperLogin />} />
        <Route path="/super-dashboard" element={<SuperDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;