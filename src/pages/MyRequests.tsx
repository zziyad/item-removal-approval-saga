
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, XCircle, Plus, Search } from "lucide-react";

const MyRequests = () => {
  const { user, requests } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter requests by current user
  const myRequests = requests.filter((req) => req.userId === user?.id);
  
  // Filter by search term
  const filteredRequests = myRequests.filter((req) =>
    req.itemDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group requests by status
  const pendingRequests = filteredRequests.filter(
    (req) => !["APPROVED", "REJECTED"].includes(req.status)
  );
  const approvedRequests = filteredRequests.filter((req) => req.status === "APPROVED");
  const rejectedRequests = filteredRequests.filter((req) => req.status === "REJECTED");
  
  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };
  
  // Get status icon
  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "APPROVED") return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === "REJECTED") return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-amber-500" />;
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Requests</h1>
          <Button onClick={() => navigate("/new-request")}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search requests..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>
          
          {/* Pending Requests Tab */}
          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2">No pending requests found</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        {request.itemDescription}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <p>Submitted on {request.createdAt.toLocaleDateString()}</p>
                        <p>
                          {request.term === "RETURNABLE" ? "Returnable" : "Non-Returnable"} •{" "}
                          {formatStatus(request.status)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon status={request.status} />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/request/${request.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
          
          {/* Approved Requests Tab */}
          <TabsContent value="approved" className="space-y-4 mt-6">
            {approvedRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2">No approved requests found</p>
              </div>
            ) : (
              approvedRequests.map((request) => (
                <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        {request.itemDescription}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <p>Approved on {request.updatedAt.toLocaleDateString()}</p>
                        <p>{request.term === "RETURNABLE" ? "Returnable" : "Non-Returnable"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon status={request.status} />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/request/${request.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
          
          {/* Rejected Requests Tab */}
          <TabsContent value="rejected" className="space-y-4 mt-6">
            {rejectedRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <XCircle className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2">No rejected requests found</p>
              </div>
            ) : (
              rejectedRequests.map((request) => (
                <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        {request.itemDescription}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        <p>Rejected on {request.updatedAt.toLocaleDateString()}</p>
                        <p>{request.term === "RETURNABLE" ? "Returnable" : "Non-Returnable"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon status={request.status} />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/request/${request.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MyRequests;
