import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const DASHBOARD_GROWER_API = 'http://localhost:9090/dashboard/grower';
const IOT_UPDATE_MODULE_HARDWARE_API =
  'http://localhost:9090/iot/update/hardware/module';

@Injectable({ providedIn: 'root' })
export class DashboardGrowerService {
  constructor(private httpClient: HttpClient) {}
}
