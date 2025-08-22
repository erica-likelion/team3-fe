// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
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
    path: "/loading",
    element: <LoadingPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingLayout />,
    children: [{ index: true, element: <Onboarding /> }],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "select-place", element: <SelectPlace /> },
      { path: "select-type", element: <SelectType /> },
      { path: "select/conditions", element: <SelectConditions /> },
      { path: "output", element: <OutputMainPage /> },
    ],
  },
]);

export default router;
