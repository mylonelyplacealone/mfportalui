import { Component, OnInit } from '@angular/core';
import { Account } from '../common/account';
import { AccounteditComponent } from '../accountedit/accountedit.component';
import { MatDialog } from '@angular/material';
import { Bank } from '../common/bank';
import { MFRecord } from 'src/app/mutualfund/common/mfrecord';
import { BankService } from '../common/bank-service.service';

@Component({
  selector: 'app-bankdetailhome',
  templateUrl: './bankdetailhome.component.html',
  styleUrls: ['./bankdetailhome.component.css' , '../common/bank.css']
})
export class BankdetailhomeComponent implements OnInit {
  savingsAcc:number = 0;
  fd:number = 0;
  rd:number = 0;
  epf:number = 0;
  ppf:number = 0;
  currentValue:number = 0;
  data= {};
  charttype:string='pie';
  options={};

  constructor(private bnkSer:BankService) { }

  ngOnInit() {
    this.bnkSer.recordsChanged
    .subscribe((records)=>{
      console.log(records);
      this.savingsAcc = records.filter(a => a.acctype == "SAVINGS").reduce((sum, item) => sum + item.balance, 0);
      this.fd  = records.filter(a => a.acctype == "FIXEDDEPOSIT").reduce((sum, item) => sum + item.balance, 0);
      this.rd  = records.filter(a => a.acctype == "RECURRENTDEPOSIT").reduce((sum, item) => sum + item.balance, 0);
      this.epf = records.filter(a => a.acctype == "EPF").reduce((sum, item) => sum + item.balance, 0);
      this.ppf = records.filter(a => a.acctype == "PPF").reduce((sum, item) => sum + item.balance, 0);
      this.currentValue = this.savingsAcc + this.fd + this.rd + this.epf + this.ppf;
      
      this.data =  {
        labels: ['Savings Account', 'Fixed Deposits', 'Recurrent Deposits', 'EPF', 'PPF'],
        datasets: [{
          data: [this.savingsAcc.toFixed(2), this.fd.toFixed(2), this.rd.toFixed(2), 
            this.epf.toFixed(2), this.ppf.toFixed(2)],
          backgroundColor: ["dodgerblue","green","palegreen", "brown", "gray"]
        }]        
      }
    });

    this.bnkSer.GetAccountList("");
  }
}
