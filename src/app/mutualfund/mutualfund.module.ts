import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MfdashboardComponent } from './mfdashboard/mfdashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { MfService } from './common/mf-service.service';
import { DatePipe, CommonModule } from '@angular/common';
import { MfoneviewComponent } from './mfoneview/mfoneview.component';
import { FilterPipe } from './common/filter.pipe';
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

@NgModule({
  declarations: [
    MfdashboardComponent,
    SipdashboardComponent,
    SearchmfComponent,
    MfoneviewComponent,
    MfeditComponent,
    FilterPipe,
    MfrefreshpopupComponent,
    SoldmflistComponent,
    MfhomeComponent,
    MflouncherComponent
  ],
  entryComponents: [MfeditComponent, MfrefreshpopupComponent],
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


  ],
  providers: [MfService, DatePipe],
  exports: [CommonModule]
})
export class MutualFundModule { }
