import { Injectable } from '@angular/core';
import { Question } from './question';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigClass } from '../common/config.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  .append('x-access-token', localStorage.getItem('token'));
  
  questions:Question[];
  question:Question;
  recordsChanged = new Subject<Question[]>();

  constructor(private httpClnt:HttpClient) { }

  GetQuestions(){
    // this.questions = [
    //   new Question(new Date().getUTCMilliseconds().toString(), 'Q1', 'A1','red', 'ASP.NET' ),
    //   new Question(new Date().getUTCMilliseconds().toString(), 'Q2', 'A2','blue', 'SQL Server' ),
    //   new Question(new Date().getUTCMilliseconds().toString(), 'Q3', 'A3','green', 'ASP.NET' ),
    //   new Question(new Date().getUTCMilliseconds().toString(), 'Q4', 'A4','yellow', 'ASP.NET' ),
    // ];

    this.httpClnt.get(ConfigClass.restAPIURL + 'question/all', { headers: this.header })
    .subscribe((res:Question[])=>{
      console.log(res);
      this.questions = res;
      this.questions.sort((a,b)=> a.question.localeCompare(b.question));
      this.recordsChanged.next(this.questions.slice());
    });
  }

  AddQuestion(record:Question){
    var data = '&question=' + record.question + '&answer=' + record.answer 
                + '&bgcolor=' + record.bgcolor  + '&category=' + record.category
                
    console.log(data)
    this.httpClnt.post(ConfigClass.restAPIURL + 'question/new', data, { headers: this.header })
    .subscribe((res)=>{
      console.log(res);
        this.questions.push(res['newquestion']);
        this.questions.sort((a,b)=> a.question.localeCompare(b.question));
        this.recordsChanged.next(this.questions.slice());
    });
  }

  EditQuestion(record:Question){
    this.questions.splice(this.questions.indexOf(this.questions.find(x=>x._id == record._id)), 1);
    this.questions.push(record);
    this.recordsChanged.next(this.questions.slice());
  }
}
  