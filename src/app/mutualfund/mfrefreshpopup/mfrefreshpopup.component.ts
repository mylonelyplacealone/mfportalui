import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MfService } from '../mf-service.service';
import { MFRecord } from '../mfrecord';

@Component({
  selector: 'app-mfrefreshpopup',
  templateUrl: './mfrefreshpopup.component.html',
  styleUrls: ['./mfrefreshpopup.component.css']
})
export class MfrefreshpopupComponent implements OnInit {
  myrecords:MFRecord[];

  constructor(public thisDialogRef: MatDialogRef<MfrefreshpopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: MFRecord[],
    public mfService:MfService) { }

  ngOnInit() {
    this.myrecords =  this.data.map(x => Object.assign({}, x));
    for (var value of this.myrecords) {
      value.purchasenav = value.currentnav;
      value.currentnav = this.mfService.GetLatestNAV(value).currentnav;
    }
    // this.myrecords.reduce(x=>x.purchasenav = x.currentnav);
  }

  subtotal(records: MFRecord[]):number{
    if(records){
      return records.reduce((sum, item) => sum + ((item.currentnav - item.purchasenav) * item.units), 0);
    }
  }


  getCurrentNAV(record:MFRecord){
    return this.mfService.GetLatestNAV(record);
  }

  onCloseConfirm() {
      this.thisDialogRef.close('New Record added succssfully.');
  }

  onCloseCancel() {
    this.thisDialogRef.close('Record Add/Update Cancelled.');
  }

}
