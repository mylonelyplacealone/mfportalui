import { Component, OnInit } from '@angular/core';
import { MFSearchRecord } from '../common/mfsearch-record';
import { MfService } from '../common/mf-service.service';
import { MFRecord } from '../common/mfrecord';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-searchmf',
  templateUrl: './searchmf.component.html',
  styleUrls: ['./searchmf.component.css', '../common/mutualfund.css']
})
export class SearchmfComponent implements OnInit {
  mfrecords:MFSearchRecord[];
  searchstr:string = "";
  message:string="";
  operation:boolean = true;

  constructor(private mfService:MfService) { }

  ngOnInit() {
  }
  
  search(){
    //this.mfService.searchMFlist(this.searchstr);
    console.log(this.searchstr);

    this.mfService.searchMFlist(this.searchstr)
    .subscribe(searchlist => {
      console.log(searchlist);
       this.mfrecords = searchlist });
  }

  AddEntry(code:number, units:number, purchasedate:Date){
    this.mfService.GetMFNavforDate(code, purchasedate)
    .subscribe((res)=>{
      if(res[0]){
        // console.log(res[0].nav);
        this.mfService.AddNew(new MFRecord("",  +localStorage.getItem('userid'), code, "", units, +res[0].nav, purchasedate,0,"", false));
        this.message = "MF Record Executed successfully!!";
        this.operation = true;
      }
      else{
        // console.log(res['errormsg']);
        this.message = res['errormsg'];
        this.operation = false;
      }
    });
  }
}
