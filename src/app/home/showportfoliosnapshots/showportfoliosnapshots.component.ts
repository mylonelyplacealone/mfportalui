import { Component, OnInit, Inject } from '@angular/core';
import { BankService } from 'src/app/bankdetails/common/bank-service.service';
import { Portfolio } from 'src/app/bankdetails/common/portfolio';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as CanvasJS from 'src/assets/canvasjs.min.js';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-showportfoliosnapshots',
  templateUrl: './showportfoliosnapshots.component.html',
  styleUrls: ['./showportfoliosnapshots.component.css']
})
export class ShowportfoliosnapshotsComponent implements OnInit {

  snapshots:Portfolio[];
  snapshot:Portfolio;
  snapshotdates;

  shares:number = 0;
  mf:number = 0;
  savingsAcc:number = 0;
  fd:number = 0;
  rd:number = 0;
  epf:number = 0;
  ppf:number = 0;
  totalValue:number = 0; 

  chart: any;
  pipe = new DatePipe('en-US');
  
  constructor(public thisDialogRef: MatDialogRef<ShowportfoliosnapshotsComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { userid:string },
    private bnkSer:BankService) { }

  ngOnInit() {
      this.bnkSer.ShowSnapshots(this.data.userid)
      .subscribe((res:Portfolio[])=>{
        console.log(res);

        this.snapshots = res;
        this.snapshotdates = res.map(function(a) {return a.snapshotdate;});

        if(this.chart == undefined && document.getElementById("chartContainer")) {
          this.renderChart();
        }
      });
  }

  ngDoCheck(){
    /* Check https://angular.io/guide/lifecycle-hooks#docheck for informaton about ngDoCheck */
    if(this.chart == undefined && document.getElementById("chartContainer")) {
      this.renderChart();
    } 
  }

  renderChart() {
    this.chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Basic Column Chart in Angular"
      },
      legend: {
        cursor: "pointer",
        itemclick: function (e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }

            e.chart.render();
        }
    },
      data: [
        {
          type: "line",
          dataPoints: this.snapshots.map(x => ({y: x.shares, label: this.pipe.transform(x.snapshotdate, 'dd-MMM-yy')})),
          showInLegend: true,
          name: "Shares",
        },
        {
          type: "line",
          dataPoints: this.snapshots.map(x => ({y: x.mfs, label: this.pipe.transform(x.snapshotdate, 'dd-MMM-yy')})),
          showInLegend: true,
          name: "Mutual Funds",
        },
        {
          type: "line",
          dataPoints: this.snapshots.map(x => ({y: x.savings, label: this.pipe.transform(x.snapshotdate, 'dd-MMM-yy')})),
          showInLegend: true,
          name: "Savings Account",
        },
        {
          type: "line",
          dataPoints: this.snapshots.map(x => ({y: x.fds, label: this.pipe.transform(x.snapshotdate, 'dd-MMM-yy')})),
          showInLegend: true,
          name: "Fixed Deposits",
        },
        {
          type: "line",
          dataPoints: this.snapshots.map(x => ({y: x.rds, label: this.pipe.transform(x.snapshotdate, 'dd-MMM-yy')})),
          showInLegend: true,
          name: "Recurrent Deposits",
        },
        {
          type: "line",
          dataPoints: this.snapshots.map(x => ({y: x.epf, label: this.pipe.transform(x.snapshotdate, 'dd-MMM-yy')})),
          showInLegend: true,
          name: "Employee PF",
        },
        {
          type: "line",
          dataPoints: this.snapshots.map(x => ({y: x.ppf, label: this.pipe.transform(x.snapshotdate, 'dd-MMM-yy')})),
          showInLegend: true,
          name: "PPF",
        },
        {
          type: "line",
          dataPoints: this.snapshots.map(x => ({y: x.shares + x.mfs + x.savings + x.fds + x.rds + x.epf + x.ppf, label: this.pipe.transform(x.snapshotdate, 'dd-MMM-yy')})),
          showInLegend: true,
          name: "Total",
        },
      ]
    });
    
    this.chart.render();
  }

  ShowSnapshotData(date:Date){
    this.snapshot = this.snapshots.filter(a => a.snapshotdate == date)[0];
    if(this.snapshot ){
      this.mf = this.snapshot.mfs;
      this.shares = this.snapshot.shares;
      this.savingsAcc = this.snapshot.savings;
      this.fd = this.snapshot.fds;
      this.rd = this.snapshot.rds;
      this.epf = this.snapshot.epf;
      this.ppf = this.snapshot.ppf;
      this.totalValue = this.shares + this.mf + this.savingsAcc + this.fd + this.rd + this.epf + this.ppf;
    }
    else{
      this.shares = this.mf = this.savingsAcc = this.fd = this.rd = this.epf = this.ppf= this.totalValue = 0;
    }
  }

  deletesnapshot(selecteddate:string){
    if(selecteddate == '0'){
      alert('Please select valid snapshot to delete.');
    } else {
      if(confirm('Do you really want to delete this snapshot?')){
        this.bnkSer.DeletePortfolioSnapshot(selecteddate)
        .subscribe((res)=>{
          if(res['success']){
            console.log(res['message']);

            this.snapshots = this.snapshots.filter(x => x.snapshotdate.toString() !== selecteddate);
            this.snapshotdates = this.snapshotdates.filter(x => x !== selecteddate);
            this.shares = this.mf = this.savingsAcc = this.fd = this.rd = this.epf = this.ppf= this.totalValue = 0;
          }
        });
      }
    }
  }

  ngOnDestroy() {
    if(this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

}
