import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "sonner";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Exercises from "./pages/Exercises";
import Plans from "./pages/Plans";
import UserPlans from "./pages/UserPlans";
import GoalPlans from "./pages/GoalPlans";
import CreateExercise from "./pages/CreateExercise";
import OAuth2Callback from "./pages/OAuth2Callback";
import Layout from "./components/Layout";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/callback" element={<OAuth2Callback />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/plans" element={<Plans />} />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <div>Sessions page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/generate"
              element={
                <ProtectedRoute>
                  <div>AI Generate page</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises/new"
              element={
                <ProtectedRoute>
                  <CreateExercise />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/plans/:username"
              element={
                <ProtectedRoute>
                  <UserPlans />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/plans/goal/:goalKey" element={<GoalPlans />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
