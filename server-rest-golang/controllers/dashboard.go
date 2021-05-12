package controllers

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
)

const germinatorUrl = "http://172.20.10.4:8090"

func PopulateGrowerDashboardCurrent(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	lsModuleLevelLog, lsReservoirLog, lsRoomLog, lsModule, lsReservoir, lsRoom, err := services.GetPopulateGrowerDashboardData()
	if err != nil {
		msg := "Error: Failed to Get Populate Grower Dashboard Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LsLogSensorModuleLevel []models.LogSensorModuleLevel `json:"ls_log_sensor_module_level"`
		LsLogSensorReservoir   []models.LogSensorReservoir   `json:"ls_log_sensor_reservoir"`
		LsLogRoom              []models.LogSensorRoom        `json:"ls_log_sensor_room"`
		LsModule               []models.Module               `json:"ls_module"`
		LsReservoir            []models.Reservoir            `json:"ls_reservoir"`
		LsRoom                 []models.Room                 `json:"ls_room"`
	}
	output := Output{
		LsLogSensorModuleLevel: lsModuleLevelLog,
		LsLogSensorReservoir:   lsReservoirLog,
		LsLogRoom:              lsRoomLog,
		LsModule:               lsModule,
		LsReservoir:            lsReservoir,
		LsRoom:                 lsRoom,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func GetLatestGrowerSensorLogs(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	lsModuleLevelLog, lsReservoirLog, lsRoomLog, err := services.GetLatestGrowerSensorLogs()
	if err != nil {
		msg := "Error: Failed to Get Latest Grower Sensor Logs"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LsLogSensorModuleLevel []models.LogSensorModuleLevel `json:"ls_log_sensor_module_level"`
		LsLogSensorReservoir   []models.LogSensorReservoir   `json:"ls_log_sensor_reservoir"`
		LsLogRoom              []models.LogSensorRoom        `json:"ls_log_sensor_room"`
	}
	output := Output{
		LsLogSensorModuleLevel: lsModuleLevelLog,
		LsLogSensorReservoir:   lsReservoirLog,
		LsLogRoom:              lsRoomLog,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func UpdateModuleSettings(w http.ResponseWriter, r *http.Request) {
	input := models.ModuleSettings{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	moduleUrl, err := services.GetModuleUrlByID(input.ModuleID)
	if err != nil {
		msg := "Error: Failed to Get Module Urls"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	requestBody, err := json.Marshal(input)
	if err != nil {
		msg := "Error: Failed to Marshal IoT Body"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	resp, err := http.Post(moduleUrl, "application/json", bytes.NewReader(requestBody))
	if err != nil {
		msg := "Error: Failed to Send HTTP Post request to IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	inputIoT := models.ModuleSettings{}
	err = jsonhandler.DecodeJsonFromResponse(resp, inputIoT)
	if err != nil {
		msg := "Error: Failed to Decode Json from Response"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		ModuleSettings models.ModuleSettings `json:"module_settings"`
	}
	output := Output{
		ModuleSettings: inputIoT,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func GetAllModuleSettings(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	var lsModuleSettings []models.ModuleSettings

	mapModuleIDModuleUrl, err := services.GetAllModuleUrls()
	if err != nil {
		msg := "Error: Failed to Get Module Urls"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Flag struct {
		ModuleID int `json:"module_id"`
	}
	flg := Flag{ModuleID: 0}

	requestBody, err := json.Marshal(flg)
	if err != nil {
		msg := "Error: Failed to Marshal Flag"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	for _, moduleUrl := range mapModuleIDModuleUrl {
		resp, err := http.Post(moduleUrl, "application/json", bytes.NewReader(requestBody))
		if err != nil {
			msg := "Error: Failed to Send HTTP Post request to IoT device"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		inputIoT := models.ModuleSettings{}
		err = jsonhandler.DecodeJsonFromResponse(resp, inputIoT)
		if err != nil {
			msg := "Error: Failed to Decode Json from Response"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		lsModuleSettings = append(lsModuleSettings, inputIoT)
	}

	type Output struct {
		LsModuleSettings []models.ModuleSettings `json:"ls_module_settings"`
	}
	output := Output{
		LsModuleSettings: lsModuleSettings,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func UpdateReservoirSettings(w http.ResponseWriter, r *http.Request) {
	input := models.ReservoirSettings{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	reservoirUrl, err := services.GetReservoirUrlByID(input.ReservoirID)
	if err != nil {
		msg := "Error: Failed to Get Reservoir Urls"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	requestBody, err := json.Marshal(input)
	if err != nil {
		msg := "Error: Failed to Marshal IoT Body"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	resp, err := http.Post(reservoirUrl, "application/json", bytes.NewReader(requestBody))
	if err != nil {
		msg := "Error: Failed to Send HTTP Post request to IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	inputIoT := models.ReservoirSettings{}
	err = jsonhandler.DecodeJsonFromResponse(resp, inputIoT)
	if err != nil {
		msg := "Error: Failed to Decode Json from Response"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		ReservoirSettings models.ReservoirSettings `json:"reservoir_settings"`
	}
	output := Output{
		ReservoirSettings: inputIoT,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func GetAllReservoirSettings(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	var lsReservoirSettings []models.ReservoirSettings

	mapReservoirIDReservoirUrl, err := services.GetAllReservoirUrls()
	if err != nil {
		msg := "Error: Failed to Get Module Urls"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Flag struct {
		ReservoirID int `json:"reservoir_id"`
	}
	flg := Flag{ReservoirID: 1}

	requestBody, err := json.Marshal(flg)
	if err != nil {
		msg := "Error: Failed to Marshal Flag"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	for _, reservoirUrl := range mapReservoirIDReservoirUrl {
		resp, err := http.Post(reservoirUrl, "application/json", bytes.NewReader(requestBody))
		if err != nil {
			msg := "Error: Failed to Send HTTP Post request to IoT device"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		inputIoT := models.ReservoirSettings{}
		err = jsonhandler.DecodeJsonFromResponse(resp, inputIoT)
		if err != nil {
			msg := "Error: Failed to Decode Json from Response"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		lsReservoirSettings = append(lsReservoirSettings, inputIoT)
	}

	type Output struct {
		LsReservoirSettings []models.ReservoirSettings `json:"ls_reservoir_settings"`
	}
	output := Output{
		LsReservoirSettings: lsReservoirSettings,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func PopulateGrowerDashboardHistory(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		TimeStampBegin time.Time `json:"time_stamp_begin"`
		TimeStampEnd   time.Time `json:"time_stamp_end"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	lsLogSensorModuleLevel, lsLogSensorReservoir, lsLogSensorRoom, err := services.GetGrowerHistorySensorLogData(input.TimeStampBegin,
		input.TimeStampEnd)
	if err != nil {
		msg := "Error: Failed to Get Populate Grower Dashboard History Sensor Log Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LsLogSensorModuleLevel []models.LogSensorModuleLevel `json:"ls_log_sensor_module_level"`
		LsLogSensorReservoir   []models.LogSensorReservoir   `json:"ls_log_sensor_reservoir"`
		LsLogSensorRoom        []models.LogSensorRoom        `json:"ls_log_sensor_room"`
	}
	output := Output{
		LsLogSensorModuleLevel: lsLogSensorModuleLevel,
		LsLogSensorReservoir:   lsLogSensorReservoir,
		LsLogSensorRoom:        lsLogSensorRoom,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func PopulateGerminatorDashboardCurrent(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	logSensorGerminator, err := services.GetLatestGerminatorSensorLog()
	if err != nil {
		msg := "Error: Failed to Get Populate Germinator Dashboard Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LogSensorGerminator *models.LogSensorGerminator `json:"log_sensor_germinator"`
	}
	output := Output{
		LogSensorGerminator: logSensorGerminator,
	}

	log.Println(output.LogSensorGerminator)

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func PopulateGerminatorDashboardHistory(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		TimeStampBegin time.Time `json:"time_stamp_begin"`
		TimeStampEnd   time.Time `json:"time_stamp_end"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	lsLogSensorGerminator, err := services.GetGerminatorHistorySensorLogData(input.TimeStampBegin,
		input.TimeStampEnd)
	if err != nil {
		msg := "Error: Failed to Get Populate Germinator Dashboard History Sensor Log Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LsLogSensorGerminator []models.LogSensorGerminator `json:"ls_log_sensor_germinator"`
	}
	output := Output{
		LsLogSensorGerminator: lsLogSensorGerminator,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func UpdateGerminatorSettings(w http.ResponseWriter, r *http.Request) {
	input := models.ReservoirSettings{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	requestBody, err := json.Marshal(input)
	if err != nil {
		msg := "Error: Failed to Marshal IoT Body"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	resp, err := http.Post(germinatorUrl, "application/json", bytes.NewReader(requestBody))
	if err != nil {
		msg := "Error: Failed to Send HTTP Post request to IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	inputIoT := models.GerminatorSettings{}
	err = jsonhandler.DecodeJsonFromResponse(resp, inputIoT)
	if err != nil {
		msg := "Error: Failed to Decode Json from Response"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		GerminatorSettings models.GerminatorSettings `json:"germinator_settings"`
	}
	output := Output{
		GerminatorSettings: inputIoT,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func GetGerminatorSettings(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	resp, err := http.Get(germinatorUrl)
	if err != nil {
		msg := "Error: Failed to Send HTTP Post request to IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	log.Println(resp)

	inputIoT := models.GerminatorSettings{}
	err = jsonhandler.DecodeJsonFromResponse(resp, &inputIoT)
	if err != nil {
		msg := "Error: Failed to Decode Json from Response"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	log.Println(inputIoT)

	type Output struct {
		GerminatorSettings models.GerminatorSettings `json:"germinator_settings"`
	}
	output := Output{
		GerminatorSettings: inputIoT,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
