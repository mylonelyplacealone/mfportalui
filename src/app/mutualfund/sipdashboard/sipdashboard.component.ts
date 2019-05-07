import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MFSIPRecord } from '../common/mfsiprecord';
import { MfService } from '../common/mf-service.service';
import { MFRecord } from '../common/mfrecord';
import { SIPeditComponent } from '../sipedit/sipedit.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sipdashboard',
  templateUrl: './sipdashboard.component.html',
  styleUrls: ['./sipdashboard.component.css', '../common/mutualfund.css']
})
export class SipdashboardComponent implements OnInit, OnDestroy {
  records:MFSIPRecord[];
  nav:number;
  errormessage:string="";
  recordsSubscription = new Subscription();
  editmode:boolean = false;
  dummyrec:MFSIPRecord = new MFSIPRecord("", 0, 0, '', 0, new Date(), new Date(), "");
  record:MFSIPRecord = Object.assign({}, this.dummyrec);;
  operation:boolean = true;
  siptotal = 0;

  constructor(private mfService:MfService, public datepipe: DatePipe, public dialog: MatDialog) { }

  ngOnInit() {
    this.recordsSubscription = this.mfService.siprecordsChanged
    .subscribe((records:MFSIPRecord[])=>{
      this.records = records;
      this.siptotal = this.records.reduce((sum, item) => sum + item.amount, 0);
    });
    this.mfService.GetMFSIPList();
  }

  ngOnDestroy(){
    this.recordsSubscription.unsubscribe();
  }

  AddSIP(){
    this.mfService.AddNewSIP(this.record);
    this.record = Object.assign({}, this.dummyrec);
    this.editmode =false;
  }

  EditRecord(recorditem:MFSIPRecord){
    this.record = new MFSIPRecord(recorditem._id, recorditem.userid, recorditem.code, recorditem.name, recorditem.amount, recorditem.startdate, recorditem.enddate, recorditem.frequency);
    this.editmode = true;
  }
  
  UpdateSIP(){
    this.mfService.UpdateSIP(this.record);
    this.record = Object.assign({}, this.dummyrec);
    this.editmode =false;
  }

  CancelEdit(){
    this.record = Object.assign({}, this.dummyrec);
    this.editmode = false;
  }

  ExecuteSIP(recorditem:MFSIPRecord){
    this.errormessage ="";
    this.mfService.GetMFNavforDate(recorditem.code, recorditem.executiondate)
    .subscribe((res)=>{
      if(res[0]){
        console.log(res[0]
          .nav);
        this.mfService.AddNew(new MFRecord("",  +localStorage.getItem('userid'), recorditem.code, "", recorditem.amount/+res[0].nav, +res[0].nav, recorditem.executiondate,0,"", false, true));
        this.errormessage = "SIP Executed successfully!!";
        this.operation = true;
      }
      else{
        console.log(res['errormsg']);
        this.errormessage = res['errormsg'];
        this.operation = false;
      }
    });
  }

  DeleteRecord(id:string){
    if(confirm('Do you really want to delete this SIP?')){
      this.mfService.DeleteSIP(id);
    }
  }

  openDialog(record:MFSIPRecord, mode:string){
    let dialogRef = this.dialog.open(SIPeditComponent, {
      width: '600px',
      data:{ record, mode}, 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed: ${result}');
      this.errormessage = result;
    });
  }

}
