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
import { SearchmfComponent } from './mutualfund/CRUDpages/searchmf/searchmf.component';
import { MfService } from './mutualfund/mf-service.service';
import { SipdashboardComponent } from './mutualfund/crudpages/sipdashboard/sipdashboard.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MfdashboardComponent,
    SearchmfComponent,
    SipdashboardComponent
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
