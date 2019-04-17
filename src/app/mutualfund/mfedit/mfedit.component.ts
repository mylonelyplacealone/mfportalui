import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {MatDialogRef} from '@angular/material';
import { MFRecord } from '../common/mfrecord';
import { MfService } from '../common/mf-service.service';
import { FormControl } from '@angular/forms';
import { MFSearchRecord } from '../common/mfsearch-record';

@Component({
  selector: 'app-mfedit',
  templateUrl: './mfedit.component.html',
  styleUrls: ['./mfedit.component.css']
})
export class MfeditComponent implements OnInit {
  record:MFRecord;
  searchRecords:MFSearchRecord[];
  searchTerm : FormControl = new FormControl();

  constructor(public thisDialogRef: MatDialogRef<MfeditComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { record:MFRecord, mode:string },
    public mfService:MfService) { }

  ngOnInit() {
    this.record = new MFRecord(this.data.record._id, this.data.record.userid, this.data.record.code, 
    this.data.record.name, this.data.record.units, this.data.record.purchasenav,this.data.record.purchasedate, 
    this.data.record.currentnav, this.data.record.comments, this.data.record.isprofit);

    this.searchTerm.valueChanges.subscribe(
      term => {
        if (term != '' && term.length > 4) {
          this.mfService.searchAutocompleteMF(term).subscribe(
            data => {
              this.searchRecords = data as any[];
              console.log(data);
          })
        }
    })
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

  displayFn(mf?: any): string | undefined {
    return mf ? mf.schemeName : undefined;
  }

  selectMF(selectedMF){
    this.record.code = selectedMF.schemeCode;
    this.record.name = selectedMF.schemeName;
  }
}
