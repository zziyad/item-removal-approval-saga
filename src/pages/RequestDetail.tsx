
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";
import RequestDetails from "@/components/RequestDetails";
import ApprovalActions from "@/components/ApprovalActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getRequest, removalReasons } = useApp();
  const navigate = useNavigate();
  
  const request = id ? getRequest(id) : undefined;
  
  useEffect(() => {
    if (!request && id) {
      // Request not found, redirect to dashboard
      navigate("/dashboard");
    }
  }, [request, id, navigate]);
  
  if (!request) {
    return null;
  }
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold">Request Details</h1>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
        </div>
        
        <RequestDetails request={request} removalReasons={removalReasons} />
        
        <ApprovalActions request={request} />
      </div>
    </AppLayout>
  );
};

export default RequestDetail;
