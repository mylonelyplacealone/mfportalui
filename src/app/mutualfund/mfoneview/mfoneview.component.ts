import { Component, OnInit } from '@angular/core';
import { MFRecord } from '../common/mfrecord';
import { Subscription } from 'rxjs';
import { MfService } from '../common/mf-service.service'; 

@Component({
  selector: 'app-mfoneview',
  templateUrl: './mfoneview.component.html',
  styleUrls: ['./mfoneview.component.css','../common/mutualfund.css']
})
export class MfoneviewComponent implements OnInit {
  selectedrecord:MFRecord;
  groupedRecords:MFRecord[]=[];
  recordsSubscription = new Subscription();
  totalcost:number = 0;
  totalvalue:number = 0;
  toggle:boolean = true;
  sortcolumn:string;
  viewtype="tabledata";
  data= {};

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

      this.groupedRecords.sort((a,b)=> b.name.localeCompare(a.name));

      this.data =  {
        labels: this.groupedRecords.map(a => a.name),
        datasets: [{
          data: this.groupedRecords.map(a => (a.currentnav - a.purchasenav) * a.units),
          backgroundColor: 
          this.groupedRecords.map(a => '#' + Math.floor(Math.random()*16777215).toString(16))
          
          // [
          //   "#00FFFF",
          //   "#FFFF00",
          //   "#AAFF00",
          //   "#BBFF00",
          //   "#FF00FF"
          // ]
        }]
      };

      // this.groupedRecords.sort((a,b)=> (((a.currentnav - a.purchasenav) * a.units)) - ((b.currentnav - b.purchasenav) * b.units));
      //console.log(this.groupedRecords);
    });

    this.mfService.GetMFList();
  }

  sortData(value){
    this.sortcolumn = value;
    switch(value){
      case "name":{//name
        this.toggle ? this.groupedRecords.sort((a,b)=> a.name.localeCompare(b.name)) : this.groupedRecords.sort((a,b)=> b.name.localeCompare(a.name));
        this.toggle = !this.toggle;
        break;
      }

      case "units":
      case "purchasenav":
      case "currentnav":
      {//units
        // this.toggle ? this.groupedRecords.sort((a,b)=> a.units - b.units) : this.groupedRecords.sort((a,b)=> b.units - a.units);
        this.toggle ? this.groupedRecords.sort((a,b)=> a[value] - b[value]) : this.groupedRecords.sort((a,b)=> b[value] - a[value]);
        this.toggle = !this.toggle;
        break;
      }

      case "costvalue":{//Cost Value
        this.toggle ? 
          this.groupedRecords.sort((a,b)=> (a.purchasenav * a.units) - (b.purchasenav * b.units)) :
          this.groupedRecords.sort((a,b)=>(b.purchasenav * b.units) - (a.purchasenav * a.units));
        
        this.toggle = !this.toggle;
        break;
      }

      case "currentvalue":{//CUrrent Value
        this.toggle ? 
          this.groupedRecords.sort((a,b)=> (a.currentnav * a.units) - (b.currentnav * b.units)) :
          this.groupedRecords.sort((a,b)=>(b.currentnav * b.units) - (a.currentnav * a.units));
        
        this.toggle = !this.toggle;
        break;
      }

      case "profit":{//profit amount
        this.toggle ? 
          this.groupedRecords.sort((a,b)=> (((a.currentnav - a.purchasenav) * a.units)) - ((b.currentnav - b.purchasenav) * b.units)) :
          this.groupedRecords.sort((a,b)=> (((b.currentnav - b.purchasenav) * b.units)) - ((a.currentnav - a.purchasenav) * a.units));
        
        this.toggle = !this.toggle;
        break;
      }

      case "percentage":{//profit percentage
        this.toggle ? 
          this.groupedRecords.sort((a,b)=> ((((a.currentnav/a.purchasenav)-1) * 100) - (((b.currentnav/b.purchasenav)-1) * 100))):
          this.groupedRecords.sort((a,b)=> ((((b.currentnav/b.purchasenav)-1) * 100) - (((a.currentnav/a.purchasenav)-1) * 100)));
        
        this.toggle = !this.toggle;
        break;
      }

      default: { 
        this.groupedRecords.sort((a,b)=> a.name.localeCompare(b.name));
        break; 
     } 
    }
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

  selecttype(viewtype){
    this.viewtype = viewtype;
  }

  selectdata(type){

    if(type=='investment'){
      this.data =  {
        labels: this.groupedRecords.map(a => a.name),
        datasets: [{
          data: this.groupedRecords.map(a => a.purchasenav * a.units),
          backgroundColor: this.groupedRecords.map(a => '#' + Math.floor(Math.random()*16777215).toString(16))
        }]
      };
    }else{
      this.data =  {
        labels: this.groupedRecords.map(a => a.name),
        datasets: [{
          data: this.groupedRecords.map(a => (a.currentnav - a.purchasenav) * a.units),
          backgroundColor: this.groupedRecords.map(a => '#' + Math.floor(Math.random()*16777215).toString(16))
        }]
      };

    }
  }
}
