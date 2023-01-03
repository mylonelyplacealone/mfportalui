import { Component, OnInit, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankService } from '../bankdetails/common/bank-service.service';
import { MfService } from '../mutualfund/common/mf-service.service';
import { MFRecord } from '../mutualfund/common/mfrecord';
import { Stock } from '../mutualfund/common/stock';
import { ConfigClass } from '../common/config.service';
import { Portfolio } from '../bankdetails/common/portfolio';
import { MatDialog } from '@angular/material';
import { ShowportfoliosnapshotsComponent } from './showportfoliosnapshots/showportfoliosnapshots.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../common/styles.css']
})
export class HomeComponent implements OnInit {
  user:string = "Enter logged in user id here to pull data...";
  message:string;
  dialogResult:string;
  stockticker:string = "^NSEI";//P7E38HT6THUF5U3R
  stkdetails:string="";
  nextPrev:string[][]=[['Nifty 50','^NSEI', '','' ],['Sensex','^BSESN','','']];
  indexArr:string[][]=[['Nifty 50','NSX', '','' ],['Sensex','SEN','','']];
  currentNSEVal:number= 0;
  previousNSEVal:number= 0;

  shares:number = 0;
  mf:number = 0;
  savingsAcc:number = 0;
  fd:number = 0;
  rd:number = 0;
  epf:number = 0;
  ppf:number = 0;
  currentValue:number = 0;
  data= {};
  charttype:string='pie';
  options={};
  colors:number[] = [1, 2, 3, 4, 5, 6, 7];
  values:number[];
  valueChanged = new EventEmitter<number[]>();

  constructor(private httpClnt:HttpClient, private mfService:MfService, private bnkSer:BankService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.bnkSer.recordsChanged
    .subscribe((records)=>{
      if(records.length > 0){
        this.savingsAcc = records.filter(a => a.acctype == "SAVINGS").reduce((sum, item) => sum + item.balance, 0);
        this.fd  = records.filter(a => a.acctype == "FIXEDDEPOSIT").reduce((sum, item) => sum + item.balance, 0);
        this.rd  = records.filter(a => a.acctype == "RECURRENTDEPOSIT").reduce((sum, item) => sum + item.balance, 0);
        this.epf = records.filter(a => a.acctype == "EPF").reduce((sum, item) => sum + item.balance, 0);
        this.ppf = records.filter(a => a.acctype == "PPF").reduce((sum, item) => sum + item.balance, 0);
      }
      this.valueChanged.emit([this.shares, this.mf, this.savingsAcc, this.fd, this.rd, this.epf, this.ppf]);
    });

    this.mfService.recordsChanged
    .subscribe((records:MFRecord[])=>{
      if(records.length > 0)
        this.mf = records.reduce((sum, item) => sum + (item.currentnav * item.units), 0);
      
      this.valueChanged.emit([this.shares, this.mf, this.savingsAcc, this.fd, this.rd, this.epf, this.ppf]);
    });
    
    this.mfService.stockRecordsChanged
    .subscribe((records:Stock[])=>{
      if(records.length > 0)
        this.shares = records.reduce((sum, item) => sum + (item.currentnav * item.units), 0);
      
      this.valueChanged.emit([this.shares, this.mf, this.savingsAcc, this.fd, this.rd, this.epf, this.ppf]);
    });

    this.valueChanged.subscribe((res:number[])=>{
      console.log(res);

      this.currentValue = res.reduce((sum, item) => sum + item, 0);

      this.data =  {
        labels: ['Shares', 'Mutual Fund', 'Savings Account', 'Fixed Deposits', 
                'Recurrent Deposits', 'Employee PF', 'Public PF'],
        datasets: [{
          data: res.map(a => (a.toFixed(2))),
          backgroundColor: 
          this.colors.map(a => '#' + Math.floor(Math.random()*16777215).toString(16))
          
          // data: [this.shares.toFixed(2), this.mf.toFixed(2), this.savingsAcc.toFixed(2), this.fd.toFixed(2), 
          //         this.rd.toFixed(2), this.epf.toFixed(2), this.ppf.toFixed(2)],
          // backgroundColor: ["dodgerblue","green","brown", "purple","orange","yellow", "cyan"]
        }]        
      }
    });

    this.getIndexData();
    this.GetDashboardData();
  }

  getIndexData(){
    for(let record of this.indexArr){
      this.httpClnt.get(ConfigClass.indexAPIURL + record[1]).subscribe((response)=>{
        console.log(response);
        if(response){
          record[2] = response["data"].pricecurrent;
          record[3] = response["data"].pricechange;
          console.log(record);
        }
      });
    }
  }
  
  GetDashboardData(){
    this.mfService.GetStockList();
    this.mfService.GetMFList();
    this.bnkSer.GetAccountList("");
  }

  setuser(){
    localStorage.setItem('userid', this.user);
    this.message = "User session set successfully to user id : " + this.user;
    this.shares = 0;
    this.mf = 0;
    this.savingsAcc = 0;
    this.fd = 0;
    this.rd = 0;
    this.epf = 0;
    this.ppf = 0;
    this.GetDashboardData();
  }

  portfolio:Portfolio;

  takesnapshot(){
   
    this.portfolio = new Portfolio("", localStorage.getItem('userid') , new Date(new Date().setHours(0, 0, 0, 0)), this.shares, this.mf, this.savingsAcc, this.fd, this.rd, this.epf, this.ppf, "");

    this.bnkSer.TakePortfolioSnapshot(this.portfolio)
    .subscribe((res)=>{
      // console.log('Snapshot Taken correctly.');
      this.message = res['message'];
    });
  }

  
  openDialog(userid:string){
    let dialogRef = this.dialog.open(ShowportfoliosnapshotsComponent, {
      width: '900px',
      data:{ userid }, 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed: ${result}');
      this.message = result;
    });
  }

 
}
