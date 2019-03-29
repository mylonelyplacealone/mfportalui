import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user:string = "101";
  message:string;
  dialogResult:string;//P7E38HT6THUF5U3R
  stockticker:string = "";
  constructor(private httpClnt:HttpClient) { }

  ngOnInit() {
  }

  setuser(){
    localStorage.setItem('userid', this.user);
    this.message = "User session set successfully to user id : " + this.user; 
  }

  getStockData(){

    var query = 'function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + this.stockticker + '&interval=60min&apikey=P7E38HT6THUF5U3R'; 
    // function_name, 
    // "&symbol=", 
    // stock_ticker, 
    // "&interval=", 
    // period, 
    // "&apikey=", 
    // my_api_key, 
    // "&datatype=", 
    // my_data_type

    // var mfdata = 'userid=' + localStorage.getItem('userid') + '&code=' + this.record.code
    // + '&name=' + this.record.name + '&units=' + this.record.units 
    // + '&purchasenav=' + this.record.purchasenav + '&purchasedate=' + this.record.purchasedate
    // + '&currentnav=' + this.record.currentnav + '&comments=' + this.record.comments
    // + '&issip=' + this.record.issip;


    this.httpClnt.get("https://www.alphavantage.co/query?" + query)
    .subscribe((response)=>{
      console.log(response);
      console.log(response["Meta Data"]);
      console.log(response["Meta Data"]["3. Last Refreshed"]);
      console.log(response["Time Series (Daily)"]);
      console.log(response["Time Series (Daily)"][response["Meta Data"]["3. Last Refreshed"]]);
    });
  }
}
