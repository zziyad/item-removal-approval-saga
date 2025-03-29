
import { useApp } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, UserCircle, Users, ClipboardCheck } from "lucide-react";

const Profile = () => {
  const { user, requests } = useApp();
  
  if (!user) return null;
  
  // User's request statistics
  const myRequests = requests.filter((req) => req.userId === user.id);
  const pendingCount = myRequests.filter((req) => !["APPROVED", "REJECTED"].includes(req.status)).length;
  const approvedCount = myRequests.filter((req) => req.status === "APPROVED").length;
  const rejectedCount = myRequests.filter((req) => req.status === "REJECTED").length;
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <UserCircle className="h-12 w-12 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-lg">{user.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>Department: {user.department}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>Role: {user.role}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ClipboardCheck className="h-4 w-4 text-gray-500" />
                    <span>Total Requests: {myRequests.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Request Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Request Statistics</CardTitle>
              <CardDescription>Overview of your removal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">{myRequests.length}</p>
                  <p className="text-sm text-blue-800 mt-1">Total</p>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
                  <p className="text-sm text-amber-800 mt-1">Pending</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                  <p className="text-sm text-green-800 mt-1">Approved</p>
                </div>
                
                <div className="col-span-3 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Approval Rate</h3>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-gray-600">
                          {myRequests.length > 0 
                            ? Math.round((approvedCount / myRequests.length) * 100) 
                            : 0}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div
                        style={{
                          width: `${
                            myRequests.length > 0
                              ? Math.round((approvedCount / myRequests.length) * 100)
                              : 0
                          }%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity Summary */}
              {myRequests.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Recent Activity</h3>
                  <div className="space-y-2">
                    {myRequests
                      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                      .slice(0, 3)
                      .map((request) => (
                        <div key={request.id} className="text-sm flex justify-between items-center border-b pb-2">
                          <div className="truncate max-w-[200px]">{request.itemDescription}</div>
                          <Badge
                            variant="outline"
                            className={
                              request.status === "APPROVED"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : request.status === "REJECTED"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
