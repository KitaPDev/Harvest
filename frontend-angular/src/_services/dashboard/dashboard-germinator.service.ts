import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const DASHBOARD_GERMINATOR_API = 'http://localhost:9090/dashboard/germinator';

@Injectable({ providedIn: 'root' })
export class DashboardGerminatorService {
  constructor(private httpClient: HttpClient) {}
}
