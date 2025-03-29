import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import {
  LogOut,
  Plus,
  FileText,
  ClipboardCheck,
  UserCircle,
  Home
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b py-3 px-4 flex justify-between items-center md:hidden">
          <div className="flex items-center">
            <SidebarTrigger className="mr-3" />
            <h1 className="text-lg font-bold text-gray-900">Item Removal</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout} 
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        {/* Sidebar */}
        <Sidebar className="border-r shadow-sm bg-white">
          <SidebarHeader className="flex flex-col gap-2 p-5 border-b">
            <h2 className="text-xl font-bold">Item Removal System</h2>
            <div className="text-sm text-gray-700">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs uppercase tracking-wide text-gray-500">{user.role} • {user.department}</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="py-2">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/dashboard")} 
                  tooltip="Dashboard"
                  className="py-3 px-4 hover:bg-gray-100 text-base"
                >
                  <Home className="h-5 w-5 mr-3" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/new-request")} 
                  tooltip="New Request"
                  className="py-3 px-4 hover:bg-gray-100 text-base"
                >
                  <Plus className="h-5 w-5 mr-3" />
                  <span>New Request</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/my-requests")} 
                  tooltip="My Requests"
                  className="py-3 px-4 hover:bg-gray-100 text-base"
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <span>My Requests</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/approvals")} 
                  tooltip="Approvals"
                  className="py-3 px-4 hover:bg-gray-100 text-base"
                >
                  <ClipboardCheck className="h-5 w-5 mr-3" />
                  <span>Approvals</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/profile")} 
                  tooltip="Profile"
                  className="py-3 px-4 hover:bg-gray-100 text-base"
                >
                  <UserCircle className="h-5 w-5 mr-3" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-5 border-t">
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center h-10 gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </Sidebar>

        {/* Content */}
        <SidebarInset>
          <div className={isMobile ? "h-full overflow-y-auto pt-14" : "h-full overflow-y-auto"}>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
