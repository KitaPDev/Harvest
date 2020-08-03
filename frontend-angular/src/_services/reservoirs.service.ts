import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { Nutrient } from '../_models/nutrient.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpGetOptions, httpPostOptions } from '../_shared/httpPostOptions';
import { Reservoir } from '../_models/reservoir.model';

const RESERVOIRS_API = `http://localhost:9090/reservoirs`;

@Injectable({ providedIn: 'root' })
export class ReservoirsService {
  private reservoirsSource: BehaviorSubject<Reservoir[]> = new BehaviorSubject<
    Reservoir[]
  >([]);
  reservoirs = this.reservoirsSource.asObservable();
  private nutrientsSource: BehaviorSubject<Nutrient[]> = new BehaviorSubject<
    Nutrient[]
  >([]);
  nutrients = this.nutrientsSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  createReservoir(reservoirLabel: string, nutrientIDs: number[]) {
    const body = {
      reservoir_label: reservoirLabel,
      nutrient_ids: nutrientIDs,
    };

    this.httpClient
      .post(RESERVOIRS_API + '/create', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateReservoirsData();
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

  fetchReservoirsData(): Promise<any> {
    return this.httpClient.get<any>(RESERVOIRS_API, httpGetOptions).toPromise();
  }

  editReservoir(index: number, reservoirLabel: string, nutrientIDs: number[]) {
    const body = {
      reservoir_id: this.reservoirsSource.getValue()[index].reservoirID,
      reservoir_label: reservoirLabel,
      nutrient_ids: nutrientIDs,
    };

    this.httpClient
      .post(RESERVOIRS_API + '/edit', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateReservoirsData();
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

  deleteReservoir(index: number) {
    const body = {
      reservoir_id: this.reservoirsSource.getValue()[index].reservoirID,
    };

    this.httpClient
      .post(RESERVOIRS_API + '/delete', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateReservoirsData();
            alert('Successful');
            console.log(this.reservoirsSource.getValue());
          }
        },
        (error) => {
          throwError(error);
          alert(error.error);
        }
      );
  }

  updateReservoirsData() {
    this.fetchReservoirsData().then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let reservoirs: Reservoir[] = [];
        for (let fetchedReservoir of fetchedData.reservoirs) {
          let reservoir = new Reservoir();

          reservoir.reservoirID = fetchedReservoir['reservoir_id'];
          reservoir.reservoirLabel = fetchedReservoir['reservoir_label'];
          reservoir.nutrientIDs = fetchedReservoir['nutrient_ids'];

          if (reservoir.reservoirID !== 0) {
            reservoirs.push(reservoir);
          }
        }

        this.reservoirsSource.next(reservoirs);

        let nutrients: Nutrient[] = [];
        for (let fetchedNutrient of fetchedData.nutrients) {
          let nutrient = new Nutrient();

          nutrient.nutrientID = fetchedNutrient['nutrient_id'];
          nutrient.nutrientLabel = fetchedNutrient['nutrient_label'];
          nutrient.part = fetchedNutrient['part'];
          nutrient.nutrientType = fetchedNutrient['nutrient_type'];
          nutrient.ccPerLiter = fetchedNutrient['cc_per_liter'];
          nutrient.n = fetchedNutrient['n'];
          nutrient.p = fetchedNutrient['p'];
          nutrient.k = fetchedNutrient['k'];

          if (nutrient.nutrientID !== 0) {
            nutrients.push(nutrient);
          }
        }

        this.nutrientsSource.next(nutrients);
      },
      (error) => {
        throwError(error);
        alert(error.error);
      }
    );
  }
}
