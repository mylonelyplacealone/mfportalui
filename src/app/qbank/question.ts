export class Question {
  _id: string;
  question:string;
  answer:string;
  bgcolor:string;
  category:string;

  constructor(private _ID:string, private Question:string, private Answer:string, 
    private  Bgcolor: string, private Category:string) {
    this._id = _ID;
    this.question = Question;
    this.answer = Answer;
    this.bgcolor = Bgcolor;
    this.category = Category;
  }
}