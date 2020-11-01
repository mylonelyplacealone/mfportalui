import { Component, OnInit, Inject } from '@angular/core';
import { Stock } from '../../common/stock';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MfService } from '../../common/mf-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sharesedit',
  templateUrl: './sharesedit.component.html',
  styleUrls: ['./sharesedit.component.css']
})
export class ShareseditComponent implements OnInit {

  record:Stock;
  showcurrent:boolean = true;

  constructor(public thisDialogRef: MatDialogRef<ShareseditComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { record:Stock, mode:string },
    public mfService:MfService) { }

  ngOnInit() {
    this.record = new Stock(this.data.record._id, this.data.record.userid, this.data.record.code, 
    this.data.record.name, this.data.record.units, this.data.record.purchasenav,this.data.record.purchasedate, 
    this.data.record.currentnav, this.data.record.comments, this.data.record.isprofit);
  }

  onCloseConfirm(form:NgForm) {
    if(form.valid){
      if(this.record._id == "")
      {
        this.mfService.AddNewStock(this.record);
        this.thisDialogRef.close('New Record added succssfully.');
      }
      else{
        this.mfService.UpdateStock(this.record);
        this.thisDialogRef.close('Record updated succssfully.');
      }
    }
  }

  onCloseCancel() {
    this.thisDialogRef.close('Record Add/Update Cancelled.');
  }
}
