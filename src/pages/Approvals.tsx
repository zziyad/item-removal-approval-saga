
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, Search } from "lucide-react";
import { canUserApprove } from "@/lib/mockData";

const Approvals = () => {
  const { user, requests } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  if (!user) return null;
  
  // Filter requests that need current user's approval
  const pendingApprovals = requests.filter((req) => canUserApprove(user.role, req.status));
  
  // Further filter by search term and status
  const filteredApprovals = pendingApprovals.filter((req) => {
    const matchesSearch = req.itemDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };
  
  // Group unique statuses for filter
  const statuses = ["all", ...new Set(pendingApprovals.map((req) => req.status))];
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Pending Approvals</h1>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
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
          
          <div className="w-64">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Statuses" : formatStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Approval List */}
        <div className="space-y-4">
          {filteredApprovals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2">No pending approvals found</p>
            </div>
          ) : (
            filteredApprovals.map((request) => (
              <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">
                      {request.itemDescription}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500 mt-1">
                      <p>Requested by {request.userName}</p>
                      <p>Department: {request.department}</p>
                      <p>Status: {formatStatus(request.status)}</p>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <p>
                        {request.term === "RETURNABLE" ? "Returnable" : "Non-Returnable"} • 
                        Submitted on {request.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <Button onClick={() => navigate(`/request/${request.id}`)}>
                      Review
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Approvals;
