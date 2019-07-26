import { Injectable } from '@angular/core';

export class Stock {
  _id: string;
  userid: number;
  code:string;
  name: string;
  units: number;
  purchasenav: number;
  purchasedate:Date;
  currentnav: number;
  comments: string;
  isprofit:boolean;
  salenav?:number;
  saledate?:Date;

  constructor(private _Id:string, private UserId:number,private Code:string, 
        private Name:string, private Units:number, private PurchaseNav:number, 
        private PurchaseDate: Date, private CurrentNav:number, private Comments:string,
        private IsProfit:boolean, private SaleNav?:number, private SaleDate?: Date) {
    this._id = _Id;
    this.userid = UserId;
    this.code = Code;
    this.name = Name;
    this.units = Units;
    this.purchasenav = PurchaseNav;
    this.purchasedate = PurchaseDate;
    this.currentnav = CurrentNav;
    this.comments = Comments;
    this.isprofit = IsProfit;
    this.salenav = SaleNav;
    this.saledate = SaleDate;
  }
}