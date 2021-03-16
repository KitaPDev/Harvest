import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { Nutrient } from '../_models/nutrient.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpGetOptions, httpPostOptions } from '../_shared/httpPostOptions';
import { Reservoir } from '../_models/reservoir.model';
import { Batch } from '../_models/batch.model';
import { Module } from '../_models/module.model';
import { Plant } from '../_models/plant.model';
import { BatchDetail } from '../_models/batchdetail.model';
import { LogSensorModuleLevel } from '../_models/logsensormodulelevel.model';
import { LogSensorReservoir } from '../_models/logsensorreservoir.model';
import { LogSensorRoom } from '../_models/logsensorroom.model';
import { Room } from '../_models/room.model';

const BATCHES_API = `http://localhost:9090/batches`;

@Injectable({ providedIn: 'root' })
export class BatchesService {
  private batchesSource: BehaviorSubject<Batch[]> = new BehaviorSubject<
    Batch[]
  >([]);
  batches = this.batchesSource.asObservable();

  private modulesSource: BehaviorSubject<Module[]> = new BehaviorSubject<
    Module[]
  >([]);
  modules = this.modulesSource.asObservable();

  private plantsSource: BehaviorSubject<Plant[]> = new BehaviorSubject<Plant[]>(
    []
  );
  plants = this.plantsSource.asObservable();

  private reservoirsSource: BehaviorSubject<Reservoir[]> = new BehaviorSubject<
    Reservoir[]
  >([]);
  reservoirs = this.reservoirsSource.asObservable();

  private nutrientsSource: BehaviorSubject<Nutrient[]> = new BehaviorSubject<
    Nutrient[]
  >([]);
  nutrients = this.nutrientsSource.asObservable();

  private roomsSource: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>(
    []
  );
  rooms = this.roomsSource.asObservable();

  private recBatchID_BatchDetailSource: BehaviorSubject<
    Record<number, BatchDetail>
  > = new BehaviorSubject<Record<number, BatchDetail>>({});
  recBatchID_BatchDetail = this.recBatchID_BatchDetailSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  createBatch(batch: Batch) {
    const body = {
      batch_label: batch.batchLabel,
      plant_id: batch.plantID,
      reservoir_ids: batch.reservoirIDs,
      nutrient_ids: batch.nutrientIDs,
      module_ids: batch.moduleIDs,
      room_ids: batch.roomIDs,
      time_stamp_begin: new Date(batch.timeStampBegin).toJSON(),
      time_stamp_end: new Date(batch.timeStampEnd).toJSON(),
      weight: batch.weight,
      lights_on_hour: batch.lightsOnHour,
      lights_off_hour: batch.lightsOffHour,
      misting_on_second: batch.mistingOnSecond,
      misting_off_second: batch.mistingOffSecond,
      remarks: batch.remarks,
    };

    this.httpClient
      .post(BATCHES_API + '/create', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateBatchesData();
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

  fetchBatchesData(): Promise<any> {
    return this.httpClient.get<any>(BATCHES_API, httpGetOptions).toPromise();
  }

  editBatch(batch: Batch) {
    const body = {
      batch_id: batch.batchID,
      batch_label: batch.batchLabel,
      plant_id: batch.plantID,
      reservoir_ids: batch.reservoirIDs,
      nutrient_ids: batch.nutrientIDs,
      module_ids: batch.moduleIDs,
      room_ids: batch.roomIDs,
      time_stamp_begin: new Date(batch.timeStampBegin).toJSON(),
      time_stamp_end: new Date(batch.timeStampEnd).toJSON(),
      weight: batch.weight,
      lights_on_hour: batch.lightsOnHour,
      lights_off_hour: batch.lightsOffHour,
      misting_on_second: batch.mistingOnSecond,
      misting_off_second: batch.mistingOffSecond,
      remarks: batch.remarks,
    };

    this.httpClient
      .post(BATCHES_API + '/edit', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateBatchesData();
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

  deleteBatch(batchID: number) {
    const body = {
      batch_id: batchID,
    };

    this.httpClient
      .post(BATCHES_API + '/delete', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateBatchesData();
            alert('Successful');
            console.log(this.batchesSource.getValue());
          }
        },
        (error) => {
          throwError(error);
          alert(error.error);
        }
      );
  }

  updateBatchesData() {
    this.fetchBatchesData().then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let batches: Batch[] = [];
        for (let fetchedBatch of fetchedData.batches) {
          let batch = new Batch();

          batch.batchID = fetchedBatch['batch_id'];
          batch.batchLabel = fetchedBatch['batch_label'];
          batch.moduleIDs = fetchedBatch['module_ids'];
          batch.reservoirIDs = fetchedBatch['reservoir_ids'];
          batch.roomIDs = fetchedBatch['room_ids'];
          batch.plantID = fetchedBatch['plant_id'];
          batch.nutrientIDs = fetchedBatch['nutrient_ids'];
          batch.timeStampBegin = new Date(fetchedBatch['time_stamp_begin']);
          batch.timeStampEnd = new Date(fetchedBatch['time_stamp_end']);
          batch.weight = fetchedBatch['weight'];
          batch.lightsOnHour = fetchedBatch['lights_on_hour'];
          batch.lightsOffHour = fetchedBatch['lights_off_hour'];
          batch.mistingOnSecond = fetchedBatch['misting_on_second'];
          batch.mistingOffSecond = fetchedBatch['misting_off_second'];
          batch.remarks = fetchedBatch['remarks'];

          if (batch.batchID !== 0) {
            batches.push(batch);
          }
        }

        this.batchesSource.next(batches);

        let modules: Module[] = [];
        for (let fetchedModule of fetchedData.modules) {
          let module = new Module();

          module.moduleID = fetchedModule['module_id'];
          module.moduleLabel = fetchedModule['module_label'];
          module.level = fetchedModule['level'];
          module.roomID = fetchedModule['room_id'];
          module.reservoirID = fetchedModule['reservoir_id'];

          if (module.moduleID !== 0) {
            modules.push(module);
          }
        }
        this.modulesSource.next(modules);

        let plants: Plant[] = [];
        for (let fetchedPlant of fetchedData.plants) {
          let plant = new Plant();

          plant.plantID = fetchedPlant['plant_id'];
          plant.plantLabel = fetchedPlant['plant_label'];
          plant.tdsHigh = fetchedPlant['tds_high'];
          plant.phHigh = fetchedPlant['ph_high'];
          plant.tdsLow = fetchedPlant['tds_low'];
          plant.temperatureHigh = fetchedPlant['temperature_high'];
          plant.temperatureLow = fetchedPlant['temperature_low'];
          plant.lightsOffHour = fetchedPlant['lights_off_hour'];
          plant.lightsOnHour = fetchedPlant['lights_on_hour'];
          plant.mistingOffSecond = fetchedPlant['misting_off_second'];
          plant.mistingOnSecond = fetchedPlant['misting_on_second'];

          if (plant.plantID !== 0) {
            plants.push(plant);
          }
        }

        this.plantsSource.next(plants);

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

        let rooms: Room[] = [];
        for (let fetchedRoom of fetchedData.rooms) {
          let room = new Room();

          room.roomID = fetchedRoom['room_id'];
          room.roomLabel = fetchedRoom['room_label'];

          if (room.roomID !== 0) {
            rooms.push(room);
          }
        }

        this.roomsSource.next(rooms);
      },
      (error) => {
        throwError(error);
        alert(error.error);
      }
    );
  }

  fetchBatchDetails(batchID) {
    let body = {
      batch_id: batchID,
    };

    this.httpClient
      .post<any>(BATCHES_API + '/details', body, httpGetOptions)
      .subscribe((response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));
        console.log(fetchedData);

        let logSensorModuleLevels: LogSensorModuleLevel[] = [];
        let logSensorReservoirs: LogSensorReservoir[] = [];
        let logSensorRooms: LogSensorRoom[] = [];

        for (let fetchedLogSensorModuleLevel of fetchedData.log_sensor_module_levels) {
          let logSensorModuleLevel = new LogSensorModuleLevel();

          logSensorModuleLevel.loggedAt =
            fetchedLogSensorModuleLevel['logged_at'];
          logSensorModuleLevel.moduleID =
            fetchedLogSensorModuleLevel['module_id'];
          logSensorModuleLevel.level = fetchedLogSensorModuleLevel['level'];
          logSensorModuleLevel.temperatureRoot =
            fetchedLogSensorModuleLevel['temperature_root'];
          logSensorModuleLevel.humidityRoot =
            fetchedLogSensorModuleLevel['humidity_root'];

          logSensorModuleLevels.push(logSensorModuleLevel);
        }

        for (let fetchedLogSensorReservoir of fetchedData.log_sensor_reservoirs) {
          let logSensorReservoir = new LogSensorReservoir();

          logSensorReservoir.loggedAt = fetchedLogSensorReservoir['logged_at'];
          logSensorReservoir.reservoirID =
            fetchedLogSensorReservoir['reservoir_id'];
          logSensorReservoir.tds = fetchedLogSensorReservoir['tds'];
          logSensorReservoir.ph = fetchedLogSensorReservoir['ph'];
          logSensorReservoir.temperatureSolution =
            fetchedLogSensorReservoir['temperature_solution'];
          logSensorReservoir.solnLevel =
            fetchedLogSensorReservoir['soln_level'];

          logSensorReservoirs.push(logSensorReservoir);
        }

        for (let fetchedLogSensorRoom of fetchedData.log_sensor_rooms) {
          let logSensorRoom = new LogSensorRoom();

          logSensorRoom.loggedAt = fetchedLogSensorRoom['logged_at'];
          logSensorRoom.roomID = fetchedLogSensorRoom['room_id'];
          logSensorRoom.temperature = fetchedLogSensorRoom['temperature'];
          logSensorRoom.humidity = fetchedLogSensorRoom['humidity'];

          logSensorRooms.push(logSensorRoom);
        }

        let recBatchID_BatchDetail = this.recBatchID_BatchDetailSource.getValue();
        recBatchID_BatchDetail[batchID] = {
          logSensorModuleLevels,
          logSensorReservoirs,
          logSensorRooms,
        };

        this.recBatchID_BatchDetailSource.next(recBatchID_BatchDetail);
      });
  }

  getPlants(): Plant[] {
    return this.plantsSource.getValue();
  }

  getReservoirs(): Reservoir[] {
    return this.reservoirsSource.getValue();
  }

  getNutrients(): Nutrient[] {
    return this.nutrientsSource.getValue();
  }

  getModules(): Module[] {
    return this.modulesSource.getValue();
  }

  getRooms(): Room[] {
    return this.roomsSource.getValue();
  }

  getBatch(batchID: number): Batch {
    return this.batchesSource.getValue().filter((batch) => {
      if (batch.batchID === batchID) {
        return batch;
      }
    })[0];
  }
}
