import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { Question } from '../question';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {

  records:Question[] = [];
  queryParam="";

  constructor(private dataSer: DataService,
    private actRoute:ActivatedRoute) { }

  ngOnInit() {
    this.dataSer.recordsChanged
    .subscribe((records)=>{
      this.records = records.filter(a=>a.category.toLowerCase() == 'interview');
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
