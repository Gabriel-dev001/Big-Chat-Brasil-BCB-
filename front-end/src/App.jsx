import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/authContext";

import Login from "./pages/login";
import { Dashboard } from "./pages/dashboard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
