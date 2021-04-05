import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpGetOptions, httpPostOptions } from '../../_shared/httpPostOptions';
import { BehaviorSubject, Observable } from 'rxjs';
import { LogSensorGerminator } from '../../_models/logsensorgerminator.model';
import { GerminatorSettings } from '../../_models/germinatorsettings.model';

const DASHBOARD_GERMINATOR_CURRENT_API =
  'http://localhost:9090/dashboard/germinator/current';
const DASHBOARD_GERMINATOR_HISTORY_API =
  'http://localhost:9090/dashboard/germinator/history';
const DASHBOARD_GERMINATOR_UPDATE_SETTINGS_API =
  'http://localhost:9090/dashboard/germinator/update';
const DASHBOARD_GERMINATOR_GET_ALL_SETTINGS_API =
  'http://localhost:9090/dashboard/germinator';

@Injectable({ providedIn: 'root' })
export class DashboardGerminatorService {
  private logSensorGerminatorSource: BehaviorSubject<
    LogSensorGerminator
  > = new BehaviorSubject<LogSensorGerminator>(new LogSensorGerminator());
  logSensorGerminator = this.logSensorGerminatorSource.asObservable();
  private lsLogSensorGerminatorHistorySource: BehaviorSubject<
    LogSensorGerminator[]
  > = new BehaviorSubject<LogSensorGerminator[]>([]);
  lsLogSensorGerminatorHistory = this.lsLogSensorGerminatorHistorySource.asObservable();

  constructor(private httpClient: HttpClient) {}

  fetchGerminatorDashboardData(): Promise<any> {
    return this.httpClient
      .get<any>(DASHBOARD_GERMINATOR_CURRENT_API, httpGetOptions)
      .toPromise();
  }

  updateGerminatorDashboard() {
    this.fetchGerminatorDashboardData().then((response: HttpResponse<any>) => {
      let fetchedData = JSON.parse(JSON.stringify(response.body));

      let logSensorGerminator = new LogSensorGerminator();

      logSensorGerminator.loggedAt = fetchedData['logged_at'];
      logSensorGerminator.temperature = fetchedData['temperature'];
      logSensorGerminator.humidity = fetchedData['humidity'];

      this.logSensorGerminatorSource.next(logSensorGerminator);
    });
  }

  fetchGerminatorDashboardHistoryData(
    timeStampBegin: Date,
    timeStampEnd: Date
  ): Promise<any> {
    const body = {
      time_stamp_begin: new Date(timeStampBegin).toJSON(),
      time_stamp_end: new Date(timeStampEnd).toJSON(),
    };

    return this.httpClient
      .post<any>(DASHBOARD_GERMINATOR_HISTORY_API, body, httpPostOptions)
      .toPromise();
  }

  updateGerminatorDashboardHistoryData(
    timeStampBegin: Date,
    timeStampEnd: Date
  ) {
    this.fetchGerminatorDashboardHistoryData(timeStampBegin, timeStampEnd).then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let lsLogSensorGerminator: LogSensorGerminator[] = [];

        for (let fetchedLogSensorGerminator of fetchedData.ls_log_sensor_germinator) {
          let logSensorGerminator = new LogSensorGerminator();

          logSensorGerminator.loggedAt =
            fetchedLogSensorGerminator['logged_at'];
          logSensorGerminator.temperature =
            fetchedLogSensorGerminator['temperature'];
          logSensorGerminator.humidity = fetchedLogSensorGerminator['humidity'];

          lsLogSensorGerminator.push(logSensorGerminator);
        }
        this.lsLogSensorGerminatorHistorySource.next(lsLogSensorGerminator);
      }
    );
  }

  updateGerminatorSettings(
    germinatorSettings: GerminatorSettings
  ): Observable<any> {
    return this.httpClient.post<any>(
      DASHBOARD_GERMINATOR_UPDATE_SETTINGS_API,
      germinatorSettings,
      httpPostOptions
    );
  }

  async getAllGerminatorSettings(): Promise<GerminatorSettings> {
    let receivedGerminatorSettings: GerminatorSettings = new GerminatorSettings();

    await this.httpClient
      .get(DASHBOARD_GERMINATOR_GET_ALL_SETTINGS_API, httpGetOptions)
      .toPromise()
      .then((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        receivedGerminatorSettings = fetchedData.germinator_settings;
      });

    return receivedGerminatorSettings;
  }

  getLogSensorGerminator(): LogSensorGerminator {
    return this.logSensorGerminatorSource.getValue();
  }
}
