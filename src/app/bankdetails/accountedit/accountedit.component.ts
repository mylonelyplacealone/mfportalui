import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BankService } from '../common/bank-service.service';
import { Account } from '../common/account';
import { NgForm } from '@angular/forms';
import { Bank } from '../common/bank';

@Component({
  selector: 'app-accountedit',
  templateUrl: './accountedit.component.html',
  styleUrls: ['./accountedit.component.css']
})
export class AccounteditComponent implements OnInit {

  record:Account;

  banks:Bank[] = [];

  constructor(public thisDialogRef: MatDialogRef<AccounteditComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { record:Account, mode:string , accType:string},
    public bankService:BankService) { }

  ngOnInit() {
    console.log(this.data.mode);
    console.log(this.data.record);

    //this.banks = this.bankService.GetBanks();

    if(this.data.record){
      this.record = new Account(this.data.record._id, this.data.record.bankname, this.data.record.balance,
                    this.data.record.openingdate, this.data.record.interestrate, 
                    this.data.accType == 'EPFPPF'? this.data.record.acctype: this.data.accType, 
                    this.data.record.comments, this.data.record.maturitydate, this.data.record.maturityamt, this.data.record.installmentamt);
    }
  }

  onCloseConfirm(form:NgForm) {
    if(form.valid){
      // console.log('form is valid');
      console.log(this.record);
      if(this.record._id == "")
      {
        this.bankService.AddNewAccount(this.record);
        this.thisDialogRef.close('New Account added succssfully.' + this.record.bankname);
      }
      else{
        this.bankService.UpdateAccount(this.record);
        this.thisDialogRef.close('Account updated succssfully.');
      }
    }
  }

  onCloseCancel() {
    this.thisDialogRef.close('Record Add/Update Cancelled.');
  }

  displayFn(mf?: any): string | undefined {
    return mf ? mf.schemeName : undefined;
  }

  selectBank(bankId){
    console.log(bankId);
    // this.record.bankName =  this.banks.slice().find(x=>x._id == bankId).bankName;
    this.record.bankname =  bankId;
    
  }

}
