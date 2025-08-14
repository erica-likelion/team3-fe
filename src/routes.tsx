// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import OnboardingLayout from "./layouts/OnboardingLayout";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import SelectType from "./pages/SelectType/SelectType";
import SelectConditions from "./pages/SelectConditions/SelectConditions";
import LoadingPage from "./pages/Loading/LoadingPage"; // ✅ 추가
import OutputMainPage from "./pages/Output/OutputMainPage"; // ✅ 추가(결과 페이지)

const router = createBrowserRouter([
  { path: "/", element: <Splash /> },
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
      { path: "loading", element: <LoadingPage /> }, // ✅ 등록
      { path: "output", element: <OutputMainPage /> }, // ✅ 등록
    ],
  },
]);

export default router;
