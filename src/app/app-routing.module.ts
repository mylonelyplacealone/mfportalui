import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { MfdashboardComponent } from './mutualfund/mfdashboard/mfdashboard.component';
import { SearchmfComponent } from './mutualfund/CRUDpages/searchmf/searchmf.component';
import { SipdashboardComponent } from './mutualfund/crudpages/sipdashboard/sipdashboard.component';
import { MfoneviewComponent } from './mutualfund/mfoneview/mfoneview.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'mfdashboard', component: MfdashboardComponent, canActivate: [AuthGuard]},
  { path: 'mfsipdashboard', component: SipdashboardComponent, canActivate: [AuthGuard]},
  { path: 'searchmf', component: SearchmfComponent, canActivate: [AuthGuard]},
  { path: 'mfoneview', component: MfoneviewComponent, canActivate: [AuthGuard]},
  // { path: '', component: StartpageComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
