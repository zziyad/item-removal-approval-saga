
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { canUserApprove } from "@/lib/mockData";

const Dashboard = () => {
  const { user, requests } = useApp();
  const navigate = useNavigate();

  // Count of requests by status
  const myRequests = requests.filter(req => req.userId === user?.id);
  const pendingApprovals = requests.filter(req => user && canUserApprove(user.role, req.status));
  const pendingCount = myRequests.filter(req => !["APPROVED", "REJECTED"].includes(req.status)).length;
  const approvedCount = myRequests.filter(req => req.status === "APPROVED").length;
  const rejectedCount = myRequests.filter(req => req.status === "REJECTED").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* My Requests Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Requests</CardTitle>
              <CardDescription>Summary of your removal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-amber-500 mr-2" />
                    <span>Pending</span>
                  </div>
                  <span className="font-medium">{pendingCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Approved</span>
                  </div>
                  <span className="font-medium">{approvedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span>Rejected</span>
                  </div>
                  <span className="font-medium">{rejectedCount}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/my-requests")}
              >
                <FileText className="mr-2 h-4 w-4" />
                View All Requests
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pending Approvals */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
              <CardDescription>Requests waiting for your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pendingApprovals.length > 0 ? (
                  pendingApprovals.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex justify-between items-center">
                      <div className="truncate max-w-[180px]">{request.itemDescription}</div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/request/${request.id}`)}
                      >
                        Review
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-2">
                    No pending approvals
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/approvals")}
                disabled={pendingApprovals.length === 0}
              >
                View All Approvals
              </Button>
            </CardFooter>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                onClick={() => navigate("/new-request")}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Removal Request
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => navigate("/approvals")}
                disabled={pendingApprovals.length === 0}
              >
                Review Pending Approvals
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates on removal requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.length > 0 ? (
                requests
                  .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                  .slice(0, 5)
                  .map((request) => (
                    <div key={request.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div>
                        <h3 className="font-medium">{request.itemDescription}</h3>
                        <p className="text-sm text-gray-500">
                          Status: <span className={
                            request.status === "APPROVED" 
                              ? "text-green-600" 
                              : request.status === "REJECTED" 
                                ? "text-red-600" 
                                : "text-amber-600"
                          }>
                            {request.status.replace("_", " ")}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">
                          Updated: {request.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
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
