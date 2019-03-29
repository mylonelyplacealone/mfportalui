import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MfService } from '../common/mf-service.service';
import { MFRecord } from '../common/mfrecord';

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

  // onCloseConfirm() {
  //   for(let record of this.myrecords){
  //     this.mfService.GetMFData(record);
  //   }
  //   this.thisDialogRef.close('Records updated with latest NAVs.');
  // }

  onCloseCancel() {
    this.thisDialogRef.close('Popup Closed successfully.');
  }

}
