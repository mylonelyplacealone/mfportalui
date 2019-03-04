import { Component, OnInit } from '@angular/core';
import { MFRecord } from '../mfrecord';
import { Subscription } from 'rxjs';
import { MfService } from '../mf-service.service'; 

@Component({
  selector: 'app-mfoneview',
  templateUrl: './mfoneview.component.html',
  styleUrls: ['./mfoneview.component.css']
})
export class MfoneviewComponent implements OnInit {
  selectedrecord:MFRecord;
  groupedRecords:MFRecord[]=[];
  recordsSubscription = new Subscription();
  totalcost:number = 0;
  totalvalue:number = 0;

  constructor(private mfService:MfService) { }

  ngOnInit() {
    this.recordsSubscription = this.mfService.recordsChanged
    .subscribe((records:MFRecord[])=>{
      this.groupedRecords = [];
      //console.log(this.objectKey(this.formatedCerts(records)));
      for(let item of this.objectKey(this.formatedList(records))){
        //console.log("item key is : " + item);
        //console.log(this.formatedCerts(records)[item]);
        
        var units = this.formatedList(records)[item].reduce((sum, itemone:MFRecord) => sum + (itemone.units), 0);
        var avgnav = this.formatedList(records)[item].reduce((sum, itemone:MFRecord) => sum + (itemone.units * itemone.purchasenav), 0)/units;

        this.selectedrecord = Object.assign({}, this.formatedList(records)[item][0]);;
        this.selectedrecord.units = units;
        this.selectedrecord.purchasenav = avgnav;
        this.groupedRecords.push(this.selectedrecord);
      }

      this.totalcost = this.groupedRecords.reduce((sum, item) => sum + (item.purchasenav * item.units), 0)
      this.totalvalue = this.groupedRecords.reduce((sum, item) => sum + (item.currentnav * item.units), 0)
      this.groupedRecords.sort((a,b)=> a.name.localeCompare(b.name));
      //console.log(this.groupedRecords);
    });

    this.mfService.GetMFList();
  }

  objectKey(obj) {
    return Object.keys(obj);
  }

  formatedList(records:MFRecord[]) {
      return records.reduce((prev, now) => {
        if (!prev[now.code]) {
          prev[now.code] = [];
        }

        prev[now.code].push(now);
        return prev;
      }, {});

    /* After formatting data : { "Key 1": [ .... ], "Key 2": [...], ... } */
  }
}
