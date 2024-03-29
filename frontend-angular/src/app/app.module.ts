import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { httpInterceptorProviders } from '../_http-interceptors';
import { HomeComponent } from './home/home.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { UsersComponent } from './users/users.component';
import { ConfirmationDialogComponent } from './_dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../_services/dialogs/confirmation-dialog.service';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersItemComponent } from './users/users-list/users-item/users-item.component';
import { ChangePasswordDialogComponent } from './_dialogs/change-password-dialog/change-password-dialog.component';
import { ChangePasswordDialogService } from '../_services/dialogs/change-password-dialog.service';
import { RoomsComponent } from './rooms/rooms.component';
import { RoomsListComponent } from './rooms/rooms-list/rooms-list.component';
import { RoomsItemComponent } from './rooms/rooms-list/rooms-item/rooms-item.component';
import { EditRoomDialogComponent } from './_dialogs/edit-room-dialog/edit-room-dialog.component';
import { EditRoomDialogService } from '../_services/dialogs/edit-room-dialog.service';
import { ReservoirsComponent } from './reservoirs/reservoirs.component';
import { ReservoirsListComponent } from './reservoirs/reservoirs-list/reservoirs-list.component';
import { ReservoirsItemComponent } from './reservoirs/reservoirs-list/reservoirs-item/reservoirs-item.component';
import { NutrientsComponent } from './nutrients/nutrients.component';
import { NutrientsListComponent } from './nutrients/nutrients-list/nutrients-list.component';
import { NutrientsItemComponent } from './nutrients/nutrients-list/nutrients-item/nutrients-item.component';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { EditNutrientDialogComponent } from './_dialogs/edit-nutrient-dialog/edit-nutrient-dialog.component';
import { EditNutrientDialogService } from '../_services/dialogs/edit-nutrient-dialog.service';
import { CookieService } from 'ngx-cookie-service';
import { EditReservoirDialogComponent } from './_dialogs/edit-reservoir-dialog/edit-reservoir-dialog.component';
import { EditReservoirDialogService } from '../_services/dialogs/edit-reservoir-dialog.service';
import { ModulesComponent } from './modules/modules.component';
import { ModulesListComponent } from './modules/modules-list/modules-list.component';
import { ModulesItemComponent } from './modules/modules-list/modules-item/modules-item.component';
import { EditModuleDialogComponent } from './_dialogs/edit-module-dialog/edit-module-dialog.component';
import { EditModuleDialogService } from '../_services/dialogs/edit-module-dialog.service';
import { PlantsComponent } from './plants/plants.component';
import { PlantsListComponent } from './plants/plants-list/plants-list.component';
import { PlantsItemComponent } from './plants/plants-list/plants-item/plants-item.component';
import { EditPlantDialogComponent } from './_dialogs/edit-plant-dialog/edit-plant-dialog.component';
import { EditPlantDialogService } from '../_services/dialogs/edit-plant-dialog.service';
import { BatchesComponent } from './batches/batches.component';
import { BatchesListComponent } from './batches/batches-list/batches-list.component';
import { BatchesItemComponent } from './batches/batches-list/batches-item/batches-item.component';
import { EditBatchDialogComponent } from './_dialogs/edit-batch-dialog/edit-batch-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditBatchDialogService } from '../_services/dialogs/edit-batch-dialog.service';
import { BatchesDetailsComponent } from './batches/batches-details/batches-details.component';
import { BatchesDetailsReservoirListComponent } from './batches/batches-details/batches-details-reservoir-list/batches-details-reservoir-list.component';
import { BatchesDetailsRoomListComponent } from './batches/batches-details/batches-details-room-list/batches-details-room-list.component';
import { BatchesDetailsModuleListComponent } from './batches/batches-details/batches-details-module-list/batches-details-module-list.component';
import { BatchesDetailsReservoirItemComponent } from './batches/batches-details/batches-details-reservoir-list/batches-details-reservoir-item/batches-details-reservoir-item.component';
import { BatchesDetailsRoomItemComponent } from './batches/batches-details/batches-details-room-list/batches-details-room-item/batches-details-room-item.component';
import { BatchesDetailsModuleItemComponent } from './batches/batches-details/batches-details-module-list/batches-details-module-item/batches-details-module-item.component';
import { ChartsModule } from 'ng2-charts';
import { BatchesDetailsModuleLevelListComponent } from './batches/batches-details/batches-details-module-list/batches-details-module-item/batches-details-module-level-list/batches-details-module-level-list.component';
import { BatchesDetailsModuleLevelItemComponent } from './batches/batches-details/batches-details-module-list/batches-details-module-item/batches-details-module-level-list/batches-details-module-level-item/batches-details-module-level-item.component';
import { DashboardGrowerComponent } from './dashboard/dashboard-grower/dashboard-grower.component';
import { DashboardGerminatorComponent } from './dashboard/dashboard-germinator/dashboard-germinator.component';
import { GerminatorControlPanelComponent } from './dashboard/dashboard-germinator/germinator-control-panel/germinator-control-panel.component';
import { GerminatorHistoryPanelComponent } from './dashboard/dashboard-germinator/germinator-history-panel/germinator-history-panel.component';
import { GrowerControlPanelComponent } from './dashboard/dashboard-grower/grower-control-panel/grower-control-panel.component';
import { GrowerHistoryPanelComponent } from './dashboard/dashboard-grower/grower-history-panel/grower-history-panel.component';
import { RoomChartListComponent } from './dashboard/dashboard-grower/grower-history-panel/room-chart-list/room-chart-list.component';
import { RoomChartItemComponent } from './dashboard/dashboard-grower/grower-history-panel/room-chart-list/room-chart-item/room-chart-item.component';
import { ReservoirChartListComponent } from './dashboard/dashboard-grower/grower-history-panel/reservoir-chart-list/reservoir-chart-list.component';
import { ReservoirChartItemComponent } from './dashboard/dashboard-grower/grower-history-panel/reservoir-chart-list/reservoir-chart-item/reservoir-chart-item.component';
import { ModuleLevelChartListComponent } from './dashboard/dashboard-grower/grower-history-panel/module-chart-list/module-level-chart-list/module-level-chart-list.component';
import { ModuleLevelChartItemComponent } from './dashboard/dashboard-grower/grower-history-panel/module-chart-list/module-level-chart-list/module-level-chart-item/module-level-chart-item.component';
import { ModuleChartListComponent } from './dashboard/dashboard-grower/grower-history-panel/module-chart-list/module-chart-list.component';
import { GerminatorHistoryChartsComponent } from './dashboard/dashboard-germinator/germinator-history-panel/germinator-history-charts/germinator-history-charts.component';
import { GrowerRoomControlPanelListComponent } from './dashboard/dashboard-grower/grower-control-panel/grower-room-control-panel-list/grower-room-control-panel-list.component';
import { GrowerReservoirControlPanelListComponent } from './dashboard/dashboard-grower/grower-control-panel/grower-reservoir-control-panel-list/grower-reservoir-control-panel-list.component';
import { GrowerModuleLevelControlPanelListComponent } from './dashboard/dashboard-grower/grower-control-panel/grower-module-control-panel-list/grower-module-control-panel-item/grower-module-level-control-panel-list/grower-module-level-control-panel-list.component';
import { GrowerModuleControlPanelListComponent } from './dashboard/dashboard-grower/grower-control-panel/grower-module-control-panel-list/grower-module-control-panel-list.component';
import { GrowerModuleLevelControlPanelItemComponent } from './dashboard/dashboard-grower/grower-control-panel/grower-module-control-panel-list/grower-module-control-panel-item/grower-module-level-control-panel-list/grower-module-level-control-panel-item/grower-module-level-control-panel-item.component';
import { GrowerModuleControlPanelItemComponent } from './dashboard/dashboard-grower/grower-control-panel/grower-module-control-panel-list/grower-module-control-panel-item/grower-module-control-panel-item.component';
import { GrowerRoomControlPanelItemComponent } from './dashboard/dashboard-grower/grower-control-panel/grower-room-control-panel-list/grower-room-control-panel-item/grower-room-control-panel-item.component';
import { GrowerReservoirControlPanelItemComponent } from './dashboard/dashboard-grower/grower-control-panel/grower-reservoir-control-panel-list/grower-reservoir-control-panel-item/grower-reservoir-control-panel-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    UsersComponent,
    ConfirmationDialogComponent,
    UsersListComponent,
    UsersItemComponent,
    ChangePasswordDialogComponent,
    RoomsComponent,
    RoomsListComponent,
    RoomsItemComponent,
    EditRoomDialogComponent,
    ReservoirsComponent,
    ReservoirsListComponent,
    ReservoirsItemComponent,
    NutrientsComponent,
    NutrientsListComponent,
    NutrientsItemComponent,
    EditNutrientDialogComponent,
    EditReservoirDialogComponent,
    ModulesComponent,
    ModulesListComponent,
    ModulesItemComponent,
    EditModuleDialogComponent,
    PlantsComponent,
    PlantsListComponent,
    PlantsItemComponent,
    EditPlantDialogComponent,
    BatchesComponent,
    BatchesListComponent,
    BatchesItemComponent,
    EditBatchDialogComponent,
    BatchesDetailsComponent,
    BatchesDetailsReservoirListComponent,
    BatchesDetailsRoomListComponent,
    BatchesDetailsModuleListComponent,
    BatchesDetailsReservoirItemComponent,
    BatchesDetailsRoomItemComponent,
    BatchesDetailsModuleItemComponent,
    BatchesDetailsModuleLevelListComponent,
    BatchesDetailsModuleLevelItemComponent,
    DashboardGrowerComponent,
    DashboardGerminatorComponent,
    GerminatorControlPanelComponent,
    GerminatorHistoryPanelComponent,
    GrowerControlPanelComponent,
    GrowerHistoryPanelComponent,
    RoomChartListComponent,
    RoomChartItemComponent,
    ReservoirChartListComponent,
    ReservoirChartItemComponent,
    ModuleLevelChartListComponent,
    ModuleLevelChartItemComponent,
    ModuleChartListComponent,
    GerminatorHistoryChartsComponent,
    GrowerRoomControlPanelListComponent,
    GrowerReservoirControlPanelListComponent,
    GrowerModuleLevelControlPanelListComponent,
    GrowerModuleControlPanelListComponent,
    GrowerModuleLevelControlPanelItemComponent,
    GrowerModuleControlPanelItemComponent,
    GrowerRoomControlPanelItemComponent,
    GrowerReservoirControlPanelItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule,
    NgbModule,
    ChartsModule,
  ],
  providers: [
    httpInterceptorProviders,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    ConfirmationDialogService,
    ChangePasswordDialogService,
    EditRoomDialogService,
    ComponentLoaderFactory,
    PositioningService,
    BsDropdownConfig,
    EditNutrientDialogService,
    CookieService,
    EditReservoirDialogService,
    EditModuleDialogService,
    EditPlantDialogService,
    EditBatchDialogService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent],
})
export class AppModule {}
