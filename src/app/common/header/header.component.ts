import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/common/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  LoggedIn:boolean = false;
  private subs : Subscription;

  constructor(private router:Router, private authSer:AuthService) { }

  ngOnInit() {
    this.subs = this.authSer.userStatusChanged.subscribe(
      (userInfo:any)=>{
        // alert(token);
        this.LoggedIn = userInfo.loggedin;
        // this.isadmin = userInfo.isadmin;
      }
    );

    this.authSer.checklogin();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  onLogout(){
    this.authSer.onLogout();
    this.router.navigate(['signin']);
    //Can also clear the whole localStorage with
    //localStorage.clear();
  }

}
