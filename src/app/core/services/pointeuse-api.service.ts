import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_ENDPOINTS } from '../api/backend-api.config';
import { PointeuseDto } from '../../shared/contracts/backend/pointeuse.dto';

@Injectable({ providedIn: 'root' })
export class PointeuseApiService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<PointeuseDto[]> {
    return this.http.get<PointeuseDto[]>(BACKEND_ENDPOINTS.pointeuses);
  }
}
