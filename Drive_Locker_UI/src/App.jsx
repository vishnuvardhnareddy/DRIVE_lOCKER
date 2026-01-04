import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Pages/Layout";
import Login from "./Pages/Login";
import EmailVerify from "./Pages/EmailVerify";
import ResetPassword from "./Pages/ResetPassword";
import Home from "./Pages/Home";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Files from "./Pages/Files";
import CreatePasskey from "./Pages/CreatePasskey";
import Features from "./Pages/Features";
import Notes from "./Pages/Notes";

const ProtectedRoute = ({ children }) => {
  const { isLoggedin, isLoading } = useContext(AppContext);

  // Wait until the authentication check is complete
  if (isLoading) {
    return <div>Loading...</div>; // Render a loading message while auth is being checked
  }

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Restrict routes to users NOT logged in (e.g., login page)
const PublicRoute = ({ children }) => {
  const { isLoggedin, isLoading } = useContext(AppContext);

  if (isLoading) {
    return <div>Loading...</div>; // Also wait here to avoid a flash of content
  }

  if (isLoggedin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { isLoading } = useContext(AppContext);

  if (isLoading) {
    return <div>Loading App...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* ... your routes remain the same ... */}
        <Route index element={<Home />} />
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/* All other routes are protected */}
        <Route
          path="email-verify"
          element={
            <ProtectedRoute>
              <EmailVerify />
            </ProtectedRoute>
          }
        />
        <Route
          path="reset-password"
          element={
            <ResetPassword />
          }
        />
        <Route
          path="/Features"
          element={
            <ProtectedRoute>
              <Features />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Createpasskey"
          element={
            <ProtectedRoute>
              <CreatePasskey />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Files"
          element={
            <ProtectedRoute>
              <Files />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;