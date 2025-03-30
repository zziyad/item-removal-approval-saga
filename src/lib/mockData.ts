
import { RemovalReason, RemovalRequest, User, RemovalStatus, UserRole } from "@/types";

  export const mockUsers: User[] = [
    { id: "1", name: "John Doe", department: "IT", role: "EMPLOYEE", email: "john@z.com" },
    { id: "2", name: "Jane Smith", department: "IT", role: "HOD", email: "jane@z.com" },
    { id: "3", name: "Mike Johnson", department: "FINANCE", role: "FINANCE", email: "mike@z.com" },
    { id: "4", name: "Sarah Williams", department: "MANAGEMENT", role: "MOD", email: "sarah@z.com" },
    { id: "5", name: "David Brown", department: "SECURITY", role: "SECURITY", email: "david@z.com" },
    { id: "6", name: "Emily Davis", department: "HR", role: "EMPLOYEE", email: "emily@z.com" },
    { id: "7", name: "Admin User", department: "MANAGEMENT", role: "ADMIN", email: "admin@z.com" },
  ];

export const mockRemovalReasons: RemovalReason[] = [
  { id: "1", name: "Personal Use" },
  { id: "2", name: "Repair" },
  { id: "3", name: "Transfer to Another Department" },
  { id: "4", name: "Disposal" },
  { id: "5", name: "Sale" },
  { id: "6", name: "Other" },
];

export const mockRequests: RemovalRequest[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    department: "IT",
    term: "RETURNABLE",
    dateFrom: new Date(),
    dateTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    targetDepartment: "HR",
    employee: undefined,
    itemDescription: "Dell Laptop XPS 15",
    removalReasonId: "3",
    customReason: undefined,
    images: [{ id: "1", url: "https://picsum.photos/id/0/200/300" }],
    status: "PENDING_HOD",
    approvals: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    userId: "6",
    userName: "Emily Davis",
    department: "HR",
    term: "NON_RETURNABLE",
    dateFrom: new Date(),
    dateTo: undefined,
    targetDepartment: undefined,
    employee: "Sarah Johnson",
    itemDescription: "Office Chair",
    removalReasonId: "4",
    customReason: undefined,
    images: [
      { id: "2", url: "https://picsum.photos/id/1/200/300" },
      { id: "3", url: "https://picsum.photos/id/2/200/300" },
    ],
    status: "PENDING_FINANCE",
    approvals: [
      {
        stage: "HOD",
        approved: true,
        signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAA",
        approvedBy: "Jane Smith",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  }
];

// Context and local storage management
export const STORAGE_KEY = 'item-removal-app-state';

export const saveToLocalStorage = (
  requests: RemovalRequest[],
  currentUser: User | null
) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      requests,
      currentUser,
    })
  );
};

export const loadFromLocalStorage = (): {
  requests: RemovalRequest[];
  currentUser: User | null;
} => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    return {
      requests: mockRequests,
      currentUser: null,
    };
  }

  try {
    const data = JSON.parse(storedData);
    
    // Convert date strings back to Date objects
    const requests = data.requests.map((req: any) => ({
      ...req,
      dateFrom: new Date(req.dateFrom),
      dateTo: req.dateTo ? new Date(req.dateTo) : undefined,
      createdAt: new Date(req.createdAt),
      updatedAt: new Date(req.updatedAt),
      approvals: req.approvals.map((approval: any) => ({
        ...approval,
        timestamp: new Date(approval.timestamp),
      })),
    }));
    
    return {
      requests,
      currentUser: data.currentUser,
    };
  } catch (error) {
    console.error('Error loading data from localStorage', error);
    return {
      requests: mockRequests,
      currentUser: null,
    };
  }
};

export const getNextStatus = (currentStatus: RemovalStatus): RemovalStatus => {
  const statusFlow: Record<RemovalStatus, RemovalStatus> = {
    'DRAFT': 'PENDING_HOD',
    'PENDING_HOD': 'PENDING_FINANCE',
    'PENDING_FINANCE': 'PENDING_MOD',
    'PENDING_MOD': 'PENDING_SECURITY',
    'PENDING_SECURITY': 'APPROVED',
    'APPROVED': 'APPROVED',
    'REJECTED': 'REJECTED',
  };
  
  return statusFlow[currentStatus];
};

export const getCurrentApprovalStage = (status: RemovalStatus): 'HOD' | 'FINANCE' | 'MOD' | 'SECURITY' | null => {
  const stageMap: Record<RemovalStatus, 'HOD' | 'FINANCE' | 'MOD' | 'SECURITY' | null> = {
    'DRAFT': null,
    'PENDING_HOD': 'HOD',
    'PENDING_FINANCE': 'FINANCE',
    'PENDING_MOD': 'MOD',
    'PENDING_SECURITY': 'SECURITY',
    'APPROVED': null,
    'REJECTED': null,
  };
  
  return stageMap[status];
};

export const canUserApprove = (userRole: UserRole, requestStatus: RemovalStatus): boolean => {
  const roleStatusMap: Record<UserRole, RemovalStatus[]> = {
    'EMPLOYEE': [],
    'HOD': ['PENDING_HOD'],
    'FINANCE': ['PENDING_FINANCE'],
    'MOD': ['PENDING_MOD'],
    'SECURITY': ['PENDING_SECURITY'],
    'ADMIN': ['PENDING_HOD', 'PENDING_FINANCE', 'PENDING_MOD', 'PENDING_SECURITY'],
  };
  
  return roleStatusMap[userRole]?.includes(requestStatus) || false;
};
