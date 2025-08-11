import { createBrowserRouter } from "react-router-dom";
import Onboarding from "./pages/Onboarding";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Onboarding />,
  },
]);

export default routes;
