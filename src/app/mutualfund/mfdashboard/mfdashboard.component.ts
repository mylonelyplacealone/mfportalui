import { Component, OnInit, OnDestroy } from '@angular/core';
import { MFRecord } from '../mfrecord';
import { MfService } from '../mf-service.service';
import { Subscription } from 'rxjs';
import {MatDialog } from '@angular/material';
import { MfeditComponent } from '../mfedit/mfedit.component';
import { MfrefreshpopupComponent } from '../mfrefreshpopup/mfrefreshpopup.component';

@Component({
  selector: 'app-mfdashboard',
  templateUrl: './mfdashboard.component.html',
  styleUrls: ['./mfdashboard.component.css']
})
export class MfdashboardComponent implements OnInit, OnDestroy {
  records:MFRecord[];
  recordsSubscription = new Subscription();
  dummyrec:MFRecord = new MFRecord("", 0, 0, '', 0, 0, new Date(), 0, "");
  record:MFRecord = Object.assign({}, this.dummyrec);
  editmode:boolean = false;
  totalcost:number = 0;
  totalvalue:number = 0;
  searchText:string;
  message:string;

  constructor(private mfService:MfService, public dialog: MatDialog, ){}

  ngOnInit() {
    this.recordsSubscription = this.mfService.recordsChanged
    .subscribe((records:MFRecord[])=>{
      //console.log(records);
      this.records = records;
      this.records.sort((a,b)=> {return a.name.localeCompare(b.name)});
      // this.totalcost = this.records.reduce((sum, item) => sum + (item.purchasenav * item.units), 0)
      // this.totalvalue = this.records.reduce((sum, item) => sum + (item.currentnav * item.units), 0)
    });
    console.log('mf dshboard nginit');
    this.mfService.GetMFList();
    this.message = "";
  }

  subtotalcost(records: MFRecord[]):number{
    if(records){
      this.totalcost = records.reduce((sum, item) => sum + (item.purchasenav * item.units), 0);
    }
    return this.totalcost;
  }

  subtotalvalue(records: MFRecord[]):number{
    if(records){
      this.totalvalue = records.reduce((sum, item) => sum + (item.currentnav * item.units), 0);
    }
    return this.totalvalue;
  }

  ngOnDestroy(){
    this.recordsSubscription.unsubscribe();
  }

  GetValue(record:MFRecord){
    this.mfService.GetMFData(record);
    this.message ="Latest NAV updated successfully for " + record.name;
  }

  AddEntry(){
    this.mfService.AddNew(this.record);
    this.record = Object.assign({}, this.dummyrec);
    this.editmode =false;
  }

  EditRecord(recorditem:MFRecord){
    this.record = new MFRecord(recorditem._id, recorditem.userid, recorditem.code, recorditem.name, recorditem.units, recorditem.purchasenav,recorditem.purchasedate, recorditem.currentnav, recorditem.comments);
    this.editmode = true;
  }

  UpdateEntry(){
    this.mfService.Update(this.record);
    this.record = Object.assign({}, this.dummyrec);
    this.editmode =false;
  }

  DeleteRecord(id:string){
    if(confirm('Do you really want to delete this entry?')){
      this.mfService.DeleteEntry(id);
    }
  }

  CancelEdit(){
    this.record = Object.assign({}, this.dummyrec);
    this.editmode = false;
  }

  RefreshAll(){
    for(let record of this.records){
      this.GetValue(record);
    }
    this.message ="Latest NAV updated successfully for all records.";
  }

  openDialog(record:MFRecord, mode:string){
    let dialogRef = this.dialog.open(MfeditComponent, {
      width: '600px',
      data:{ record, mode}, 
      // data: 'This text is passed into the dialog!'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed: ${result}');
      this.message = result;
    });
  }

  openRefreshDialog(){
    let dialogRef = this.dialog.open(MfrefreshpopupComponent, {
      width: '900px',
      data: this.records, 
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed: ${result}');
      this.message = result;
    });
  }

}
