package models

type Module struct {
	ModuleID    int    `json:"module_id"`
	ReservoirID int    `json:"reservoir_id"`
	RoomID      int    `json:"room_id"`
	ModuleLabel string `json:"module_label"`
}
