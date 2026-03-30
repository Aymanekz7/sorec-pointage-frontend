import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_ENDPOINTS } from '../api/backend-api.config';
import { SiteDto } from '../../shared/contracts/backend/site.dto';

@Injectable({ providedIn: 'root' })
export class SiteApiService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<SiteDto[]> {
    return this.http.get<SiteDto[]>(BACKEND_ENDPOINTS.sites);
  }
}
