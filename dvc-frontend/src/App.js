import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./animations.css";
import { AuthProvider } from "./Auth/AuthContext";
import Login from "./Auth/login";
import Register from "./Auth/register";
import {
  default as About,
  default as AboutComponent,
} from "./components/about";
import CardAnalytics from "./components/cardAnalytics";
import CardCreate from "./components/CardCreate";
import CardView from "./components/CardView";
import Home from "./components/Home";
import MyCards from "./components/myCards";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes (accessible when not logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutComponent />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Private routes (require authentication) */}
          <Route element={<PrivateRoute />}>
            <Route path="/create" element={<CardCreate />} />
            <Route path="/edit/:id" element={<CardCreate />} />
            <Route path="/my-cards" element={<MyCards />} />
            <Route path="/analytics/:id" element={<CardAnalytics />} />
          </Route>

          {/* Routes accessible to everyone */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/view/:id" element={<CardView />} />

          {/* Catch all for non-existent routes */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
