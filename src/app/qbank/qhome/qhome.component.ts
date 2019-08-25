import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../question';
import { DataService } from '../data.service';

@Component({
  selector: 'app-qhome',
  templateUrl: './qhome.component.html',
  styleUrls: ['./qhome.component.css']
})
export class QhomeComponent implements OnInit {
  records:Question[] = [];
  queryParam="";
  cntQ = 0;
  
  constructor(private dataSer: DataService,
    private actRoute:ActivatedRoute) { }

  ngOnInit() {
    this.dataSer.recordsChanged
    .subscribe((records)=>{
      this.records = records;
      this.cntQ = this.records.length;
      console.log(this.records);
    });

    this.dataSer.GetQuestions();
   
    this.actRoute.queryParams
    .subscribe(params => {
      if(params.val){
        this.queryParam = params.val;
      }
    });
  }

}
