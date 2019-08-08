import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { QbankhomeComponent } from './qbank/qbankhome/qbankhome.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'mutualfund', loadChildren:'./mutualfund/mutualfund.module#MutualFundModule'},
  { path: 'bankdetails', loadChildren:'./bankdetails/bank.module#BankModule'},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'signup', component: SignupComponent},
  { path: 'signin', component: SigninComponent},
  { path: 'question', component: QbankhomeComponent},
];

@NgModule({
  imports:[
    RouterModule.forRoot(routes,{
        preloadingStrategy:PreloadAllModules
    })
],
exports:[RouterModule]
})
export class AppRoutingModule { }
