import { Component, OnInit, OnDestroy } from '@angular/core';
import { MFSIPRecord } from '../../mfsiprecord';
import { MfService } from '../../mf-service.service';
import { DatePipe } from '@angular/common';
import { MFRecord } from '../../mfrecord';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sipdashboard',
  templateUrl: './sipdashboard.component.html',
  styleUrls: ['./sipdashboard.component.css']
})
export class SipdashboardComponent implements OnInit, OnDestroy {
  records:MFSIPRecord[];
  nav:number;
  errormessage:string="";
  recordsSubscription = new Subscription();
  editmode:false;
  dummyrec:MFSIPRecord = new MFSIPRecord("", 0, 0, '', 0, new Date(), new Date(), "");
  record:MFSIPRecord = Object.assign({}, this.dummyrec);;

  constructor(private mfService:MfService, public datepipe: DatePipe) { }

  ngOnInit() {
    this.recordsSubscription = this.mfService.siprecordsChanged
    .subscribe((records:MFSIPRecord[])=>{
      this.records = records;
    });
    this.mfService.GetMFSIPList();
  }

  ngOnDestroy(){
    this.recordsSubscription.unsubscribe();
  }

  AddSIPEntry(){
    this.mfService.AddNewSIP(this.record);
    this.record = Object.assign({}, this.dummyrec);
    this.editmode =false;
  }

  EditRecord(recorditem:MFSIPRecord){
  }
  
  ExecuteSIP(recorditem:MFSIPRecord){
    this.errormessage ="";
    this.mfService.GetMFNavforDate(recorditem.code, recorditem.executiondate)
    .subscribe((res)=>{
      if(res[0]){
        console.log(res[0].nav);
        this.mfService.AddNew(new MFRecord("",  +localStorage.getItem('userid'), recorditem.code, "", recorditem.amount/+res[0].nav, +res[0].nav, recorditem.executiondate,0,true));
        this.errormessage = "SIP Executed successfully!!";
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
