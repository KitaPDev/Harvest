import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpPostOptions } from '../_shared/httpPostOptions';
import { Plant } from '../_models/plant.model';

const PLANTS_API = `http://localhost:9090/plants`;

@Injectable({ providedIn: 'root' })
export class PlantsService {
  private plantsSource: BehaviorSubject<Plant[]> = new BehaviorSubject<Plant[]>(
    []
  );
  plants = this.plantsSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  createPlant(
    plantLabel: string,
    tdsHigh: number,
    tdsLow: number,
    phHigh: number,
    phLow: number,
    temperatureHigh: number,
    temperatureLow: number,
    lightsOffHour: number,
    lightsOnHour: number,
    mistingOffSecond: number,
    mistingOnSecond: number
  ) {
    const body = {
      plant_label: plantLabel,
      tds_high: tdsHigh,
      tds_low: tdsLow,
      ph_high: phHigh,
      ph_low: phLow,
      temperature_high: temperatureHigh,
      temperature_low: temperatureLow,
      lights_off_hour: lightsOffHour,
      lights_on_hour: lightsOnHour,
      misting_off_second: mistingOffSecond,
      misting_on_second: mistingOnSecond,
    };

    this.httpClient
      .post(PLANTS_API + '/create', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updatePlantsData();
            alert('Successful');
          }

          console.log(response);
        },
        (error) => {
          throwError(error);
          alert(error.error);
        }
      );
  }

  fetchPlantsData(): Promise<any> {
    return this.httpClient.get<any>(PLANTS_API, httpPostOptions).toPromise();
  }

  editPlant(
    index: number,
    plantLabel: string,
    tdsHigh: number,
    tdsLow: number,
    phHigh: number,
    phLow: number,
    temperatureHigh: number,
    temperatureLow: number,
    lightsOffHour: number,
    lightsOnHour: number,
    mistingOffSecond: number,
    mistingOnSecond: number
  ) {
    const body = {
      plant_id: this.plantsSource.getValue()[index].plantID,
      plant_label: plantLabel,
      tds_high: tdsHigh,
      tds_low: tdsLow,
      ph_high: phHigh,
      ph_low: phLow,
      temperature_high: temperatureHigh,
      temperature_low: temperatureLow,
      lights_off_hour: lightsOffHour,
      lights_on_hour: lightsOnHour,
      misting_off_second: mistingOffSecond,
      misting_on_second: mistingOnSecond,
    };

    this.httpClient.post(PLANTS_API + '/edit', body, httpPostOptions).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.updatePlantsData();
          alert('Successful');
        }

        console.log(response);
      },
      (error) => {
        throwError(error);
        alert(error.error);
      }
    );
  }

  deletePlant(index: number) {
    const body = {
      plant_id: this.plantsSource.getValue()[index].plantID,
    };

    this.httpClient
      .post(PLANTS_API + '/delete', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updatePlantsData();
            alert('Successful');
            console.log(this.plantsSource.getValue());
          }
        },
        (error) => {
          throwError(error);
          alert(error.error);
        }
      );
  }

  updatePlantsData() {
    this.fetchPlantsData().then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let plants: Plant[] = [];
        for (let data of fetchedData) {
          let plant = new Plant();

          plant.plantID = data['plant_id'];
          plant.plantLabel = data['plant_label'];
          plant.tdsHigh = data['tds_high'];
          plant.tdsLow = data['tds_low'];
          plant.phLow = data['ph_low'];
          plant.phHigh = data['ph_high'];
          plant.temperatureHigh = data['temperature_high'];
          plant.temperatureLow = data['temperature_low'];
          plant.lightsOffHour = data['lights_off_hour'];
          plant.lightsOnHour = data['lights_on_hour'];
          plant.mistingOffSecond = data['misting_off_second'];
          plant.mistingOnSecond = data['misting_on_second'];

          if (plant.plantID !== 0) {
            plants.push(plant);
          }
        }

        this.plantsSource.next(plants);
      },
      (error) => {
        throwError(error);
        alert(error.error);
      }
    );
  }
}
