// Branch related types and interfaces

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTOs for API requests
export interface CreateBranchDto {
  name: string;
  address: string;
  phone?: string;
  isActive?: boolean;
}

export interface UpdateBranchDto {
  name?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
}
