import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import OnboardingLayout from "./layouts/OnboardingLayout";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import SelectPlace from "./pages/SelectPlace/SelectPlace";
import SelectType from "./pages/SelectType/SelectType";
import SelectConditions from "./pages/SelectConditions/SelectConditions";
import LoadingPage from "./pages/Loading/LoadingPage";
import OutputMainPage from "./pages/Output/OutputMainPage";
import OutputDetailPage from "./pages/Output/OutputDetailPage";
import Collaboration from "./pages/Collaboration/Collaboration";
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
    element: <MainLayout />,
    children: [
      { path: "select-place", element: <SelectPlace /> },
      { path: "select-type", element: <SelectType /> },
      { path: "select-conditions", element: <SelectConditions /> },
      { path: "output", element: <OutputMainPage /> },
      { path: "output-detail", element: <OutputDetailPage /> },
      { path: "collaboration", element: <Collaboration /> },
      { path: "community", element: <CommunityMainPage /> },
      { path: "community/post/new", element: <CommunityPostPage /> },
      { path: "community/post/:id", element: <PostDetail /> },
      { path: "community/search", element: <CommunitySearchPage /> },
      { path: "community/search/results", element: <CommunitySearchPage /> },
    ],
  },
]);

export default router;
