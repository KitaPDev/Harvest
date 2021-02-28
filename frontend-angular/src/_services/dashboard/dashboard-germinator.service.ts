import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpPostOptions } from '../../_shared/httpPostOptions';
import { BehaviorSubject } from 'rxjs';
import { LogSensorGerminator } from '../../_models/logsensorgerminator.model';

const DASHBOARD_GERMINATOR_API = 'http://localhost:9090/dashboard/germinator';

@Injectable({ providedIn: 'root' })
export class DashboardGerminatorService {
  private logSensorGerminatorsSource: BehaviorSubject<
    LogSensorGerminator[]
  > = new BehaviorSubject<LogSensorGerminator[]>([]);
  logSensorGerminators = this.logSensorGerminatorsSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  fetchGerminatorDashboardData(timeStampBegin: Date): Promise<any> {
    const body = {
      time_stamp_begin: new Date(timeStampBegin).toJSON(),
    };

    return this.httpClient
      .post<any>(DASHBOARD_GERMINATOR_API, body, httpPostOptions)
      .toPromise();
  }

  populateGerminatorDashboard(timeStampBegin: Date) {
    this.fetchGerminatorDashboardData(timeStampBegin).then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let logSensorGerminators: LogSensorGerminator[] = [];

        for (let fetchedLogSensorGerminator of fetchedData.log_sensor_germinator) {
          let logSensorGerminator = new LogSensorGerminator();

          logSensorGerminator.loggedAt =
            fetchedLogSensorGerminator['logged_at'];
          logSensorGerminator.temperature =
            fetchedLogSensorGerminator['temperature'];
          logSensorGerminator.humidity = fetchedLogSensorGerminator['humidity'];

          logSensorGerminators.push(logSensorGerminator);
        }
        this.logSensorGerminatorsSource.next(logSensorGerminators);
      }
    );
  }
}
