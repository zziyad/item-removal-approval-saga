
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

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();

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
      <div className="min-h-screen flex flex-col w-full bg-gray-50">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm border-b py-3 px-4 flex justify-between items-center md:hidden">
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
        <Sidebar>
          <SidebarHeader className="flex flex-col gap-2 p-4">
            <h2 className="text-lg font-bold">Item Removal System</h2>
            <div className="text-sm text-gray-700">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">{user.role} • {user.department}</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/dashboard")} 
                  tooltip="Dashboard"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/new-request")} 
                  tooltip="New Request"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Request</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/my-requests")} 
                  tooltip="My Requests"
                >
                  <FileText className="h-4 w-4" />
                  <span>My Requests</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/approvals")} 
                  tooltip="Approvals"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  <span>Approvals</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/profile")} 
                  tooltip="Profile"
                >
                  <UserCircle className="h-4 w-4" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout} 
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </Sidebar>

        {/* Content */}
        <SidebarInset>
          <div className="p-4 sm:p-6 h-full">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
