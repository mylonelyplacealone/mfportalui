export class Portfolio {
  _id: string;
  userid:string;
  snapshotdate:Date;
  shares:number;
  mfs: number;
  savings: number;
  fds: number;
  rds:number;
  epf: number;
  ppf:number;
  comments:String;

  constructor(private _ID:string, private Userid:string, private Snapshotdate:Date, private Shares: number, 
    private MFs:number, private Savings:number, private FDs:number, private RDs: number, 
    private EPF:number , private PPF:number, private Coments:string) {
    this._id = _ID;
    this.userid = Userid;
    this.snapshotdate= Snapshotdate;
    this.shares = Shares;
    this.mfs = MFs;
    this.savings = Savings;
    this.fds= FDs;
    this.rds = RDs;
    this.epf = EPF;
    this.ppf = PPF;
    this.comments = this.comments;
  }
}