import { Component, OnInit, OnDestroy } from '@angular/core';
import { MFRecord } from '../common/mfrecord';
import { MfService } from '../common/mf-service.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-mfsnapshot',
  templateUrl: './mfsnapshot.component.html',
  styleUrls: ['./mfsnapshot.component.css', '../common/mutualfund.css']
})
export class MfsnapshotComponent implements OnInit, OnDestroy {
  records:MFRecord[];
  baserecords:MFRecord[];
  totalcost:number = 0;
  totalvalue:number = 0;
  searchText:string;
  profitflag:number = 0;
  recordsChanged = new Subject<MFRecord[]>();
  recordsSubscription = new Subscription();
  snapshotdates;
  toggle:boolean = true;
  sortcolumn:string;

  constructor(private mfService:MfService){}

  ngOnInit() {
    this.mfService.GetSnapshotDates().subscribe((res)=>{
      // console.log(res);
      this.snapshotdates = res;
    });

    this.recordsSubscription = this.recordsChanged
    .subscribe((records:MFRecord[])=>{
      // console.log(this.profitflag);
        this.records = records.filter(
          (rec:MFRecord) => 
            this.profitflag == 0 ? (rec.isprofit ||  !rec.isprofit)
            : (this.profitflag == 1 ? !rec.isprofit : (rec.isprofit))
        );
    });
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

  GetInvetmentProfitData(profit:string){
    this.profitflag = +profit;
    this.recordsChanged.next(this.baserecords.slice());
  }

  GetSnapshotData(selecteddate:string){
    // console.log("Selected Date is : " + selecteddate);
    if(selecteddate == '0'){
      this.baserecords = [];
      this.recordsChanged.next(this.baserecords.slice());
    }
    else{
      this.mfService.GetSnapshotData(selecteddate)
      .subscribe((records:MFRecord[])=>{
        this.baserecords = records;
        this.recordsChanged.next(records);
      });
    }
  }

  deletesnapshot(selecteddate:string){
    if(selecteddate == '0'){
      alert('Please select valid snapshot to delete.');
    } else {
      if(confirm('Do you really want to delete this snapshot?')){
        this.mfService.DeleteSnapshot(selecteddate)
        .subscribe((res)=>{
          if(res['success']){
            console.log(res['message']);

            this.baserecords = [];
            this.recordsChanged.next(this.baserecords.slice());

            this.mfService.GetSnapshotDates().subscribe((res)=>{
              this.snapshotdates = res;
            });
          }
        });
      }
    }
  }

  sortData(value){
    this.sortcolumn = value;
    switch(value){
      case "name":{
        this.toggle ? this.records.sort((a,b)=> a.name.localeCompare(b.name)) : this.records.sort((a,b)=> b.name.localeCompare(a.name));
        this.toggle = !this.toggle;
        this.recordsChanged.next(this.records.slice());
        break;
      }

      case "purchasedate":{
        this.toggle ? this.records.sort((a,b)=> Number(new Date(b.purchasedate)) - Number(new Date(a.purchasedate))) : 
                      this.records.sort((a,b)=> Number(new Date(a.purchasedate)) - Number(new Date(b.purchasedate)));
        this.toggle = !this.toggle;
        this.recordsChanged.next(this.records.slice());
        break;
      }

      case "code":
      case "units":
      case "purchasenav":
      case "currentnav":
      {
        this.toggle ? this.records.sort((a,b)=> a[value] - b[value]) : this.records.sort((a,b)=> b[value] - a[value]);
        this.toggle = !this.toggle;
        this.recordsChanged.next(this.records.slice());
        break;
      }

      case "costvalue":
      {
        this.toggle ? 
          this.records.sort((a,b)=> (a.purchasenav * a.units) - (b.purchasenav * b.units)) :
          this.records.sort((a,b)=>(b.purchasenav * b.units) - (a.purchasenav * a.units));
        this.toggle = !this.toggle;
        this.recordsChanged.next(this.records.slice());
        break;
      }

      case "currentvalue":{
        this.toggle ? 
          this.records.sort((a,b)=> (a.currentnav * a.units) - (b.currentnav * b.units)) :
          this.records.sort((a,b)=>(b.currentnav * b.units) - (a.currentnav * a.units));
        this.toggle = !this.toggle;
        this.recordsChanged.next(this.records.slice());
        break;
      }

      case "profit":{
        this.toggle ? 
          this.records.sort((a,b)=> (((a.currentnav - a.purchasenav) * a.units)) - ((b.currentnav - b.purchasenav) * b.units)) :
          this.records.sort((a,b)=> (((b.currentnav - b.purchasenav) * b.units)) - ((a.currentnav - a.purchasenav) * a.units));
        
        this.toggle = !this.toggle;
        this.recordsChanged.next(this.records.slice());
        break;
      }

      case "percentage":{
        this.toggle ? 
          this.records.sort((a,b)=> ((((a.currentnav/a.purchasenav)-1) * 100) - (((b.currentnav/b.purchasenav)-1) * 100))):
          this.records.sort((a,b)=> ((((b.currentnav/b.purchasenav)-1) * 100) - (((a.currentnav/a.purchasenav)-1) * 100)));
        
        this.toggle = !this.toggle;
        this.recordsChanged.next(this.records.slice());
        break;
      }

      default: { 
        this.records.sort((a,b)=> a.name.localeCompare(b.name));
        this.recordsChanged.next(this.records.slice());
        break; 
     } 
    }
  }
}
