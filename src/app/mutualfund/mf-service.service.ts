import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigClass } from '../common/config.service';
import { MFRecord } from './mfrecord';
import { Subject, Observable } from 'rxjs';
import { MFSearchRecord } from './mfsearch-record';
import { MFSIPRecord } from './mfsiprecord';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MfService {
  searchedRecords:MFSearchRecord[];
  records:MFRecord[] = []; 
  record:MFRecord;
  update:MFRecord;
  recordsChanged = new Subject<MFRecord[]>();
  header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

  constructor(private httpClnt:HttpClient, public datepipe: DatePipe) { }

  searchMFlist(searchstr:string): Observable<MFSearchRecord[]> {
    return this.httpClnt.get<MFSearchRecord[]>(ConfigClass.mfSearchListURL + searchstr)
  }

  GetMFList(){
    this.httpClnt.get(ConfigClass.restAPIURL + 'mflist', 
          { headers: this.header, 
            params:{ userid: localStorage.getItem('userid')}
          })
    .subscribe((res:MFRecord[])=>{
      console.log(res);
      this.records = res;
      this.records.sort((a,b)=> {return a.code - b.code});
      this.recordsChanged.next(this.records.slice());
    });
  }

  AddNew(entry:MFRecord){
    this.httpClnt.get(ConfigClass.mfGetDataUrl + entry.code)
    .subscribe((response)=>{
      if(response['data'].length > 0){
        if(entry.purchasenav == 0){
          this.record = new MFRecord("",
            +localStorage.getItem('userid'), entry.code, response['meta'].scheme_name, 
            entry.units, response['data'][0].nav, new Date(), response['data'][0].nav);
        }
        else{
          this.record = new MFRecord("", +localStorage.getItem('userid'), entry.code, response['meta'].scheme_name, 
          entry.units, entry.purchasenav, entry.purchasedate, response['data'][0].nav);
        }
          var mfdata = 'userid=' + localStorage.getItem('userid') + '&code=' + this.record.code
                + '&name=' + this.record.name + '&units=' + this.record.units 
                + '&purchasenav=' + this.record.purchasenav
                + '&purchasedate=' + this.record.purchasedate+ '&currentnav=' + this.record.currentnav;

          this.httpClnt.post(ConfigClass.restAPIURL + 'mf', mfdata, { headers: this.header })
          .subscribe((res)=>{
              this.records.push(res['newmf']);
              this.records.sort((a,b)=> {return a.code - b.code});
              this.recordsChanged.next(this.records.slice());
          });
      }
    });
  }

  Update(recordMe:MFRecord){
    var mfdata = 'userid=' + localStorage.getItem('userid') + '&code=' + recordMe.code
                + '&name=' + recordMe.name + '&units=' +  recordMe.units 
                + '&purchasenav=' +  recordMe.purchasenav + '&purchasedate=' + recordMe.purchasedate
                + '&currentnav=' + recordMe.currentnav;

    this.httpClnt.put(ConfigClass.restAPIURL + 'mf/' + recordMe._id, mfdata, {  headers:this.header })
    .subscribe((res)=>{
      if(res['success'])
      {
        this.records.splice(this.records.indexOf(this.records.find(x=>x._id == recordMe._id)), 1);
        this.records.push(res['mfrecord']);
        this.records.sort((a,b)=> {return a.code - b.code});
        this.recordsChanged.next(this.records.slice());
      }
    });
  }

  DeleteEntry(_id:string){
    this.httpClnt.delete(ConfigClass.restAPIURL + 'mf/'+ _id, 
        { 
          headers: this.header, // params:{ _id : _id}
        })
    .subscribe((res)=>{
      if(res['success'])
      {
        this.records.splice(this.records.indexOf(this.records.find(x=>x._id == _id)), 1);
        this.records.sort((a,b)=> {return a.code - b.code});
        this.recordsChanged.next(this.records.slice());
      }
    });
  }

  GetMFData(mfrecord:MFRecord){
    this.httpClnt.get(ConfigClass.mfGetDataUrl + mfrecord.code)
    .subscribe((response)=>{
      if(response['data'].length > 0){
        this.update = this.records.find(x=>x._id == mfrecord._id);

        if(this.update){
          this.record = new MFRecord(this.update._id, +localStorage.getItem('userid'), this.update.code, 
                    response['meta'].scheme_name, this.update.units, this.update.purchasenav, 
                    this.update.purchasedate, response['data'][0].nav);
          this.Update(this.record);
        }
        // else{
        //   // (this.records.reduce((max, b) => Math.max(max, b.id), this.records[0].id) +1), 
        //   this.record = new MFRecord("",
        //     +localStorage.getItem('userid'), mfrecord.code, response['meta'].scheme_name, 
        //     mfrecord.units, response['data'][0].nav, mfrecord.purchasedate, response['data'][0].nav);
        // }
      }
    });
  }

  //----------------------------------SIP--------------------------------------
  siprecords:MFSIPRecord[] = [
    new MFSIPRecord(1, 120166, 'Kotak Standard Multicap Fund - Growth - Direct', 2000, new Date(), new Date(), "Monthly", new Date()),
    new MFSIPRecord(2, 118989, 'HDFC Mid Cap Opportunities Fund -Direct Plan - Growth Option', 1500, new Date(), new Date(), "Monthly", new Date()),
    new MFSIPRecord(3, 119598, 'SBI BLUE CHIP FUND-DIRECT PLAN -GROWTH', 2000, new Date(), new Date(), "Monthly", new Date()),
    new MFSIPRecord(4, 125497, 'SBI Small Cap Fund - Direct Plan - Growth', 2000, new Date(), new Date(), "Monthly", new Date()),
  ];

  GetMFSIPList(){
    return this.siprecords.sort((a,b)=> {return a.id - b.id});
  }

  GetMFNavforDate(code:number, inputDate:Date): Observable<any>{
    return this.httpClnt.get(ConfigClass.mfGetDataUrl + code)
    .pipe(
      map((res) => {
        var dummyRes = new Response();
        if(res['data']){
          for (let val of res['data']) {
            if(val['date'] == this.datepipe.transform(inputDate, 'dd-MM-yyyy')){
              dummyRes['data'] =  [val];
              return dummyRes['data'];
            }
          }
          dummyRes['errormsg'] = "Please provide correct date, NAV not available for " + this.datepipe.transform(inputDate, 'dd-MMM-yyyy');
          return dummyRes;
        }
        else{
          dummyRes['errormsg'] = "Please provide correct MF code.";
          return dummyRes;
        }
      })
    );
  }

  ExecuteSIP(code:number, purchasedate:Date, purchasenav:number, units:number){

    this.AddNew(new MFRecord("",  +localStorage.getItem('userid'), code, "", units, purchasenav, purchasedate,0));
    // this.httpClnt.get(ConfigClass.mfGetDataUrl + code)
    // .subscribe((response)=>{
    //   //console.log(response);
    //   if(response['data'].length > 0){
    //     this.record = new MFRecord("",
    //                     +localStorage.getItem('userid'), code, 
    //                       response['meta'].scheme_name, 
    //                       units, 
    //                       purchasenav,
    //                       purchasedate, 
    //                       response['data'][0].nav);

    //     this.records.push(this.record);
    //     this.records.sort((a,b)=> {return a.code - b.code});
    //     this.recordsChanged.next(this.records.slice());
    //   }
    //});
  }
  //---------------------------------END SIP-----------------------------------
}
