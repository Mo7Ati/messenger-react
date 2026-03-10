import { Navigate, Route, Routes } from "react-router"

import { EmptyState } from "@/components/empty-state"
import GuestRoutes from "@/components/guards/guest-routes"
import ProtectedRoute from "@/components/guards/protected-routes"
import AppLayout from "@/components/layout/app-layout"

import ForgotPassword from "@/features/auth/pages/forgot-password"
import Login from "@/features/auth/pages/login"
import Register from "@/features/auth/pages/register"
import ResetPassword from "@/features/auth/pages/reset-password"

import ChatPreview from "@/features/chats/components/chat-preview"
import Chats from "@/features/chats/pages/chats"

import ContactPreview from "@/features/contacts/components/contact-preview"
import { ContactRequests } from "@/features/contacts/pages/contact-requests"
import Contacts from "@/features/contacts/pages/contacts"

import GroupPreview from "@/features/chats/components/group-preview"
import Groups from "@/features/chats/pages/groups"

export function AppRoutes() {
  return (
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
  )
}

