import { Component, OnInit } from '@angular/core';
import { RoomsService } from "../../../_services/rooms.service";
import { Room } from "../../../_models/room.model";

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.css']
})
export class RoomsListComponent implements OnInit {
  rooms: Room[];

  constructor(private roomsService: RoomsService) {
  }

  ngOnInit(): void {
    this.roomsService.updateRoomsData();
    this.roomsService.rooms.subscribe((rooms: Room[]) => {
        this.rooms = rooms;
      }
    );
  }

}
