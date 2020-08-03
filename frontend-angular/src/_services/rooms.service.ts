import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { httpPostOptions } from '../_shared/httpPostOptions';
import { Room } from '../_models/room.model';

const ROOMS_API = `http://localhost:9090/rooms`;

@Injectable({ providedIn: 'root' })
export class RoomsService {
  private roomsSource: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>(
    []
  );
  rooms = this.roomsSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  createRoom(roomLabel: string) {
    const body = {
      room_label: roomLabel,
    };

    this.httpClient
      .post(ROOMS_API + '/create', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateRoomsData();
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

  fetchRoomsData(): Promise<any> {
    return this.httpClient.get<any>(ROOMS_API, httpPostOptions).toPromise();
  }

  editRoom(index: number, roomLabel: string) {
    const body = {
      room_id: this.roomsSource.getValue()[index].roomID,
      room_label: roomLabel,
    };

    this.httpClient.post(ROOMS_API + '/edit', body, httpPostOptions).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.updateRoomsData();
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

  deleteRoom(index: number) {
    const body = {
      room_id: this.roomsSource.getValue()[index].roomID,
    };

    this.httpClient
      .post(ROOMS_API + '/delete', body, httpPostOptions)
      .subscribe(
        (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.updateRoomsData();
            alert('Successful');
            console.log(this.roomsSource.getValue());
          }
        },
        (error) => {
          throwError(error);
          alert(error.error);
        }
      );
  }

  updateRoomsData() {
    this.fetchRoomsData().then(
      (response: HttpResponse<any>) => {
        let fetchedData = JSON.parse(JSON.stringify(response.body));

        let rooms: Room[] = [];
        for (let data of fetchedData.rooms) {
          let room = new Room();

          room.roomID = data['room_id'];
          room.roomLabel = data['room_label'];

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
}
