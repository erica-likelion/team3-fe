// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import OnboardingLayout from "./layouts/OnboardingLayout";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import SelectType from "./pages/SelectType/SelectType";
import SelectConditions from "./pages/SelectConditions/SelectConditions"; // ← 추가

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
      { path: "select-type", element: <SelectType /> },
      { path: "select/conditions", element: <SelectConditions /> },
    ],
  },
]);

export default router;
