import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {MatDialogRef} from '@angular/material';
import { MfService } from '../common/mf-service.service';
import { FormControl, NgForm } from '@angular/forms';
import { MFSearchRecord } from '../common/mfsearch-record';
import { MFSIPRecord } from '../common/mfsiprecord';

@Component({
  selector: 'app-sipedit',
  templateUrl: './sipedit.component.html',
  styleUrls: ['./sipedit.component.css', '../common/mutualfund.css']
})
export class SIPeditComponent implements OnInit {
  record:MFSIPRecord;
  searchRecords:MFSearchRecord[];
  searchTerm : FormControl = new FormControl();
  
  constructor(public thisDialogRef: MatDialogRef<SIPeditComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { record:MFSIPRecord, mode:string },
    public mfService:MfService) { }

  ngOnInit() {
    this.record = new MFSIPRecord(this.data.record._id, +localStorage.getItem('userid'), 
                  this.data.record.code, this.data.record.name, this.data.record.amount,
                  this.data.record.startdate, this.data.record.enddate, this.data.record.frequency, null);
  
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

  onCloseConfirm(form:NgForm) {
    if(form.valid){
      // console.log('form is valid');
      if(this.record._id == "")
      {
        this.mfService.AddNewSIP(this.record);
        this.thisDialogRef.close('New SIP added succssfully.');
      }
      else{
        this.mfService.UpdateSIP(this.record);
        this.thisDialogRef.close('SIP updated succssfully.');
      }
    }
  }

  onCloseCancel() {
    this.thisDialogRef.close('SIP Add/Update Cancelled.');
  }

  displayFn(mf?: any): string | undefined {
    return mf ? mf.schemeName : undefined;
  }

  selectMF(selectedMF){
    this.record.code = selectedMF.schemeCode;
    this.record.name = selectedMF.schemeName;
  }
}
