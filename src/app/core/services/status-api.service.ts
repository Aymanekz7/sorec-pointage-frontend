import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_ENDPOINTS } from '../api/backend-api.config';
import { StatusDto } from '../../shared/contracts/backend/status.dto';

@Injectable({ providedIn: 'root' })
export class StatusApiService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<StatusDto[]> {
    return this.http.get<StatusDto[]>(BACKEND_ENDPOINTS.statuses);
  }
}
