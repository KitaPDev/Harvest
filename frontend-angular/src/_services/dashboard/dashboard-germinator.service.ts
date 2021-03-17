import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpGetOptions, httpPostOptions } from '../../_shared/httpPostOptions';
import { BehaviorSubject } from 'rxjs';
import { LogSensorGerminator } from '../../_models/logsensorgerminator.model';
import { ReservoirSettings } from '../../_models/reservoirsettings.model';
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

  updateGerminatorDashboard() {
    this.fetchGerminatorDashboardData().then((response: HttpResponse<any>) => {
      let fetchedData = JSON.parse(JSON.stringify(response.body));

      let logSensorGerminators: LogSensorGerminator[] = [];

      for (let fetchedLogSensorGerminator of fetchedData.log_sensor_germinators) {
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

  updateGerminatorDashboardHistory(timeStampBegin: Date, timeStampEnd: Date) {
    this.fetchGerminatorDashboardHistoryData(timeStampBegin, timeStampEnd).then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let logSensorGerminators: LogSensorGerminator[] = [];

        for (let fetchedLogSensorGerminator of fetchedData.log_sensor_germinators) {
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

  async updateGerminatorSettings(
    germinatorSettings: GerminatorSettings
  ): Promise<boolean> {
    let receivedGerminatorSettings: GerminatorSettings = new GerminatorSettings();

    await this.httpClient
      .post<any>(
        DASHBOARD_GERMINATOR_UPDATE_SETTINGS_API,
        germinatorSettings,
        httpPostOptions
      )
      .toPromise()
      .then((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        receivedGerminatorSettings.isAuto = fetchedData['is_auto'];
        receivedGerminatorSettings.humidityLow = fetchedData['humidity_low'];
        receivedGerminatorSettings.humidityHigh = fetchedData['humidity_high'];
        receivedGerminatorSettings.lightOnTime = fetchedData['light_on_time'];
        receivedGerminatorSettings.lightOffTime = fetchedData['light_off_time'];
        receivedGerminatorSettings.mister = fetchedData['mister'];
        receivedGerminatorSettings.led = fetchedData['led'];
      });

    return (
      JSON.stringify(germinatorSettings) ==
      JSON.stringify(receivedGerminatorSettings)
    );
  }

  async getAllGerminatorSettings(): Promise<GerminatorSettings[]> {
    let receivedGerminatorSettings: GerminatorSettings[] = [];

    await this.httpClient
      .get(DASHBOARD_GERMINATOR_GET_ALL_SETTINGS_API, httpGetOptions)
      .toPromise()
      .then((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        receivedGerminatorSettings = fetchedData.germinator_settings;
      });

    return receivedGerminatorSettings;
  }

  getLogSensorGerminators(): LogSensorGerminator[] {
    return this.logSensorGerminatorsSource.getValue();
  }
}
