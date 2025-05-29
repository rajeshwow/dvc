import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./animations.css";
import { AuthProvider } from "./Auth/AuthContext";
import Login from "./Auth/login";
import Register from "./Auth/register";

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
import TermsOfService from "./components/termsconditions";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <LayoutComponent>
          <Routes>
            {/* Public routes (accessible when not logged in) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/terms-and-conditions"
                element={<TermsOfService />}
              />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/faq" element={<FAQ />} />
            </Route>

            {/* Private routes (require authentication) */}
            <Route element={<PrivateRoute />}>
              <Route path="/create" element={<CardCreate />} />
              <Route path="/edit/:id" element={<CardEdit />} />
              <Route path="/my-cards" element={<MyCards />} />
              <Route path="/analytics/:id" element={<CardAnalytics />} />
              <Route path="/analytics" element={<CardAnalyticsDashboard />} />
            </Route>

            {/* Routes accessible to everyone */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/view/:id" element={<CardView />} />

            {/* Catch all for non-existent routes */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </LayoutComponent>
      </Router>
    </AuthProvider>
  );
}

export default App;
