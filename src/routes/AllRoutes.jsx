import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { SpinnerLoading } from "../libraries/CommonLoading";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
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
          </Route>
          {/* <Route path="/auth" element={<AuthPage />} /> */}

          {/* <Route element={<AppShell />}>
         
          </Route> */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AllRoutes;
