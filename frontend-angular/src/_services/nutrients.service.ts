import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpGetOptions, httpPostOptions } from '../_shared/httpPostOptions';
import { Nutrient } from '../_models/nutrient.model';

const NUTRIENTS_API = `http://localhost:9090/nutrients`;

@Injectable({ providedIn: 'root' })
export class NutrientsService {
  private nutrientsSource: BehaviorSubject<Nutrient[]> = new BehaviorSubject<
    Nutrient[]
  >([]);
  nutrients = this.nutrientsSource.asObservable();
  parts: string[] = ['A', 'B', 'C'];
  nutrientTypes: string[] = ['Powder', 'Solution'];

  constructor(private httpClient: HttpClient) {}

  createNutrient(
    nutrientLabel: string,
    part: number,
    nutrientType: number,
    ccPerLiter: number,
    n: number,
    p: number,
    k: number
  ) {
    const body = {
      nutrient_label: nutrientLabel,
      part: part,
      nutrient_type: nutrientType,
      cc_per_liter: ccPerLiter,
      n: n,
      p: p,
      k: k,
    };

    this.httpClient
      .post(NUTRIENTS_API + '/create', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateNutrientsData();
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

  fetchNutrientsData(): Promise<any> {
    return this.httpClient.get<any>(NUTRIENTS_API, httpGetOptions).toPromise();
  }

  editNutrient(
    index: number,
    nutrientLabel: string,
    part: number,
    nutrientType: number,
    ccPerLiter: number,
    n: number,
    p: number,
    k: number
  ) {
    const body = {
      nutrient_id: this.nutrientsSource.getValue()[index].nutrientID,
      nutrient_label: nutrientLabel,
      part: part,
      nutrient_type: nutrientType,
      cc_per_liter: ccPerLiter,
      n: n,
      p: p,
      k: k,
    };

    this.httpClient
      .post(NUTRIENTS_API + '/edit', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateNutrientsData();
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

  deleteNutrient(index: number) {
    const body = {
      nutrient_id: this.nutrientsSource.getValue()[index].nutrientID,
    };

    this.httpClient
      .post(NUTRIENTS_API + '/delete', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateNutrientsData();
            alert('Successful');
            console.log(this.nutrientsSource.getValue());
          }
        },
        (error) => {
          throwError(error);
          alert(error.error);
        }
      );
  }

  updateNutrientsData() {
    this.fetchNutrientsData().then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let nutrients: Nutrient[] = [];
        for (let data of fetchedData) {
          let nutrient = new Nutrient();

          nutrient.nutrientID = data['nutrient_id'];
          nutrient.nutrientLabel = data['nutrient_label'];
          nutrient.part = data['part'];
          nutrient.nutrientType = data['nutrient_type'];
          nutrient.ccPerLiter = data['cc_per_liter'];
          nutrient.n = data['n'];
          nutrient.p = data['p'];
          nutrient.k = data['k'];

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

  getNutrientParts(): string[] {
    return this.parts;
  }

  getNutrientTypes(): string[] {
    return this.nutrientTypes;
  }
}
