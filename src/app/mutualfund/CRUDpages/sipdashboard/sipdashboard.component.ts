import { Component, OnInit } from '@angular/core';
import { MFSIPRecord } from '../../mfsiprecord';
import { MfService } from '../../mf-service.service';
import { DatePipe } from '@angular/common';
import { MFRecord } from '../../mfrecord';

@Component({
  selector: 'app-sipdashboard',
  templateUrl: './sipdashboard.component.html',
  styleUrls: ['./sipdashboard.component.css']
})
export class SipdashboardComponent implements OnInit {
  records:MFSIPRecord[];
  nav:number;
  errormessage:string="";

  constructor(private mfService:MfService, public datepipe: DatePipe) { }

  ngOnInit() {
    this.records = this.mfService.GetMFSIPList();
  }

  EditRecord(recorditem:MFSIPRecord){
  }
  
  ExecuteSIP(recorditem:MFSIPRecord){
    this.errormessage ="";
    this.mfService.GetMFNavforDate(recorditem.code, recorditem.executiondate)
    .subscribe((res)=>{
      if(res[0]){
        console.log(res[0].nav);
        //this.mfService.AddNew(new MFRecord("",  +localStorage.getItem('userid'), recorditem.code, "", recorditem.amount/+res[0].nav, +res[0].nav, recorditem.executiondate,0,true));
      }
      else{
        console.log(res['errormsg']);
        this.errormessage = res['errormsg'];
      }
    });
  }

  DeleteRecord(id:number){
    
  }
 

}
