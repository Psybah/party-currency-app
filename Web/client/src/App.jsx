import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContextWrapper } from "./context";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import ManageEvent from "./pages/ManageEvent";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import CelebrantSignup from "./pages/CelebrantSignup";
import MerchantSignup from "./pages/MerchantSignup";
import CustomCurrency from "./pages/CustomCurrency";
import ReconciliationService from "./pages/ReconciliationService";
import VendorKiosk from "./pages/VendorKiosk";
import FootSoldiers from "./pages/FootSoldiers";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  console.log("App component rendering"); // Debug log

  return (
    <Router>
      <ContextWrapper>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/celebrant-signup" element={<CelebrantSignup />} />
          <Route path="/merchant-signup" element={<MerchantSignup />} />
          
          {/* Feature Pages */}
          <Route path="/custom-currency" element={<CustomCurrency />} />
          <Route path="/reconciliation-service" element={<ReconciliationService />} />
          <Route path="/vendor-kiosk-system" element={<VendorKiosk />} />
          <Route path="/foot-soldiers" element={<FootSoldiers />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <PrivateRoute>
                <CreateEvent />
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-event"
            element={
              <PrivateRoute>
                <ManageEvent />
              </PrivateRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <PrivateRoute>
                <Templates />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </ContextWrapper>
    </Router>
  );
}

export default App;
