import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_ENDPOINTS } from '../api/backend-api.config';
import { DepartmentDto } from '../../shared/contracts/backend/department.dto';

@Injectable({ providedIn: 'root' })
export class DepartmentApiService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(BACKEND_ENDPOINTS.departments);
  }

  getById(id: number): Observable<DepartmentDto> {
    return this.http.get<DepartmentDto>(`${BACKEND_ENDPOINTS.departments}/${id}`);
  }

  create(payload: DepartmentDto): Observable<DepartmentDto> {
    return this.http.post<DepartmentDto>(BACKEND_ENDPOINTS.departments, payload);
  }

  update(id: number, payload: DepartmentDto): Observable<DepartmentDto> {
    return this.http.put<DepartmentDto>(`${BACKEND_ENDPOINTS.departments}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${BACKEND_ENDPOINTS.departments}/${id}`);
  }
}
