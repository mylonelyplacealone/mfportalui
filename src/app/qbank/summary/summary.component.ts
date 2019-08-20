import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Question } from '../question';
import { DataService } from '../data.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  searchText:string;
  @Output() clicked: EventEmitter<Question> = new EventEmitter();

  records:Question[];
  constructor(private dataSer: DataService) { }

  ngOnInit() {
    this.dataSer.recordsChanged
    .subscribe((records)=>{
      this.records = records;
      console.log(this.records);
    });

    this.dataSer.GetQuestions();
  }

  selected(record:Question){
    this.clicked.emit(record);
  }

  delete(id:string){
    if(confirm('Do you really want to delete this question?')){
      this.dataSer.DeleteQuestion(id);
    }
  }
}
