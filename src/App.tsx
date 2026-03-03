import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Chats from "./pages/Chats/chats";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";
import ForgotPassword from "./pages/ForgotPassword/forgot-password";
import ResetPassword from "./pages/ResetPassword/reset-password";
import ProtectedRoute from "./components/protected-routes";
import GuestRoutes from "./components/guest-routes";
import ChatWindow from "./pages/Chats/components/chat-window";

export function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/chats" replace />} />

        {/* Guest Routes */}
        <Route element={<GuestRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/chats" element={<Chats />}>
            {/* <Route index element={<ChatWindowRoute />} /> */}
            <Route path=":id" element={<ChatWindow />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;