import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpGetOptions, httpPostOptions } from '../../_shared/httpPostOptions';
import { BehaviorSubject } from 'rxjs';
import { LogSensorGerminator } from '../../_models/logsensorgerminator.model';

const DASHBOARD_GERMINATOR_CURRENT_API =
  'http://localhost:9090/dashboard/germinator/current';
const DASHBOARD_GERMINATOR_HISTORY_API =
  'http://localhost:9090/dashboard/germinator/history';
const IOT_GERMINATOR_UPDATE_HARDWARE_API =
  'http://localhost:9090/iot/update/hardware/module';

@Injectable({ providedIn: 'root' })
export class DashboardGerminatorService {
  private logSensorGerminatorsSource: BehaviorSubject<
    LogSensorGerminator[]
  > = new BehaviorSubject<LogSensorGerminator[]>([]);
  logSensorGerminators = this.logSensorGerminatorsSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  fetchGerminatorDashboardData(): Promise<any> {
    return this.httpClient
      .get<any>(DASHBOARD_GERMINATOR_CURRENT_API, httpGetOptions)
      .toPromise();
  }

  populateGerminatorDashboard() {
    this.fetchGerminatorDashboardData().then((response: HttpResponse<any>) => {
      let fetchedData = JSON.parse(JSON.stringify(response.body));

      let logSensorGerminators: LogSensorGerminator[] = [];

      for (let fetchedLogSensorGerminator of fetchedData.log_sensor_germinator) {
        let logSensorGerminator = new LogSensorGerminator();

        logSensorGerminator.loggedAt = fetchedLogSensorGerminator['logged_at'];
        logSensorGerminator.temperature =
          fetchedLogSensorGerminator['temperature'];
        logSensorGerminator.humidity = fetchedLogSensorGerminator['humidity'];

        logSensorGerminators.push(logSensorGerminator);
      }
      this.logSensorGerminatorsSource.next(logSensorGerminators);
    });
  }

  fetchGerminatorDashboardHistoryData(
    timeStampBegin: Date,
    timeStampEnd: Date
  ): Promise<any> {
    const body = {
      time_stamp_begin: timeStampBegin,
      time_stamp_end: timeStampEnd,
    };

    return this.httpClient
      .post<any>(DASHBOARD_GERMINATOR_HISTORY_API, body, httpPostOptions)
      .toPromise();
  }

  populateGerminatorDashboardHistory(timeStampBegin: Date, timeStampEnd: Date) {
    this.fetchGerminatorDashboardHistoryData(timeStampBegin, timeStampEnd).then(
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

  getLogSensorGerminators(): LogSensorGerminator[] {
    return this.logSensorGerminatorsSource.getValue();
  }
}
