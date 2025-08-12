// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Onboarding from "./pages/Onboarding";
import SelectType from "./pages/SelectType/SelectType";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Onboarding /> },
      { path: "select-type", element: <SelectType /> },
    ],
  },
]);

export default router;
