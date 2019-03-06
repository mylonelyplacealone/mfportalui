import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
import { SipdashboardComponent } from './mutualfund/crudpages/sipdashboard/sipdashboard.component';
import { SearchmfComponent } from './mutualfund/crudpages/searchmf/searchmf.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MfdashboardComponent,
    SipdashboardComponent,
    SearchmfComponent,
    MfoneviewComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AuthGuard, MfService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
