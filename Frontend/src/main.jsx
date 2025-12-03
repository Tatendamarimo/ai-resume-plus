import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home/HomePage.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import { EditResume } from "./pages/dashboard/edit-resume/[resume_id]/EditResume.jsx";
import ViewResume from "./pages/dashboard/view-resume/[resume_id]/ViewResume.jsx";
import AuthPage from "./pages/auth/customAuth/AuthPage.jsx";
import CoverLetter from "./pages/dashboard/CoverLetter.jsx";
import ResumeScore from "./pages/dashboard/resume/ResumeScore.jsx";
import InterviewPrep from "./pages/dashboard/resume/InterviewPrep.jsx";
import { resumeStore } from "./store/store";
import { Provider } from "react-redux";
import AboutPage from "./pages/about/AboutPage.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/edit-resume/:resume_id",
        element: <EditResume />,
      },
      {
        path: "/dashboard/view-resume/:resume_id",
        element: <ViewResume />,
      },
      {
        path: "/cover-letter",
        element: <CoverLetter />,
      },
      {
        path: "/dashboard/resume/:resume_id/score",
        element: <ResumeScore />,
      },
      {
        path: "/dashboard/resume/:resume_id/interview",
        element: <InterviewPrep />,
      },
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/auth/sign-in",
    element: <AuthPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={resumeStore}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);