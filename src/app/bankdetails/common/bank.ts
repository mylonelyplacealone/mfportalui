export class Bank {
  _id:string;
  bankName:string;
  bankBranch:string;
  imgURL?:string;
  
  constructor(private _ID:string, private BankName:string, private BankBranch:string, private ImgURL?:string) {
    this._id = _ID;
    this.bankName = BankName;
    this.bankBranch = BankBranch;
    this.imgURL = ImgURL
  }
}