import { MFRecord } from './mfrecord';

export class MFRecordSoldList {
  mfentries: MFRecord[];
  year:number;
  totalcost:number;
  totalsalevalue:number;

  constructor(private MFEntries:MFRecord[], private Year:number,private TotalCost:number, private TotalSaleValue:number) {
    this.mfentries = MFEntries;
    this.year = Year;
    this.totalcost = TotalCost;
    this.totalsalevalue = TotalSaleValue;
  }
}