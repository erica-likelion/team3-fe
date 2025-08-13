// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Onboarding from "./pages/Onboarding";
import SelectType from "./pages/SelectType/SelectType";
import SelectConditions from "./pages/SelectConditions/SelectConditions"; // ← 추가

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Onboarding /> },
      { path: "select-type", element: <SelectType /> },
      { path: "select/conditions", element: <SelectConditions /> }, // ← 추가
    ],
  },
]);

export default router;
