import { Component, OnInit } from '@angular/core';
import { Bank } from '../common/bank';
import { BankService } from '../common/bank-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  bankname:string;
  bankbranch:string;
  imgURL:string;
  bnk:Bank;

  constructor(private bnkSer:BankService) { }

  ngOnInit() {
  }

  createBank(){
    this.bnk = new Bank("", this.bankname, this.bankbranch, this.imgURL);
console.log("creating bank");
    this.bnkSer.AddNewBank(this.bnk);
    
  }
}
