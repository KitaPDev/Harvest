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
const DASHBOARD_GERMINATOR_GET_SETTINGS_API =
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
  private germinatorSettingsSource: BehaviorSubject<
    GerminatorSettings
  > = new BehaviorSubject<GerminatorSettings>(new GerminatorSettings());
  germinatorSettings = this.germinatorSettingsSource.asObservable();

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

      logSensorGerminator.loggedAt =
        fetchedData.log_sensor_germinator['logged_at'];
      logSensorGerminator.temperature =
        fetchedData.log_sensor_germinator['temperature'];
      logSensorGerminator.humidity =
        fetchedData.log_sensor_germinator['humidity'];

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

  getGerminatorSettings() {
    let receivedGerminatorSettings: GerminatorSettings = new GerminatorSettings();

    return this.httpClient
      .get(DASHBOARD_GERMINATOR_GET_SETTINGS_API, httpGetOptions)
      .toPromise()
      .then((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        if (fetchedData != undefined) {
          receivedGerminatorSettings.isAuto = fetchedData.germinator_settings;
        }

        this.germinatorSettingsSource.next(receivedGerminatorSettings);
      });
  }

  async updateGerminatorSettings(
    germinatorSettings: GerminatorSettings
  ): Promise<boolean> {
    let receivedGerminatorSettings: GerminatorSettings = new GerminatorSettings();

    const body = {
      is_auto: germinatorSettings.isAuto,
      humidity_low: germinatorSettings.isAuto,
      humidity_high: germinatorSettings.humidityHigh,
      light_on_time: germinatorSettings.lightOnTime,
      light_off_time: germinatorSettings.lightOffTime,
      mister: germinatorSettings.mister,
      fan: germinatorSettings.fan,
      led: germinatorSettings.led,
    };

    await this.httpClient
      .post<any>(
        DASHBOARD_GERMINATOR_UPDATE_SETTINGS_API,
        body,
        httpPostOptions
      )
      .toPromise()
      .then((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));
        let fetchedGerminatorSettings = fetchedData.germinator_settings;

        receivedGerminatorSettings.isAuto =
          fetchedGerminatorSettings['is_auto'];
        receivedGerminatorSettings.humidityLow =
          fetchedGerminatorSettings['humidity_low'];
        receivedGerminatorSettings.humidityHigh =
          fetchedGerminatorSettings['humidity_high'];
        receivedGerminatorSettings.lightOnTime =
          fetchedGerminatorSettings['light_on_time'];
        receivedGerminatorSettings.lightOffTime =
          fetchedGerminatorSettings['light_off_time'];
        receivedGerminatorSettings.mister = fetchedGerminatorSettings['mister'];
        receivedGerminatorSettings.fan = fetchedGerminatorSettings['fan'];
        receivedGerminatorSettings.led = fetchedGerminatorSettings['led'];

        this.germinatorSettingsSource.next(receivedGerminatorSettings);
      });

    return (
      JSON.stringify(germinatorSettings) ==
      JSON.stringify(receivedGerminatorSettings)
    );
  }

  getLogSensorGerminator(): LogSensorGerminator {
    return this.logSensorGerminatorSource.getValue();
  }
}
