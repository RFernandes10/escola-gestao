export interface CreateEmployeeDTO {
  fullName: string;
  cpf: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  admissionDate: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateEmployeeDTO {
  fullName?: string;
  cpf?: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  admissionDate?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}