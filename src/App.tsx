import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Chats from "./features/chats/pages/chats";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import ForgotPassword from "./features/auth/pages/forgot-password";
import ResetPassword from "./features/auth/pages/reset-password";
import ProtectedRoute from "./components/guards/protected-routes";
import GuestRoutes from "./components/guards/guest-routes";
import AppLayout from "./components/layout/app-layout";
import ContactPreview from "./features/contacts/components/contact-preview";
import Contacts from "./features/contacts/pages/contacts";
import { ContactRequests } from "./features/contacts/pages/contact-requests";
import { EmptyState } from "./components/empty-state";
import ChatPreview from "./features/chats/components/chat-preview";
import Groups from "./features/chats/pages/groups";
import GroupPreview from "./features/chats/components/group-preview";

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
          <Route element={<AppLayout />}>
            {/* Chats */}
            <Route path="/chats" element={<Chats />}>
              <Route index element={<EmptyState variant="no-chat" />} />
              <Route path=":chatId" element={<ChatPreview />} />
            </Route>

            {/* Groups */}
            <Route path="/groups" element={<Groups />}>
              <Route index element={<EmptyState variant="no-group" />} />
              <Route path=":groupId" element={<GroupPreview />} />
            </Route>

            {/* Contacts */}
            <Route path="contacts" element={<Contacts />}>
              <Route index element={<EmptyState variant="no-contact" />} />
              <Route path=":contactId" element={<ContactPreview />} />
              <Route path="requests" element={<ContactRequests />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;