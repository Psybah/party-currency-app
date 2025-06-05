import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import Customize from "./pages/Customize";
import TermsOfService from "./pages/TermsOfService";
import MerchantTransactionHistory from "./pages/merchant/TransactionHistory";
import MerchantEventHistory from "./pages/merchant/EventHistory";
import MerchantSettings from "./pages/merchant/Settings";
import VirtualAccount from "./pages/merchant/VirtualAccount";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import EventManagement from "./pages/admin/EventManagement";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import FAQ from "./pages/FAQ";
import WhyChooseUs from "./pages/WhyChooseUs";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import GoogleAuth from "./pages/GoogleAuth";
import MyCurrencies from "./pages/MyCurrencies";
import EventDetailPage from "./pages/EventDetailPage";
import TransactionManagement from "./pages/admin/TransactionManagement";
import DashboardLayout from "./components/layouts/DashboardLayout";
import AdminLayout from "./components/layouts/AdminLayout";

function App() {
  return (
    <Router>
      <ContextWrapper>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/celebrant-signup" element={<CelebrantSignup />} />
          <Route path="/merchant-signup" element={<MerchantSignup />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/why-choose-us" element={<WhyChooseUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Feature Pages */}
          <Route path="/custom-currency" element={<CustomCurrency />} />
          <Route
            path="/reconciliation-service"
            element={<ReconciliationService />}
          />
          <Route path="/vendor-kiosk-system" element={<VendorKiosk />} />
          <Route path="/foot-soldiers" element={<FootSoldiers />} />

          {/* Admin Routes with Layout */}
          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              </AdminRouteGuard>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="events/:eventId" element={<EventDetailPage />} />
            <Route path="transactions" element={<TransactionManagement />} />
          </Route>

          {/* Celebrant Dashboard Routes with Layout */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute userType="customer">
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="customize" element={<Customize />} />
          </Route>

          <Route
            path="/create-event"
            element={
              <PrivateRoute userType="customer">
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<CreateEvent />} />
          </Route>

          <Route
            path="/manage-event"
            element={
              <PrivateRoute userType="customer">
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<ManageEvent />} />
          </Route>

          <Route
            path="/event/:eventId"
            element={
              <PrivateRoute userType="customer">
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<EventDetailPage />} />
          </Route>

          <Route
            path="/templates"
            element={
              <PrivateRoute userType="customer">
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Templates />} />
          </Route>

          <Route
            path="/my-currencies"
            element={
              <PrivateRoute userType="customer">
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<MyCurrencies />} />
          </Route>

          <Route
            path="/settings"
            element={
              <PrivateRoute userType="customer">
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Settings />} />
          </Route>

          {/* Merchant Routes (keeping these as is since they might have different layouts) */}
          <Route
            path="/merchant/virtual-account"
            element={
              <PrivateRoute userType="merchant">
                <VirtualAccount />
              </PrivateRoute>
            }
          />

          <Route
            path="/merchant/transactions"
            element={
              <PrivateRoute userType="merchant">
                <MerchantTransactionHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/merchant/events"
            element={
              <PrivateRoute userType="merchant">
                <MerchantEventHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/merchant/settings"
            element={
              <PrivateRoute userType="merchant">
                <MerchantSettings />
              </PrivateRoute>
            }
          />

          <Route path="/google/auth" element={<GoogleAuth />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ContextWrapper>
    </Router>
  );
}

export default App;
