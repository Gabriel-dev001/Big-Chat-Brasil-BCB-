import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authContext";

import Login from "./pages/login";
import { Dashboard } from "./pages/dashboard";
import { Status } from "./pages/status";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
