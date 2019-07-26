import { Bank } from './bank';

export class Account {
  _id: string;
  // bank:Bank;
  bankname:string;
  balance:number;
  openingdate:Date;
  interestrate:number;
  acctype:string;
  comments:string;
  maturitydate?:Date;
  maturityamt?:number;
  installmentamt?:number;

  //yers months days maturitydate maturityamt

  constructor(private _ID:string, private BankName:string, private Balance:number, private OpeningDate: Date, 
    private InterestRate:number, private AccType:string, private Comments:string,  
    private MaturityDate?: Date, private MaturityAmt?:number , private InstallmentAmt?:number) {
    this._id = _ID;
    // this.bank = Bank;
    this.bankname = BankName;
    this.balance = Balance;
    this.openingdate = OpeningDate;
    this.interestrate = InterestRate;
    this.acctype = AccType;
    this.comments = Comments;
    this.maturitydate = MaturityDate;
    this.maturityamt = MaturityAmt;
    this.installmentamt = InstallmentAmt;

  }
}