import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null; // nothing to render
};

export default PageTracker;
