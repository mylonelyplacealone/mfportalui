import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../common/auth.service';
import { AuthResponse } from '../common/authResponse.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  formNotValid = false;
  errMsg= "";
  queryParam="";
  constructor(private authSer:AuthService,
      private router:Router,
      private actRoute:ActivatedRoute) { }

  ngOnInit() {
    this.authSer.onLogout();
    this.actRoute.queryParams
      .subscribe(params => {
        if(params.returnUrl){
          this.queryParam = params.returnUrl;
        }
      });

    // this.queryParam = this.actRoute.snapshot.queryParamMap.get('returnUrl');
  }

  onSignIn(form: NgForm){
    localStorage.removeItem('token');
    const email = form.value.email;
    const password = form.value.password;

    this.authSer.signinUser(email, password)
    .subscribe((resp:AuthResponse)=>{
      console.log(resp);
      // if(!resp.result){
      if(!resp['success']){
        this.formNotValid = true;
        this.errMsg = resp.message;
      } else{
        
        localStorage.setItem('userid', resp['user']['userid']);
        // console.log(localStorage.getItem('token'));
        // console.log('redirecting');
        // alert(this.queryParam);
        this.router.navigate([this.queryParam === null || this.queryParam === ''? 'home' : this.queryParam]);
      }
    });
  }
}
