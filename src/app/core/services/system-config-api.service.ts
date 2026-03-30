import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_ENDPOINTS } from '../api/backend-api.config';
import { SystemConfigDto } from '../../shared/contracts/backend/system-config.dto';

@Injectable({ providedIn: 'root' })
export class SystemConfigApiService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<SystemConfigDto[]> {
    return this.http.get<SystemConfigDto[]>(BACKEND_ENDPOINTS.systemConfig);
  }
}
