// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import OnboardingLayout from "./layouts/OnboardingLayout";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import SelectPlace from "./pages/SelectPlace/SelectPlace";
import SelectType from "./pages/SelectType/SelectType";
import SelectConditions from "./pages/SelectConditions/SelectConditions";
import LoadingPage from "./pages/Loading/LoadingPage";
import OutputMainPage from "./pages/Output/OutputMainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Splash />,
  },
  {
    path: "/onboarding",
    element: <OnboardingLayout />,
    children: [{ index: true, element: <Onboarding /> }],
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "select-place", element: <SelectPlace /> },
      { path: "select-type", element: <SelectType /> },
      { path: "select/conditions", element: <SelectConditions /> },
      { path: "loading", element: <LoadingPage /> },
      { path: "output", element: <OutputMainPage /> },
    ],
  },
]);

export default router;
