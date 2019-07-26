import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BankService } from '../common/bank-service.service';
import { Subscription } from 'rxjs';
import { Account } from '../common/account';
import { AccounteditComponent } from '../accountedit/accountedit.component';

@Component({
  selector: 'app-epfppf',
  templateUrl: './epfppf.component.html',
  styleUrls: ['./epfppf.component.css', '../common/bank.css']
})
export class EpfppfComponent implements OnInit {
  recordsSubscription = new Subscription();
  message:string = "";
  dummyrec:Account = new Account("", 'ICICI', 0, new Date(), 0, '', '', new Date(), 0);
  account:Account = Object.assign({}, this.dummyrec);
  accounts:Account[] = [];
  totalbalance = 0;
  searchText:string;

  constructor(public dialog: MatDialog, private bnkSer:BankService) { }

  ngOnInit() {
    this.recordsSubscription = this.bnkSer.recordsChanged
    .subscribe((records:Account[])=>{
        this.accounts = records;
    });

    this.bnkSer.GetAccountList("EPFPPF");
    this.message = "";
  }

  ngOnDestroy(){
    this.recordsSubscription.unsubscribe();
  }

  openDialog(record:Account, mode:string){
    console.log(mode);
    let dialogRef = this.dialog.open(AccounteditComponent, {
      width: '700px',
      data:{ record, mode, accType: "EPFPPF"}, 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed: ${result}');
      this.message = result;
    });
  }

  subtotal(accts: Account[]):number{
    if(accts){
      this.totalbalance = accts.reduce((sum, item) => sum + (item.balance), 0);
    }
    return this.totalbalance;
  }

  DeleteAccount(id:string){
    if(confirm('Do you really want to delete this Account?')){
      this.bnkSer.DeleteAccount(id);
      this.message = "Account Deleted Successfully!!!";
    }
  }

}
