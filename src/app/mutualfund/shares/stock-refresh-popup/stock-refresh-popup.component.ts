import { Component, OnInit, Inject } from '@angular/core';
import { Stock } from '../../common/stock';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MfService } from '../../common/mf-service.service';

@Component({
  selector: 'app-stock-refresh-popup',
  templateUrl: './stock-refresh-popup.component.html',
  styleUrls: ['./stock-refresh-popup.component.css', '../../common/mutualfund.css']
})
export class StockRefreshPopupComponent implements OnInit {
  myrecords:Stock[];

  constructor(public thisDialogRef: MatDialogRef<StockRefreshPopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Stock[],
    public mfService:MfService) { }

  ngOnInit() {
    this.myrecords =  this.data.map(x => Object.assign({}, x));
    for (var value of this.myrecords) {
      value.purchasenav = value.currentnav;
      value.currentnav = this.mfService.GetLatestStockValue(value).currentnav;
    }
  }

  subtotal(records: Stock[]):number{
    if(records){
      return records.reduce((sum, item) => sum + ((item.currentnav - item.purchasenav) * item.units), 0);
    }
  }

  onCloseCancel() {
    this.thisDialogRef.close('Popup Closed successfully.');
  }
}
