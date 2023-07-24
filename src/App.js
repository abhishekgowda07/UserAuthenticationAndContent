import { Navigate,BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route
          path="/"
          element={<Navigate to="/signup" replace />} // Redirect to the signup page by default
        />
      </Routes>
    </Router>
  );
}

export default App;
