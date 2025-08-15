// src/App.tsx
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { RestaurantProvider } from "./context/RestaurantContext";

export default function App() {
  return (
    <RestaurantProvider>
      <RouterProvider router={router} />
    </RestaurantProvider>
  );
}
