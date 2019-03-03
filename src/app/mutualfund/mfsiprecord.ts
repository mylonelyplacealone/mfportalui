import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MFSIPRecord {
  _id: string;
  userid: number;
  code:number;
  name: string;
  amount:number;
  startdate:Date;
  enddate:Date;
  frequency:string;
  executiondate?:Date

  constructor(private _Id:string, private UserId:number, private Code:number, private Name:string, private Amount:number, private StartDate:Date, private EndDate:Date, private Frequency:string, private ExecutionDate?:Date,) {
    this._id = _Id;
    this.userid = UserId;
    this.code = Code;
    this.name = Name;
    this.amount = Amount;
    this.startdate = StartDate;
    this.enddate = EndDate;
    this.frequency = Frequency;
    this.executiondate = ExecutionDate;
  }
 
}