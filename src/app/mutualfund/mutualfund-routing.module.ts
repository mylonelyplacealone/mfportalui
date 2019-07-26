import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { MfdashboardComponent } from './mfdashboard/mfdashboard.component';
import { MfoneviewComponent } from './mfoneview/mfoneview.component';
import { SipdashboardComponent } from './sipdashboard/sipdashboard.component';
import { SearchmfComponent } from './searchmf/searchmf.component';
import { SoldmflistComponent } from './soldmflist/soldmflist.component';
import { MfhomeComponent } from './mfhome/mfhome.component';
import { MflouncherComponent } from './mflouncher/mflouncher.component';
import { MfsnapshotComponent } from './mfsnapshot/mfsnapshot.component';
import { SharedashboardComponent } from './shares/sharedashboard/sharedashboard.component';

const MFRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '', component: MflouncherComponent, children:[
      { path: 'home', component: MfhomeComponent, canActivate: [AuthGuard]},
      { path: 'mfdashboard', component: MfdashboardComponent, canActivate: [AuthGuard]},
      { path: 'mfsipdashboard', component: SipdashboardComponent, canActivate: [AuthGuard]},
      { path: 'searchmf', component: SearchmfComponent, canActivate: [AuthGuard]},
      { path: 'mfoneview', component: MfoneviewComponent, canActivate: [AuthGuard]},
      { path: 'mfsnapshot', component: MfsnapshotComponent, canActivate: [AuthGuard]},
      { path: 'solfmflist', component: SoldmflistComponent, canActivate: [AuthGuard]},
      { path: 'shares', component: SharedashboardComponent, canActivate: [AuthGuard]},
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(MFRoutes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class MFRoutingModule { }