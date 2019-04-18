import { Component, OnInit } from '@angular/core';
import { MfService } from '../common/mf-service.service';
import { MFRecord } from '../common/mfrecord';

@Component({
  selector: 'app-soldmflist',
  templateUrl: './soldmflist.component.html',
  styleUrls: ['./soldmflist.component.css', '../common/mutualfund.css']

})
export class SoldmflistComponent implements OnInit {
  soldMFList:MFRecord[] = [] ; 
  totalcost:number;
  totalsalevalue:number;

  constructor(private mfService:MfService) { }

  ngOnInit() {
    this.mfService.GetSoldMFList()
    .subscribe((records:MFRecord[])=>{
        this.soldMFList = records;
        this.soldMFList.sort((a,b)=> {return a.name.localeCompare(b.name)});
        this.totalcost = this.soldMFList.reduce((sum, item) => sum + (item.purchasenav * item.units), 0);
        this.totalsalevalue = this.soldMFList.reduce((sum, item) => sum + (item.salenav * item.units), 0);
    });
  }

}
