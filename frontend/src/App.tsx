import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import FormSubmit from './pages/FormSubmit';
import FormResponses from './pages/FormResponses';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/submit/:formId" element={<FormSubmit />} />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/forms/create"
          element={
            <PrivateRoute>
              <CreateForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/forms/:formId/responses"
          element={
            <PrivateRoute>
              <FormResponses />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
