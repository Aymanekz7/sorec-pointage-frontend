import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_ENDPOINTS } from '../api/backend-api.config';
import { AlertRuleDto } from '../../shared/contracts/backend/alert-rule.dto';

@Injectable({ providedIn: 'root' })
export class AlertRuleApiService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<AlertRuleDto[]> {
    return this.http.get<AlertRuleDto[]>(BACKEND_ENDPOINTS.alertRules);
  }

  update(id: number, payload: AlertRuleDto): Observable<AlertRuleDto> {
    return this.http.put<AlertRuleDto>(`${BACKEND_ENDPOINTS.alertRules}/${id}`, payload);
  }
}
