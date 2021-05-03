import { Component, OnInit } from '@angular/core';
import { MfService } from '../common/mf-service.service';
import { MFRecord } from '../common/mfrecord';
import { MFRecordSoldList } from '../common/mfrecordsoldlist';

@Component({
  selector: 'app-soldmflist',
  templateUrl: './soldmflist.component.html',
  styleUrls: ['./soldmflist.component.css', '../common/mutualfund.css']

})
export class SoldmflistComponent implements OnInit {
  soldMFList:MFRecord[] = [] ; 
  totalcost:number;
  totalsalevalue:number;
  soldlist:MFRecordSoldList[] = [];
  mfsoldrecord:MFRecordSoldList;
  
  constructor(private mfService:MfService) { }

  ngOnInit() {
    this.mfService.GetSoldMFList()
    .subscribe((records:MFRecord[])=>{
        this.soldMFList = records;
        // this.soldMFList.sort((a,b)=> {return a.name.localeCompare(b.name)});
        this.soldMFList.sort((a,b)=> {return b.saledate > a.saledate? 1 : -1});
        this.totalcost = this.soldMFList.reduce((sum, item) => sum + (item.purchasenav * item.units), 0);
        this.totalsalevalue = this.soldMFList.reduce((sum, item) => sum + (item.salenav * item.units), 0);

        this.CreateSellList(records);
    });
  }

  CreateSellList(list:MFRecord[]){
    this.mfsoldrecord;
    for (var mfRec of list) {
      var saledate = new Date(mfRec.saledate);
      var year = (saledate > new Date(saledate.getFullYear(), 3, 1, 0, 0, 0, 0)) ? saledate.getFullYear() + 1 : saledate.getFullYear();

      const varu = this.soldlist.filter((o) => o.year === year);
      if (!varu.length) {
        this.mfsoldrecord = new MFRecordSoldList([] as MFRecord[], year, 0, 0 );
        this.mfsoldrecord.mfentries.push(mfRec);
        this.mfsoldrecord.totalcost += mfRec.purchasenav * mfRec.units;
        this.mfsoldrecord.totalsalevalue += mfRec.salenav * mfRec.units;
        this.soldlist.push(this.mfsoldrecord);
      }
      else{
        varu[0].mfentries.push(mfRec);
        varu[0].totalcost += mfRec.purchasenav * mfRec.units;
        varu[0].totalsalevalue += mfRec.salenav * mfRec.units;
      }
    }
    console.log(this.soldlist);
  }

}
