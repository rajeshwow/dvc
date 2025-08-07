import { GoogleOAuthProvider } from "@react-oauth/google";
import "antd/dist/reset.css"; // ✅ New for AntD v5+

import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./animations.css";
import "./App.css";
import { AuthProvider } from "./Auth/AuthContext";
import Login from "./Auth/login";
import Register from "./Auth/register";
import "./theme/default.css";

import ReactGA from "react-ga4";
import About from "./components/about";
import CardAnalytics from "./components/cardAnalytics";
import CardAnalyticsDashboard from "./components/cardAnalyticsDashboard";
import CardCreate from "./components/CardCreate";
import CardEdit from "./components/CardEdit";
import CardView from "./components/CardView";
import ContactUs from "./components/contactus";
import CookiePolicy from "./components/cookiepolicy";
import FAQ from "./components/faq";
import Home from "./components/Home";
import LayoutComponent from "./components/layout";
import MyCards from "./components/myCards";
import PrivacyPolicy from "./components/privacypolicy";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import ResetPassword from "./components/resetpassword";
import ScrollToTop from "./components/scrollToTop";

import { useEffect } from "react";
import AppointmentScheduler from "./components/appointmentSchedular";
import TermsOfService from "./components/termsconditions";
import PageTracker from "./GoogleAnalytics/pageTracker";
function App() {
  useEffect(() => {
    ReactGA.initialize("G-EW339CJBRE");
  }, []);
  return (
    <GoogleOAuthProvider clientId="597378065819-8e1v0f88ndrkp4uf4jhjv6sqtfvkp0ls.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <PageTracker />
          <LayoutComponent>
            <Routes>
              {/* Public routes (accessible when not logged in) */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
              </Route>

              {/* Private routes (require authentication) */}
              <Route element={<PrivateRoute />}>
                <Route path="/create" element={<CardCreate />} />
                <Route path="/edit/:id" element={<CardEdit />} />
                <Route path="/my-cards" element={<MyCards />} />
                <Route path="/analytics/:id" element={<CardAnalytics />} />
                <Route path="/analytics" element={<CardAnalyticsDashboard />} />
                <Route
                  path="/manage-appointments"
                  element={<AppointmentScheduler />}
                />
              </Route>

              {/* Routes accessible to everyone */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/view/:id" element={<CardView />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsOfService />}
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Catch all for non-existent routes */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </LayoutComponent>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
