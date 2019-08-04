import { Component, OnInit } from '@angular/core';
import { Question } from '../question';

@Component({
  selector: 'app-qbankhome',
  templateUrl: './qbankhome.component.html',
  styleUrls: ['./qbankhome.component.css']
})
export class QbankhomeComponent implements OnInit {
  selectedquestion:Question;

  constructor() { }

  ngOnInit() {
  }


  getquestion(record:Question){
    this.selectedquestion = record;
  }

}
