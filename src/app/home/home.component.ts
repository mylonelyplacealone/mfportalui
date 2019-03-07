import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user:string = "101";
  message:string;

  constructor() { }

  ngOnInit() {
  }

  setuser(){
    localStorage.setItem('userid', this.user);
    this.message = "User session set successfully to user id : " + this.user; 
  }
}
