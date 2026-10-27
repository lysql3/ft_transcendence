import HomePage from "./pages/HomePage";
import SignInPage from "@/features/auth/pages/SignUpPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
