import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../question';
import { DataService } from '../data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  dummyrec:Question = new Question("",'','','','');
  editmode:boolean = false;
  @Input() question:Question = Object.assign({}, this.dummyrec);

  constructor(private dataSer:DataService) { }

  ngOnInit() {
  }

  add(){
    this.question = Object.assign({}, this.dummyrec);
    this.editmode = true;
  }

  save(){
    console.log('this.question._id') ;
    console.log(this.question._id) ;
    if(this.question._id == ''){
      this.dataSer.AddQuestion(this.question);
    }else{
      this.dataSer.EditQuestion(this.question);
    }
    this.editmode = false;
  }

}
