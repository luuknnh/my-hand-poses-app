import { Route, Routes, useLocation } from "react-router-dom";
import Home from "../../components/Home";
import HandTracking from "../../components/HandTracking";
import { AnimationProvider } from "../../context/AnimationContext";

function RoutesWithAnimation() {
  const location = useLocation();
  return (
    <>
      <AnimationProvider>
        <Routes location={location} key={location.key}>
          <Route path="/" element={<Home />} />
          <Route path="track" element={<HandTracking />} />
        </Routes>
      </AnimationProvider>
    </>
  );
}

export default RoutesWithAnimation;
