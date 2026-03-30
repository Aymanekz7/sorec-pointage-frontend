import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_ENDPOINTS } from '../api/backend-api.config';
import { EmployeeDto } from '../../shared/contracts/backend/employee.dto';

export interface EmployeeQuery {
  departmentId?: number;
  siteId?: number;
  statusId?: number;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  constructor(private http: HttpClient) {}

  getAll(query?: EmployeeQuery): Observable<EmployeeDto[]> {
    let params = new HttpParams();

    if (query?.departmentId) params = params.set('departmentId', query.departmentId);
    if (query?.siteId) params = params.set('siteId', query.siteId);
    if (query?.statusId) params = params.set('statusId', query.statusId);
    if (query?.search) params = params.set('search', query.search);

    return this.http.get<EmployeeDto[]>(BACKEND_ENDPOINTS.employees, { params });
  }

  getByMatricule(matricule: string): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`${BACKEND_ENDPOINTS.employees}/${matricule}`);
  }

  create(payload: EmployeeDto): Observable<EmployeeDto> {
    return this.http.post<EmployeeDto>(BACKEND_ENDPOINTS.employees, payload);
  }

  update(matricule: string, payload: EmployeeDto): Observable<EmployeeDto> {
    return this.http.put<EmployeeDto>(`${BACKEND_ENDPOINTS.employees}/${matricule}`, payload);
  }
}
