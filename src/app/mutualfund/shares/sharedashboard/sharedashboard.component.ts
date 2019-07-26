import { Component, OnInit } from '@angular/core';
import { MfService } from '../../common/mf-service.service';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Stock } from '../../common/stock';
import { ShareseditComponent } from '../sharesedit/sharesedit.component';
import { StockRefreshPopupComponent } from '../stock-refresh-popup/stock-refresh-popup.component';

@Component({
  selector: 'app-sharedashboard',
  templateUrl: './sharedashboard.component.html',
  styleUrls: ['./sharedashboard.component.css', '../../common/mutualfund.css']
})
export class SharedashboardComponent implements OnInit {
  
  records:Stock[];
  recordsSubscription = new Subscription();
  dummyrec:Stock = new Stock("", 0, "", '', 0, 0, new Date(),0, "", false);
  record:Stock = Object.assign({}, this.dummyrec);
  totalcost:number = 0;
  totalvalue:number = 0;
  searchText:string;
  message:string;
  profitflag:number = 0;

  constructor(private mfService:MfService, public dialog: MatDialog, ){}
  
  //   var query = 'function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + this.ticker + '&apikey=P7E38HT6THUF5U3R'; 

  //     this.httpClnt.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&apikey=P7E38HT6THUF5U3R" + query)
  //     .subscribe((response)=>{
  //     // response["Time Series (Daily)"][response["Meta Data"]["3. Last Refreshed"] ]["4. close"]
  //     console.log(response["Time Series (Daily)"][response["Meta Data"]["3. Last Refreshed"] ]["4. close"]);
  //     console.log(response);
  //       this.details = response.toString();
  //     });
      
  // }

  ngOnInit() {
    this.recordsSubscription = this.mfService.stockRecordsChanged
    .subscribe((records:Stock[])=>{
      console.log(this.profitflag);
      
      this.records = records.filter(
        (rec:Stock) => 
          this.profitflag == 0 ? (rec.isprofit ||  !rec.isprofit)
          : (this.profitflag == 1 ? !rec.isprofit : (rec.isprofit))
      );

      this.records.sort((a,b)=> {return a.name.localeCompare(b.name)});
    });
    console.log('stock dshboard nginit');
    this.mfService.GetStockList();
    this.message = "";
  }

  subtotalcost(records: Stock[]):number{
    if(records){
      this.totalcost = records.reduce((sum, item) => sum + (item.purchasenav * item.units), 0);
    }
    return this.totalcost;
  }

  subtotalvalue(records: Stock[]):number{
    if(records){
      this.totalvalue = records.reduce((sum, item) => sum + (item.currentnav * item.units), 0);
    }
    return this.totalvalue;
  }

  ngOnDestroy(){
    this.recordsSubscription.unsubscribe();
  }

  GetValue(record:Stock){
    this.mfService.GetStockData(record);
    this.message ="Latest NAV updated successfully for " + record.name;
  }

  AddEntry(){
    this.mfService.AddNewStock(this.record);
    this.record = Object.assign({}, this.dummyrec);
  }

  EditRecord(recorditem:Stock){
    this.record = new Stock(recorditem._id, recorditem.userid, recorditem.code, recorditem.name, recorditem.units, recorditem.purchasenav,recorditem.purchasedate, recorditem.currentnav, recorditem.comments, recorditem.isprofit);
  }

  UpdateEntry(){
    this.mfService.UpdateStock(this.record);
    this.record = Object.assign({}, this.dummyrec);
  }

  DeleteRecord(id:string){
    if(confirm('Do you really want to delete this entry?')){
      this.mfService.DeleteStock(id);
      this.message = "Record Deleted Successfully!!!";
    }
  }

  RefreshAll(){
    for(let record of this.records){
      this.GetValue(record);
    }
    this.message ="Latest NAV updated successfully for all records.";
  }

  openDialog(record:Stock, mode:string){
    let dialogRef = this.dialog.open(ShareseditComponent, {
      width: '600px',
      data:{ record, mode }, 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed: ${result}');
      this.message = result;
    });
  }

  openRefreshDialog(){
    let dialogRef = this.dialog.open(StockRefreshPopupComponent, {
      width: '900px',
      data: this.records, 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed: ${result}');
      this.message = result;
    });
  }

  GetInvetmentProfitData(profit:string){
    this.profitflag = +profit;
    this.mfService.GetStockList();
  }
}
