import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth-guard.service';
import { HeaderComponent } from './common/header/header.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import 'hammerjs';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoaderComponent } from './common/loader/loader.component';
import { LoaderInterceptorService } from './common/loader/loader.intercepter';
import { DatePipe } from '@angular/common';
import { ChartModule } from 'angular2-chartjs';
import { SummaryComponent } from './qbank/summary/summary.component';
import { DetailsComponent } from './qbank/details/details.component';
import { DataService } from './qbank/data.service';
import { QbankhomeComponent } from './qbank/qbankhome/qbankhome.component';
import { FilterPipe } from './common/filter.pipe';
import { SharedModule } from './common/shared.module';
import { ShowportfoliosnapshotsComponent } from './home/showportfoliosnapshots/showportfoliosnapshots.component';
import {MatDialogModule, MatTabsModule} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    LoaderComponent,
    SummaryComponent,
    DetailsComponent,
    QbankhomeComponent,
    ShowportfoliosnapshotsComponent,
  ],
  entryComponents: [
    ShowportfoliosnapshotsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app'}),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ChartModule,
    SharedModule,
    MatDialogModule,
    MatTabsModule
  ],
  providers: [AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }, 
    DatePipe,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
