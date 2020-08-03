import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpGetOptions, httpPostOptions } from '../_shared/httpPostOptions';
import { Module } from '../_models/module.model';
import { Reservoir } from '../_models/reservoir.model';
import { Room } from '../_models/room.model';

const MODULES_API = `http://localhost:9090/modules`;

@Injectable({ providedIn: 'root' })
export class ModulesService {
  private modulesSource: BehaviorSubject<Module[]> = new BehaviorSubject<
    Module[]
  >([]);
  modules = this.modulesSource.asObservable();

  private roomsSource: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>(
    []
  );
  rooms = this.roomsSource.asObservable();

  private reservoirsSource: BehaviorSubject<Reservoir[]> = new BehaviorSubject<
    Reservoir[]
  >([]);
  reservoirs = this.reservoirsSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  createModule(moduleLabel: string, roomID: number, reservoirID: number) {
    const body = {
      module_label: moduleLabel,
      room_id: roomID,
      reservoir_id: reservoirID,
    };

    this.httpClient
      .post(MODULES_API + '/create', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateModulesData();
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

  fetchModulesData(): Promise<any> {
    return this.httpClient.get<any>(MODULES_API, httpGetOptions).toPromise();
  }

  editModule(
    index: number,
    moduleLabel: string,
    roomID: number,
    reservoirID: number
  ) {
    const body = {
      module_id: this.modulesSource.getValue()[index].moduleID,
      module_label: this.modulesSource.getValue()[index].moduleLabel,
      room_id: roomID,
      reservoir_id: reservoirID,
    };

    this.httpClient
      .post(MODULES_API + '/edit', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateModulesData();
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

  deleteModule(index: number) {
    const body = {
      module_id: this.modulesSource.getValue()[index].moduleID,
    };

    this.httpClient
      .post(MODULES_API + '/delete', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateModulesData();
            alert('Successful');
            console.log(this.modulesSource.getValue());
          }
        },
        (error) => {
          throwError(error);
          alert(error.error);
        }
      );
  }

  updateModulesData() {
    this.fetchModulesData().then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let modules: Module[] = [];
        for (let fetchedModule of fetchedData.modules) {
          let module = new Module();

          module.moduleID = fetchedModule['module_id'];
          module.moduleLabel = fetchedModule['module_label'];
          module.roomID = fetchedModule['room_id'];
          module.reservoirID = fetchedModule['reservoir_id'];

          if (module.moduleID !== 0) {
            modules.push(module);
          }
        }
        this.modulesSource.next(modules);

        let rooms: Room[] = [];
        for (let fetchedReservoir of fetchedData.rooms) {
          let room = new Room();

          room.roomID = fetchedReservoir['room_id'];
          room.roomLabel = fetchedReservoir['room_label'];

          if (room.roomID !== 0) {
            rooms.push(room);
          }
        }
        this.roomsSource.next(rooms);

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
      },
      (error) => {
        throwError(error);
        alert(error.error);
      }
    );
  }
}
