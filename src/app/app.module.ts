import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth-guard.service';
import { HeaderComponent } from './common/header/header.component';
import { HomeComponent } from './home/home.component';
import { MfdashboardComponent } from './mutualfund/mfdashboard/mfdashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { MfService } from './mutualfund/mf-service.service';
import { DatePipe } from '@angular/common';
import { MfoneviewComponent } from './mutualfund/mfoneview/mfoneview.component';
import { FilterPipe } from './mutualfund/common/filter.pipe';
import { SipdashboardComponent } from './mutualfund/sipdashboard/sipdashboard.component';
import { SearchmfComponent } from './mutualfund/searchmf/searchmf.component';
import 'hammerjs';
import {MatCardModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {MatDialogModule} from '@angular/material';
import { MfeditComponent } from './mutualfund/mfedit/mfedit.component';
import { MfrefreshpopupComponent } from './mutualfund/mfrefreshpopup/mfrefreshpopup.component';
import { SoldmflistComponent } from './mutualfund/soldmflist/soldmflist.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MfdashboardComponent,
    SipdashboardComponent,
    SearchmfComponent,
    MfoneviewComponent,
    MfeditComponent,
    FilterPipe,
    MfrefreshpopupComponent,
    SoldmflistComponent,
  ],
  entryComponents: [MfeditComponent, MfrefreshpopupComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    BrowserAnimationsModule
  ],
  providers: [AuthGuard, MfService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
