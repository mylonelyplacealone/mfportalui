import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MfdashboardComponent } from './mfdashboard/mfdashboard.component';
import { MfService } from './common/mf-service.service';
import { DatePipe, CommonModule } from '@angular/common';
import { MfoneviewComponent } from './mfoneview/mfoneview.component';
import { SipdashboardComponent } from './sipdashboard/sipdashboard.component';
import { SearchmfComponent } from './searchmf/searchmf.component';
import {MatCardModule, MatTabsModule, MatAutocompleteModule, MatInputModule } from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {MatDialogModule} from '@angular/material';
import { MfeditComponent } from './mfedit/mfedit.component';
import { MfrefreshpopupComponent } from './mfrefreshpopup/mfrefreshpopup.component';
import { SoldmflistComponent } from './soldmflist/soldmflist.component';
import { MFRoutingModule } from './mutualfund-routing.module';
import { MfhomeComponent } from './mfhome/mfhome.component';
import { MflouncherComponent } from './mflouncher/mflouncher.component';
import { ChartModule } from 'angular2-chartjs';
import { MinDirective } from './common/min.directive';
import { MfsnapshotComponent } from './mfsnapshot/mfsnapshot.component';
import { SIPeditComponent } from './sipedit/sipedit.component';
import { SharedModule } from '../common/shared.module';
import { SharedashboardComponent } from './shares/sharedashboard/sharedashboard.component';
import { ShareseditComponent } from './shares/sharesedit/sharesedit.component';
import { StockRefreshPopupComponent } from './shares/stock-refresh-popup/stock-refresh-popup.component';

@NgModule({
  declarations: [
    MfdashboardComponent,
    SipdashboardComponent,
    SearchmfComponent,
    MfoneviewComponent,
    MfeditComponent,
    MfrefreshpopupComponent,
    SoldmflistComponent,
    MfhomeComponent,
    MflouncherComponent,
    MinDirective,
    MfsnapshotComponent,
    SIPeditComponent,
    SharedashboardComponent,
    ShareseditComponent,
    StockRefreshPopupComponent
  ],
  entryComponents: [
    MfeditComponent, 
    MfrefreshpopupComponent, 
    SIPeditComponent,
    ShareseditComponent,
    StockRefreshPopupComponent
  ],
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MFRoutingModule,
    MatTabsModule,
    ChartModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [MfService],
  exports: [CommonModule]
})
export class MutualFundModule { }
