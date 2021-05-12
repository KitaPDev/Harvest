import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { RoleGuardService } from '../_services/role-guard.service';
import { RoomsComponent } from './rooms/rooms.component';
import { NutrientsComponent } from './nutrients/nutrients.component';
import { ReservoirsComponent } from './reservoirs/reservoirs.component';
import { ModulesComponent } from './modules/modules.component';
import { PlantsComponent } from './plants/plants.component';
import { BatchesComponent } from './batches/batches.component';
import { BatchesDetailsComponent } from './batches/batches-details/batches-details.component';
import { DashboardGrowerComponent } from './dashboard/dashboard-grower/dashboard-grower.component';
import { DashboardGerminatorComponent } from './dashboard/dashboard-germinator/dashboard-germinator.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [RoleGuardService] },
  { path: 'rooms', component: RoomsComponent, canActivate: [RoleGuardService] },
  {
    path: 'nutrients',
    component: NutrientsComponent,
    canActivate: [RoleGuardService],
  },
  {
    path: 'reservoirs',
    component: ReservoirsComponent,
    canActivate: [RoleGuardService],
  },
  {
    path: 'modules',
    component: ModulesComponent,
    canActivate: [RoleGuardService],
  },
  {
    path: 'plants',
    component: PlantsComponent,
    canActivate: [RoleGuardService],
  },
  {
    path: 'batches',
    children: [
      { path: '', component: BatchesComponent },
      { path: ':id', component: BatchesDetailsComponent },
    ],
  },
  {
    path: 'dashboard/grower',
    component: DashboardGrowerComponent,
  },
  {
    path: 'dashboard/germinator',
    component: DashboardGerminatorComponent,
  },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
