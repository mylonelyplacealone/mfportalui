import { Component, OnInit } from '@angular/core';
import { MfService } from '../common/mf-service.service';
import { MFRecord } from '../common/mfrecord';

@Component({
  selector: 'app-mfhome',
  templateUrl: './mfhome.component.html',
  styleUrls: ['./mfhome.component.css']
})
export class MfhomeComponent implements OnInit {
  unrealprofit:number = 0;
  realprofit:number = 0;
  currentValue:number = 0;
  investment:number = 0;
  data= {};
  charttype:string='pie';

  constructor(private mfService:MfService) { }

  ngOnInit() {
    this.mfService.recordsChanged
    .subscribe((records:MFRecord[])=>{
      this.unrealprofit = records.reduce((sum, item) => sum + ((item.currentnav - item.purchasenav) * item.units), 0);
      this.currentValue = records.reduce((sum, item) => sum + (item.currentnav * item.units), 0);
      this.investment = records.reduce((sum, item) => sum + (item.purchasenav * item.units), 0);

      this.data =  {
        labels: ['Investment','Un-Realized Profit'],
        datasets: [{
          data: [this.investment, this.unrealprofit],
          backgroundColor: ["blue","green"]
        }]
      };
    });

      this.mfService.GetSoldMFList()
    .subscribe((records:MFRecord[])=>{
        this.realprofit = records.reduce((sum, item) => sum + ((item.salenav - item.purchasenav) * item.units), 0);   
    });

    this.mfService.GetMFList();
  }

}
