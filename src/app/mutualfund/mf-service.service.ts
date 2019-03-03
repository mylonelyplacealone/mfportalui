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
  siprecordsChanged = new Subject<MFSIPRecord[]>();
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
      if(this.records && this.records.length > 0){
        this.records.sort((a,b)=> {return a.code - b.code});
        this.recordsChanged.next(this.records.slice());
      }
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
  siprecords:MFSIPRecord[] = [];

  GetMFSIPList(){
    this.httpClnt.get(ConfigClass.restAPIURL + 'mfsiplist', 
          { headers: this.header, 
            params:{ userid: localStorage.getItem('userid')}
          })
    .subscribe((res:MFSIPRecord[])=>{
      console.log(res);
      this.siprecords = res;
      this.siprecords.sort((a,b)=> {return a.code - b.code});
      this.siprecordsChanged.next(this.siprecords.slice());
    });
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

  AddNewSIP(entry:MFSIPRecord){
    this.httpClnt.get(ConfigClass.mfGetDataUrl + entry.code)
    .subscribe((response)=>{
      if(response['data'].length > 0){
          var record = new MFSIPRecord("", +localStorage.getItem('userid'), 
                      entry.code, response['meta'].scheme_name, entry.amount,
                      entry.startdate, entry.enddate, entry.frequency, null);
        }
        
        var mfsipdata = 'userid=' + localStorage.getItem('userid') + '&code=' + record.code
              + '&name=' + record.name + '&amount=' + record.amount 
              + '&startdate=' + record.startdate + '&enddate=' + record.enddate 
              + '&frequency=' + record.frequency;
              
              console.log(mfsipdata);

          this.httpClnt.post(ConfigClass.restAPIURL + 'mfsip', mfsipdata, { headers: this.header })
          .subscribe((res)=>{
              console.log(res['newmfsip']);
              this.siprecords.push(res['newmfsip']);
              this.siprecords.sort((a,b)=> {return a.code - b.code});
              this.siprecordsChanged.next(this.siprecords.slice());
          });
    });
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
