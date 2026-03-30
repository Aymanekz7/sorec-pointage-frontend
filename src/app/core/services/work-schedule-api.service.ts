import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_ENDPOINTS } from '../api/backend-api.config';
import { WorkScheduleDto } from '../../shared/contracts/backend/work-schedule.dto';

@Injectable({ providedIn: 'root' })
export class WorkScheduleApiService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<WorkScheduleDto[]> {
    return this.http.get<WorkScheduleDto[]>(BACKEND_ENDPOINTS.workSchedules);
  }
}
