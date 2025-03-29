import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { canUserApprove } from "@/lib/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { user, requests } = useApp();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Count of requests by status
  const myRequests = requests.filter(req => req.userId === user?.id);
  const pendingApprovals = requests.filter(req => user && canUserApprove(user.role, req.status));
  const pendingCount = myRequests.filter(req => !["APPROVED", "REJECTED"].includes(req.status)).length;
  const approvedCount = myRequests.filter(req => req.status === "APPROVED").length;
  const rejectedCount = myRequests.filter(req => req.status === "REJECTED").length;

  return (
    <AppLayout>
      <div className={isMobile ? "space-y-5 px-2 pb-6" : "space-y-8 max-w-7xl mx-auto pb-10 px-4"}>
        <PageHeader 
          title="Dashboard" 
          description="Overview of your removal requests and activities" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* My Requests Summary */}
          <Card className="shadow-sm border-t-2 border-t-blue-100">
            <CardHeader className={isMobile ? "pb-2 px-4 pt-4" : "pb-3 px-6 pt-5"}>
              <CardTitle className={isMobile ? "text-lg" : "text-xl"}>My Requests</CardTitle>
              <CardDescription className={isMobile ? "text-xs" : "text-sm"}>Summary of your removal requests</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-4 py-2" : "px-6 py-3"}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-amber-500 mr-2" />
                    <span className={isMobile ? "text-sm" : "text-base"}>Pending</span>
                  </div>
                  <span className={isMobile ? "text-sm font-semibold" : "text-lg font-semibold"}>{pendingCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className={isMobile ? "text-sm" : "text-base"}>Approved</span>
                  </div>
                  <span className={isMobile ? "text-sm font-semibold" : "text-lg font-semibold"}>{approvedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className={isMobile ? "text-sm" : "text-base"}>Rejected</span>
                  </div>
                  <span className={isMobile ? "text-sm font-semibold" : "text-lg font-semibold"}>{rejectedCount}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className={isMobile ? "px-4 py-3" : "px-6 py-4"}>
              <Button 
                variant="outline" 
                className="w-full h-10" 
                onClick={() => navigate("/my-requests")}
              >
                <FileText className="mr-2 h-4 w-4" />
                View All Requests
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pending Approvals */}
          <Card className="shadow-sm border-t-2 border-t-amber-100">
            <CardHeader className={isMobile ? "pb-2 px-4 pt-4" : "pb-3 px-6 pt-5"}>
              <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Pending Approvals</CardTitle>
              <CardDescription className={isMobile ? "text-xs" : "text-sm"}>Requests waiting for your approval</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "px-4 py-2" : "px-6 py-3"}>
              <div className="space-y-3">
                {pendingApprovals.length > 0 ? (
                  pendingApprovals.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex justify-between items-center">
                      <div className="truncate max-w-[180px] text-sm">
                        {request.itemDescription}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 ml-2 whitespace-nowrap"
                        onClick={() => navigate(`/request/${request.id}`)}
                      >
                        Review
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-3">
                    No pending approvals
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className={isMobile ? "px-4 py-3" : "px-6 py-4"}>
              <Button 
                variant="outline" 
                className="w-full h-10" 
                onClick={() => navigate("/approvals")}
                disabled={pendingApprovals.length === 0}
              >
                View All Approvals
              </Button>
            </CardFooter>
          </Card>
          
          {/* Quick Actions */}
          <Card className="shadow-sm border-t-2 border-t-green-100">
            <CardHeader className={isMobile ? "pb-2 px-4 pt-4" : "pb-3 px-6 pt-5"}>
              <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Quick Actions</CardTitle>
              <CardDescription className={isMobile ? "text-xs" : "text-sm"}>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className={isMobile ? "space-y-3 px-4 py-2" : "space-y-4 px-6 py-3"}>
              <Button 
                className="w-full justify-start h-10" 
                onClick={() => navigate("/new-request")}
              >
                <Plus className="mr-2 h-5 w-5" />
                New Removal Request
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start h-10" 
                onClick={() => navigate("/approvals")}
                disabled={pendingApprovals.length === 0}
              >
                Review Pending Approvals
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card className="shadow-sm border-t-2 border-t-purple-100">
          <CardHeader className={isMobile ? "pb-2 px-4 pt-4" : "pb-3 px-6 pt-5"}>
            <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Recent Activity</CardTitle>
            <CardDescription className={isMobile ? "text-xs" : "text-sm"}>Latest updates on removal requests</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? "px-4 py-2" : "px-6 py-3"}>
            <div className="space-y-4">
              {requests.length > 0 ? (
                requests
                  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                  .slice(0, 5)
                  .map((request) => (
                    <div key={request.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div className="max-w-[70%]">
                        <h3 className={isMobile ? "font-medium text-sm truncate" : "font-medium truncate"}>
                          {request.itemDescription}
                        </h3>
                        <p className={isMobile ? "text-xs text-gray-500" : "text-sm text-gray-500"}>
                          Status: <span className={
                            request.status === "APPROVED" 
                              ? "text-green-600 font-medium" 
                              : request.status === "REJECTED" 
                                ? "text-red-600 font-medium" 
                                : "text-amber-600 font-medium"
                          }>
                            {request.status.replace("_", " ")}
                          </span>
                        </p>
                        <p className={isMobile ? "text-xs text-gray-400" : "text-xs text-gray-400"}>
                          Updated: {request.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 whitespace-nowrap"
                        onClick={() => navigate(`/request/${request.id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
