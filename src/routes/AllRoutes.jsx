import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { SpinnerLoading } from "../libraries/CommonLoading";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const ChangePasswordPage = lazy(() => import("../pages/ChangePasswordPage"));
const BookmarksPage = lazy(() => import("../pages/BookmarksPage"));
const CreateEventPage = lazy(() => import("../pages/CreateEventPage"));
const ManageEventsPage = lazy(() => import("../pages/ManageEventsPage"));
const EventDetailsPage = lazy(() => import("../pages/EventDetailsPage"));
const EditEventPage = lazy(() => import("../pages/EditEventPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const Layout = lazy(() => import("../components/Layout"));

function AllRoutes() {
  return (
    <Router>
      <Suspense
        fallback={<SpinnerLoading fullscreen={true} message="Loading page..." />}
      >
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Public event details */}
            <Route path="/events/:id" element={<EventDetailsPage />} />

            {/* Protected routes */}
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <BookmarksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/new"
              element={
                <ProtectedRoute>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage"
              element={
                <ProtectedRoute>
                  <ManageEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id/edit"
              element={
                <ProtectedRoute>
                  <EditEventPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AllRoutes;
