import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../common/user.model';
import { AuthService } from '../common/auth.service';
import { AuthResponse } from '../common/authResponse.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user:User;
  signupFailed = false;
  errMsg="";

  constructor(private authSer:AuthService,
      private router:Router) { }

  ngOnInit() {
     this.authSer.onLogout();
  }

  onSignUp(form: NgForm){
    this.user = new User({
      userid:0,
      name:form.value.name,
      phone:form.value.phone,
      email:form.value.email,
      password:form.value.password,
    });

    this.authSer.signupUser(this.user)
    .subscribe((resp:AuthResponse)=>{
      console.log(resp);
      if(!resp['success']){
        this.signupFailed = true;
        this.errMsg = resp.message;
      } else {
        this.errMsg = "User Created successfully.";
        console.log("User Created successfully.");
        // this.router.navigate(['/home']);
      }
    });
  }
}
