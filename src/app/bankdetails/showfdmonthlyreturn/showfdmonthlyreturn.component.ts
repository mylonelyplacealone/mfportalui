import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BankService } from '../common/bank-service.service';
import { Account } from '../common/account';
import { FDReturn } from '../common/fdreturn';

@Component({
  selector: 'app-showfdmonthlyreturn',
  templateUrl: './showfdmonthlyreturn.component.html',
  styleUrls: ['./showfdmonthlyreturn.component.css', '../common/bank.css']
})
export class ShowfdmonthlyreturnComponent implements OnInit {
  myaccounts:Account[];
  myentries:FDReturn[] =  [];
  cnt:number = 0;
  i:number;
  currentmonth = 0;
  matAmt=0;
  row:number[];
  sum:number;
  totalamt:number = 0;


  constructor(public thisDialogRef: MatDialogRef<ShowfdmonthlyreturnComponent>, 
    @Inject(MAT_DIALOG_DATA) public data:Account[],
    public bnkService:BankService) { }

  ngOnInit() {
    this.myaccounts =  this.data.map(x => Object.assign({}, x));
    this.totalamt = this.myaccounts.reduce((sum, item) => sum + (item.balance * item.interestrate / 100), 0);

    for (var acc of this.myaccounts) {
      this.row = [0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0];
      this.matAmt = acc.balance * acc.interestrate / 400;
      this.currentmonth = new Date(acc.openingdate).getMonth();

      for(this.i = 0; this.i < 4; this.i++) {
        if(this.currentmonth >= 12)
        {
          this.currentmonth -= 12;
        }

        this.row[this.currentmonth] = this.matAmt;
        this.currentmonth += 3;
      }

      this.myentries.push(new FDReturn(acc.bankname + ' - ' + acc.balance, this.row));
      this.cnt++;
    }
  }

  subtotal(num:number):number{
    this.sum = 0;

    for(this.i = 0; this.i < this.myentries.length; this.i++){
      this.sum += this.myentries[this.i].months[num-1];
    }
    
    return this.sum;
  }

  onCloseCancel() {
    this.thisDialogRef.close('Popup Closed successfully.');
  }
}
