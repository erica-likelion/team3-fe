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
import CommunityMainPage from "./pages/Community/CommunityMainPage";
import CommunitySearchPage from "./pages/Community/CommunitySearchPage";
import PostDetail from "./pages/Community/PostDetail";
import CommunityPostPage from "./pages/Community/CommunityPostPage";

const router = createBrowserRouter([
  { path: "/", element: <Splash /> },
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
    element: <AppLayout />,
    children: [
      { path: "community", element: <CommunityMainPage /> },
      { path: "community/post/new", element: <CommunityPostPage /> },
      { path: "community/post/:id", element: <PostDetail /> },
      { path: "community/search", element: <CommunitySearchPage /> },
      { path: "community/search/results", element: <CommunitySearchPage /> },
      { path: "select-place", element: <SelectPlace /> },
      { path: "select-type", element: <SelectType /> },
      { path: "select/conditions", element: <SelectConditions /> },
      { path: "output", element: <OutputMainPage /> },
    ],
  },
]);

export default router;
