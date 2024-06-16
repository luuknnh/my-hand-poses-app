import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RoutesWithAnimation from "./pages/routes/RoutesWithAnimation";
const App = () => {
  return (
    // <div>
    //   <HandTracking />
    // </div>
    <>
      <BrowserRouter>
        <RoutesWithAnimation></RoutesWithAnimation>
      </BrowserRouter>
    </>
  );
};

export default App;
