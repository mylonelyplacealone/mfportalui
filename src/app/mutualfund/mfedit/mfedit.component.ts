import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {MatDialogRef} from '@angular/material';
import { MFRecord } from '../common/mfrecord';
import { MfService } from '../common/mf-service.service';

@Component({
  selector: 'app-mfedit',
  templateUrl: './mfedit.component.html',
  styleUrls: ['./mfedit.component.css']
})
export class MfeditComponent implements OnInit {
  record:MFRecord;

  constructor(public thisDialogRef: MatDialogRef<MfeditComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { record:MFRecord, mode:string },
    public mfService:MfService) { }

  ngOnInit() {
    this.record = new MFRecord(this.data.record._id, this.data.record.userid, this.data.record.code, 
      this.data.record.name, this.data.record.units, this.data.record.purchasenav,this.data.record.purchasedate, 
      this.data.record.currentnav, this.data.record.comments);
  }

  onCloseConfirm() {
    if(this.record._id == "")
    {
      this.mfService.AddNew(this.record);
      this.thisDialogRef.close('New Record added succssfully.');
    }
    else{
      this.mfService.Update(this.record);
      this.thisDialogRef.close('Record updated succssfully.');
    }
  }

  onCloseCancel() {
    this.thisDialogRef.close('Record Add/Update Cancelled.');
  }
}
