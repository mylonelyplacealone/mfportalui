import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MFSearchRecord {
  schemeCode: number;
  schemeName: string;
  
  constructor(private SchemeCode:number, private SchemeName:string) {
    this.schemeCode = SchemeCode;
    this.schemeName = SchemeName;
  }
}
