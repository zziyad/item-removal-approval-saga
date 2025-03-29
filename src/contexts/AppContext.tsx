import React, { createContext, useContext, useState, useEffect } from "react";
import { RemovalRequest, User, RemovalReason, Image } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { 
  mockUsers, 
  mockRemovalReasons, 
  saveToLocalStorage, 
  loadFromLocalStorage,
  getNextStatus,
  getCurrentApprovalStage
} from "@/lib/mockData";
import { toast } from "../hooks/use-toast";

// Define a type for the item data
interface ItemData {
  description: string;
  reasonId: string;
  customReason?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  requests: RemovalRequest[];
  removalReasons: RemovalReason[];
  addRequest: (request: Omit<RemovalRequest, "id" | "userId" | "userName" | "department" | "status" | "approvals" | "createdAt" | "updatedAt">) => string | undefined;
  getRequest: (id: string) => RemovalRequest | undefined;
  updateRequestStatus: (id: string, approved: boolean, signature?: string, rejectionReason?: string) => void;
  users: User[];
  addImage: (requestId: string, imageUrl: string) => void;
  removeImage: (requestId: string, imageId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RemovalRequest[]>([]);
  const [removalReasons] = useState<RemovalReason[]>(mockRemovalReasons);
  const [users] = useState<User[]>(mockUsers);

  // Load state from localStorage on initial render
  useEffect(() => {
    const { requests: storedRequests, currentUser } = loadFromLocalStorage();
    setRequests(storedRequests);
    setUser(currentUser);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(requests, user);
  }, [requests, user]);

  const addRequest = (newRequestData: Omit<RemovalRequest, "id" | "userId" | "userName" | "department" | "status" | "approvals" | "createdAt" | "updatedAt">) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a request",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    
    const newRequest: RemovalRequest = {
      id: uuidv4(),
      userId: user.id,
      userName: user.name,
      department: user.department,
      status: "PENDING_HOD",
      approvals: [],
      createdAt: now,
      updatedAt: now,
      ...newRequestData,
    };

    setRequests((prevRequests) => [...prevRequests, newRequest]);
    
    toast({
      title: "Success",
      description: "Removal request created successfully",
    });

    return newRequest.id;
  };

  const getRequest = (id: string) => {
    return requests.find((request) => request.id === id);
  };

  const updateRequestStatus = (id: string, approved: boolean, signature?: string, rejectionReason?: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to approve or reject requests",
        variant: "destructive",
      });
      return;
    }

    setRequests((prevRequests) => {
      return prevRequests.map((request) => {
        if (request.id === id) {
          const currentStage = getCurrentApprovalStage(request.status);
          
          if (!currentStage) {
            return request;
          }

          const approval = {
            stage: currentStage,
            approved,
            signature,
            rejectionReason,
            approvedBy: user.name,
            timestamp: new Date(),
          };

          const newStatus = approved 
            ? getNextStatus(request.status) 
            : "REJECTED";

          const updatedRequest = {
            ...request,
            status: newStatus,
            approvals: [...request.approvals, approval],
            updatedAt: new Date(),
          };

          const statusMessage = approved ? "approved" : "rejected";
          
          toast({
            title: `Request ${statusMessage}`,
            description: `The removal request has been ${statusMessage} successfully.`,
          });
          
          return updatedRequest;
        }
        return request;
      });
    });
  };

  const addImage = (requestId: string, imageUrl: string) => {
    setRequests((prevRequests) => {
      return prevRequests.map((request) => {
        if (request.id === requestId) {
          const newImage: Image = {
            id: uuidv4(),
            url: imageUrl,
          };
          
          return {
            ...request,
            images: [...request.images, newImage],
            updatedAt: new Date(),
          };
        }
        return request;
      });
    });
  };

  const removeImage = (requestId: string, imageId: string) => {
    setRequests((prevRequests) => {
      return prevRequests.map((request) => {
        if (request.id === requestId) {
          return {
            ...request,
            images: request.images.filter((image) => image.id !== imageId),
            updatedAt: new Date(),
          };
        }
        return request;
      });
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        requests,
        removalReasons,
        addRequest,
        getRequest,
        updateRequestStatus,
        users,
        addImage,
        removeImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
