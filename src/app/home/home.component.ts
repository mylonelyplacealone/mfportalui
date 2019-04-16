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
  dialogResult:string;
  stockticker:string = "^NSEI";//P7E38HT6THUF5U3R
  stkdetails:string="";
  nextPrev:string[][]=[['Nifty 50','^NSEI', '','' ],['Sensex','^BSESN','','']];
  currentNSEVal:number= 0;
  previousNSEVal:number= 0;

  constructor(private httpClnt:HttpClient) { }

  ngOnInit() {
    this.getStockData();
  }

  setuser(){
    localStorage.setItem('userid', this.user);
    this.message = "User session set successfully to user id : " + this.user; 
  }

  getStockData(){
    for(let record of this.nextPrev){
      // console.log(record);
      // console.log(record[1]);

      var query = 'function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + record[1] + '&interval=60min&apikey=P7E38HT6THUF5U3R'; 

      this.httpClnt.get("https://www.alphavantage.co/query?" + query)
      .subscribe((response)=>{
        console.log(response);
        console.log(response["Meta Data"]["3. Last Refreshed"]);
        record[2] = response["Time Series (Daily)"][response["Meta Data"]["3. Last Refreshed"]]["4. close"];
        var date = new Date(response["Meta Data"]["3. Last Refreshed"]);
        if(date.getDay() == 1)
          date.setDate(date.getDate() - 4);
        else
          date.setDate(date.getDate() - 1);
  
        var str= date.getFullYear() + "-0" +(date.getMonth() +1) + "-"+ date.getDate();
        record[3] = response["Time Series (Daily)"][str]["4. close"];
        console.log(record);

      });
    }

    // var query = 'function=TIME_SERIES_INTRADAY&symbol=' + this.stockticker + '&interval=60min&apikey=P7E38HT6THUF5U3R'; 
    // var query = 'function=TIME_SERIES_DAILY&symbol=' + this.stockticker + '&apikey=P7E38HT6THUF5U3R'; 
    // function_name, 
    // "&symbol=", 
    // stock_ticker, 
    // "&interval=", 
    // period, 
    // "&apikey=", 
    // my_api_key, 
    // "&datatype=", 
    // my_data_type

    // var query = 'function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + this.stockticker + '&interval=60min&apikey=P7E38HT6THUF5U3R'; 
    
    // this.httpClnt.get("https://www.alphavantage.co/query?" + query)
    // .subscribe((response)=>{
    //   // console.log(response);
    //   this.currentNSEVal = +response["Time Series (Daily)"][response["Meta Data"]["3. Last Refreshed"]]["4. close"];
    //   this.stkdetails = response["Meta Data"]["3. Last Refreshed"] + " : " + response["Time Series (Daily)"][response["Meta Data"]["3. Last Refreshed"]]["4. close"];
    //   var date = new Date(response["Meta Data"]["3. Last Refreshed"]);
    //   if(date.getDay() == 1)
    //     date.setDate(date.getDate() - 3);
    //   else
    //     date.setDate(date.getDate() - 1);

    //   var str= date.getFullYear() + "-0" +(date.getMonth() +1) + "-0"+ date.getDate();

    //   this.stkdetails += str + " : " + response["Time Series (Daily)"][str]["4. close"];

    //   this.previousNSEVal = +response["Time Series (Daily)"][str]["4. close"];
    // });
  }
}
