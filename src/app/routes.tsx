import { Navigate, Route, Routes, useNavigate } from "react-router"

import { EmptyState } from "@/components/empty-state"
import GuestRoutesWrapper from "@/components/guards/guest-routes-wrapper"
import ProtectedRouteWrapper from "@/components/guards/protected-routes-wrapper"
import AppLayout from "@/components/layout/app-layout"

import ForgotPassword from "@/features/auth/pages/forgot-password"
import Login from "@/features/auth/pages/login"
import Register from "@/features/auth/pages/register"
import ResetPassword from "@/features/auth/pages/reset-password"

import Chats from "@/features/chats/pages/chats"

import ContactPreview from "@/features/contacts/components/contact-preview"
import { ContactRequests } from "@/features/contacts/pages/contact-requests"
import Contacts from "@/features/contacts/pages/contacts"
import Groups from "@/features/groups/pages/groups"
import ChatPreview from "@/components/chat-preview"
import Profile from "@/features/profile/pages/profile"

export function AppRoutes() {
  const navigate = useNavigate()
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chats" replace />} />

      {/* Guest Routes */}
      <Route element={<GuestRoutesWrapper />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRouteWrapper />}>
        <Route element={<AppLayout />}>
          {/* Chats */}
          <Route path="/chats" element={<Chats />}>
            <Route index element={<EmptyState variant="no-chat" />} />
            <Route path=":chatId" element={<ChatPreview onBack={() => navigate("/chats")} />} />
          </Route>

          {/* Groups */}
          <Route path="/groups" element={<Groups />}>
            <Route index element={<EmptyState variant="no-group" />} />
            <Route path=":chatId" element={<ChatPreview onBack={() => navigate("/groups")} />} />
          </Route>

          {/* Contacts */}
          <Route path="contacts" element={<Contacts />}>
            <Route index element={<EmptyState variant="no-contact" />} />
            <Route path=":contactId" element={<ContactPreview />} />
            <Route path="requests" element={<ContactRequests />} />
          </Route>

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}

