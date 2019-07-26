import { Injectable } from '@angular/core';
import { Account } from './account';
import { Bank } from './bank';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigClass } from 'src/app/common/config.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  servicedata:string;
  header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  .append('x-access-token', localStorage.getItem('token'));
  accounts:Account[];
  recordsChanged = new Subject<Account[]>();

  constructor(private httpClnt:HttpClient) { }

  GetBanks():Bank[]{
    return [
      new Bank('ICICI Bank', 'ICICI Bank', 'Pune'),
      new Bank('SBI', 'SBI', 'Kolhapur'),
      new Bank('IDBI Bank', 'IDBI Bank', 'Pune'),
    ];
  }


  AddNewBank(bnk:Bank){

    this.servicedata = 'name=' + bnk.bankName + '&branch=' + bnk.bankBranch
                  + '&imgURL=' + bnk.imgURL;
      this.httpClnt.post(ConfigClass.restAPIURL + 'bankdetail/bank', this.servicedata, { headers: this.header })
      .subscribe((res)=>{
        console.log(res);
          // this.records.push(res['newmf']);
          // this.records.sort((a,b)=> {return a.code - b.code});
          // this.recordsChanged.next(this.records.slice());
      });
  }

  GetAccountList(accType:string){
    this.httpClnt.get(ConfigClass.restAPIURL + 'bankdetail/accounts', 
          { headers: this.header, 
            params:{ 
              userid: localStorage.getItem('userid'),
              accType: accType
            }
          })
    .subscribe((res:Account[])=>{
      console.log(res);
      this.accounts = res;
      if(this.accounts && this.accounts.length > 0){
        this.accounts.sort((a,b)=> {return a.balance - b.balance});
        this.recordsChanged.next(this.accounts.slice());
      }
    });
  }

  AddNewAccount(acc:Account){
    // console.log(Math.round(Math.abs(new Date(acc.maturitydate).getTime()- new Date(acc.openingdate).getTime())/(1000*60*60*24)));
    this.servicedata = 'userid=' + localStorage.getItem('userid')
                  + '&bankname=' + acc.bankname + '&balance=' + acc.balance
                  + '&openingDate=' + acc.openingdate + '&interestRate=' + acc.interestrate
                  + '&comments=' + acc.comments + '&accType=' + acc.acctype 
                  + (acc.acctype == 'FIXEDDEPOSIT'?'&maturityamt=' + (acc.balance + (((acc.balance * acc.interestrate)/(36500)) * ( Math.round(Math.abs(new Date(acc.maturitydate).getTime()- new Date(acc.openingdate).getTime())/(1000*60*60*24))))):'')
                  + (acc.acctype == 'RECURRENTDEPOSIT'?'&maturityamt=' + ((Math.round(((new Date(acc.maturitydate).getTime() - new Date(acc.openingdate).getTime()) / 1000)/(60 * 60 * 24 * 7 * 4)) * acc.installmentamt) + (acc.installmentamt * (Math.pow((1 + (acc.interestrate/400)) , (4*(Math.abs(Math.round(((new Date(acc.maturitydate).getTime() - new Date(acc.openingdate).getTime()) / 1000)/(60 * 60 * 24 * 7 * 4)))/12)))))): '')
                  + (acc.maturitydate? '&maturitydate=' +  acc.maturitydate : "")
                  + (acc.installmentamt? '&installmentamt=' +  acc.installmentamt : "");

        console.log(this.servicedata);
        // console.log((Math.abs(Math.round((((new Date(acc.maturitydate).getTime() - new Date(acc.openingdate).getTime()) / 1000)/(60 * 60 * 24 * 7 * 4))))/12));
        // (acc.installmentamt * ((1 + (acc.interestrate/400)) ^ (4*((Math.abs(Math.round((((new Date(acc.maturitydate).getTime() - new Date(acc.openingdate).getTime()) / 1000)/(60 * 60 * 24 * 7 * 4))))/12))))): '')

      this.httpClnt.post(ConfigClass.restAPIURL + 'bankdetail/account', this.servicedata, { headers: this.header })
      .subscribe((res)=>{
        console.log(res);
          this.accounts.push(res['newacc']);
          this.accounts.sort((a,b)=> {return a.balance - b.balance});
          this.recordsChanged.next(this.accounts.slice());
      });
  }

  UpdateAccount(account:Account){
    this.servicedata = 'userid=' + localStorage.getItem('userid')  
                  + '&bankname=' + account.bankname + '&balance=' + account.balance//(Math.round(((new Date(account.maturitydate).getTime() - new Date(account.openingdate).getTime()) / 1000)/(60 * 60 * 24 * 7 * 4)) * account.installmentamt)
                  + '&openingDate=' + account.openingdate + '&interestRate=' + account.interestrate
                  + '&comments=' + account.comments + '&accType=' + account.acctype
                  + (account.acctype == 'FIXEDDEPOSIT'?'&maturityamt=' + (account.balance + (((account.balance * account.interestrate)/(36500)) * ( Math.round(Math.abs(new Date(account.maturitydate).getTime()- new Date(account.openingdate).getTime())/(1000*60*60*24))))):'')
                  + (account.acctype == 'RECURRENTDEPOSIT'?'&maturityamt=' + ((Math.round(((new Date(account.maturitydate).getTime() - new Date(account.openingdate).getTime()) / 1000)/(60 * 60 * 24 * 7 * 4)) * account.installmentamt) + (account.installmentamt * (Math.pow((1 + (account.interestrate/400)) , (4*(Math.abs(Math.round(((new Date(account.maturitydate).getTime() - new Date(account.openingdate).getTime()) / 1000)/(60 * 60 * 24 * 7 * 4)))/12)))))): '')
                  + (account.maturitydate? '&maturitydate=' +  account.maturitydate : "");
                 
        // console.log(Math.pow((1 + (account.interestrate/400)) , 4* Math.abs(Math.round(((new Date(account.maturitydate).getTime() - new Date(account.openingdate).getTime()) / 1000)/(60 * 60 * 24 * 7 * 4)))/12));
        // (account.installmentamt * (Math.pow((1 + (account.interestrate/400)) , )))

    this.httpClnt.put(ConfigClass.restAPIURL + 'bankdetail/account/' + account._id, this.servicedata, {  headers:this.header })
    .subscribe((res)=>{
        if(res['success'])
        {
          this.accounts.splice(this.accounts.indexOf(this.accounts.find(x=>x._id == account._id)), 1);
          this.accounts.push(res['accrecord']);
        }
        
        this.accounts.sort((a,b)=> {return a.balance - b.balance});
        this.recordsChanged.next(this.accounts.slice());
      });
  }

  DeleteAccount(_id:string){
    this.httpClnt.delete(ConfigClass.restAPIURL + 'bankdetail/account/'+ _id, 
        { 
          headers: this.header, // params:{ _id : _id}
        })
    .subscribe((res)=>{
      if(res['success'])
      {
        this.accounts.splice(this.accounts.indexOf(this.accounts.find(x=>x._id == _id)), 1);
        this.accounts.sort((a,b)=> {return a.balance - b.balance});
        this.recordsChanged.next(this.accounts.slice());
      }
    });
  }
}
