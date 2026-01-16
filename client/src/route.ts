
import {App} from "./App";
import AuthLayout from "@/layout/AuthLayout";
import { LoginForm } from "@/components/auth/Login"
import {SignupForm} from '@/components/auth/Register'
import ResetPassword from '@/components/auth/ResetPassword'
import MainLayout from '@/layout/MainLayout'
import {MainPage} from '@/components/MainPage'
import { ProtectedRoute, PublicRoute } from '@/components/auth/ProtectedRoute'
import { CreateWorkspace } from '@/components/workspace/CreateWorkspace'
import { WorkspaceDetail } from '@/components/workspace/WorkspaceDetail'
import { EditWorkspace } from '@/components/workspace/EditWorkspace'
import { ProfileView } from '@/components/profile/ProfileView'
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm'
import { DeleteAccountForm } from '@/components/profile/DeleteAccountForm'

const routes = [
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/",
        Component: ProtectedRoute, // Bảo vệ các route cần đăng nhập
        children: [
          {
            Component: MainLayout,
            children: [
              { path: "", Component: MainPage },
              { path: "workspace/create", Component: CreateWorkspace },
              { path: "workspace/:id", Component: WorkspaceDetail },
              { path: "workspace/:id/edit", Component: EditWorkspace },
              { path: "profile", Component: ProfileView },
              { path: "profile/change-password", Component: ChangePasswordForm },
              { path: "profile/delete-account", Component: DeleteAccountForm },
            ],
          },
        ],
      },
      {
        path: "auth",
        Component: PublicRoute, // Chỉ cho phép truy cập khi chưa đăng nhập
        children: [
          {
            Component: AuthLayout,
            children: [
              { path: "login", Component: LoginForm },
              { path: "register", Component: SignupForm },
              { path: "reset-password", Component: ResetPassword },
            ],
          },
        ],
      },
     
    ],
  },
];

export default routes;