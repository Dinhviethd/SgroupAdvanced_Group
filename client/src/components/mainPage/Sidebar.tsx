import * as React from "react";
import {
  GalleryVerticalEnd,
  Folder,
  LayoutDashboard,
  Plus,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getMyWorkspaces, type Workspace } from "@/service/workspaceService";
import { useAuth } from "@/store/authStore";
import { ViewSettingProfile } from "../Profile/view-setting-profile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { user, clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  React.useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const data = await getMyWorkspaces();
        setWorkspaces(data);
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Trello</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Workspaces Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarMenu>
            {loading ? (
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <span className="text-muted-foreground">Đang tải...</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : workspaces.length === 0 ? (
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <span className="text-muted-foreground">
                    Chưa có workspace
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              workspaces.map((workspace) => (
                <SidebarMenuItem key={workspace.idWorkspace}>
                  <SidebarMenuButton asChild>
                    <Link to={`/workspace/${workspace.idWorkspace}`}>
                      <Folder className="size-4" />
                      <span className="font-medium">{workspace.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
            {/* Nút tạo workspace mới */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="/workspace/create"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Plus className="size-4" />
                  <span>Tạo workspace mới</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* Profile */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ViewSettingProfile>
                <SidebarMenuButton className="h-12">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </SidebarMenuButton>
            </ViewSettingProfile>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="size-4" />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
