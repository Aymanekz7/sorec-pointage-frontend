export interface EmployeeDto {
  id?: number;
  matricule: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  departmentId?: number;
  departmentName?: string;
  siteId?: number;
  siteName?: string;
  statusId?: number;
  statusLabel?: string;
}
