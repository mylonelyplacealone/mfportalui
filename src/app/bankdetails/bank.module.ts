import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BankService } from './common/bank-service.service';
import { BankdetailhomeComponent } from './bankdetailhome/bankdetailhome.component';
import { BankdetaillauncherComponent } from './bankdetaillauncher/bankdetaillauncher.component';
import { BanksnapshotComponent } from './banksnapshot/banksnapshot.component';
import { SavingsaccountComponent } from './savingsaccount/savingsaccount.component';
import { FixeddepositComponent } from './fixeddeposit/fixeddeposit.component';
import { RecurrentdepositComponent } from './recurrentdeposit/recurrentdeposit.component';
import { EpfppfComponent } from './epfppf/epfppf.component';
import { BankRoutingModule } from './bank-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatCardModule, MatTabsModule, MatInputModule } from '@angular/material';
import { ChartModule } from 'angular2-chartjs';
import { AccounteditComponent } from './accountedit/accountedit.component';
import { SharedModule } from '../common/shared.module';
import { AdminComponent } from './admin/admin.component';

@NgModule({
    declarations: [
        BankdetailhomeComponent,
        BankdetaillauncherComponent,
        BanksnapshotComponent,
        SavingsaccountComponent,
        FixeddepositComponent,
        RecurrentdepositComponent,
        EpfppfComponent,
        AccounteditComponent,
        AdminComponent,
    ],
    entryComponents: [AccounteditComponent],
    imports: [
      CommonModule,
      BankRoutingModule,
      FormsModule,
      MatDialogModule,
      MatButtonModule,
      MatCardModule,
      MatTabsModule,
      ChartModule,
      MatInputModule,
      ReactiveFormsModule,
      SharedModule
    ],
    providers: [BankService],
    exports: [CommonModule]
  })
  export class BankModule { }