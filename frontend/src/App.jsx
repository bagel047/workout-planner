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
import CreatePlan from "./pages/CreatePlan";
import PlanDetails from "./pages/PlanDetails";
import UserPlans from "./pages/UserPlans";
import GoalPlans from "./pages/GoalPlans";
import CreateExercise from "./pages/CreateExercise";
import SessionLog from "#pages/SessionLog.jsx";
import Sessions from "#pages/Sessions.jsx";
import SessionDetails from "#pages/SessionDetails.jsx";
import AiGenerate from "./pages/AiGenerate";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
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
            <Route
              path="/exercises/new"
              element={
                <ProtectedRoute>
                  <CreateExercise />
                </ProtectedRoute>
              }
            />
            <Route path="/plans" element={<Plans />} />
            <Route
              path="/plans/new"
              element={
                <ProtectedRoute>
                  <CreatePlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plans/myplans"
              element={
                <ProtectedRoute>
                  <UserPlans />
                </ProtectedRoute>
              }
            />
            <Route path="/plans/goal/:goalKey" element={<GoalPlans />} />
            <Route path="/plans/:id" element={<PlanDetails />} />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <Sessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions/log"
              element={
                <ProtectedRoute>
                  <SessionLog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions/:id"
              element={
                <ProtectedRoute>
                  <SessionDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/generate"
              element={
                <ProtectedRoute>
                  <AiGenerate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
