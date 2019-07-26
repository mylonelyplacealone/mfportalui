
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { BankdetaillauncherComponent } from './bankdetaillauncher/bankdetaillauncher.component';
import { BankdetailhomeComponent } from './bankdetailhome/bankdetailhome.component';
import { SavingsaccountComponent } from './savingsaccount/savingsaccount.component';
import { FixeddepositComponent } from './fixeddeposit/fixeddeposit.component';
import { RecurrentdepositComponent } from './recurrentdeposit/recurrentdeposit.component';
import { EpfppfComponent } from './epfppf/epfppf.component';
import { BanksnapshotComponent } from './banksnapshot/banksnapshot.component';
import { AdminComponent } from './admin/admin.component';

const BankRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '', component: BankdetaillauncherComponent, children:[
      { path: 'home', component: BankdetailhomeComponent, canActivate: [AuthGuard]},
      { path: 'savingsaccount', component: SavingsaccountComponent, canActivate: [AuthGuard]},
      { path: 'fixeddeposit', component: FixeddepositComponent, canActivate: [AuthGuard]},
      { path: 'recurrentdeposit', component: RecurrentdepositComponent, canActivate: [AuthGuard]},
      { path: 'epfppf', component: EpfppfComponent, canActivate: [AuthGuard]},
      { path: 'banksnapshot', component: BanksnapshotComponent, canActivate: [AuthGuard]},
      { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(BankRoutes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class BankRoutingModule { }