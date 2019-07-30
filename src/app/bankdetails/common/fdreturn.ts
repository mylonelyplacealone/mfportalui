import { Bank } from './bank';

export class FDReturn {
  name: string;
  months:number[];

  constructor(private Name:string, private Months:number[]) {
    this.name = Name;
    this.months = Months;
  }
}