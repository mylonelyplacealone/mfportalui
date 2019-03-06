import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user:string = "101";
  constructor() { }

  ngOnInit() {
  }

  setuser(){
    localStorage.setItem('userid', this.user);
  }
}
