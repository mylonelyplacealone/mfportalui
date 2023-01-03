import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigClass } from '../../common/config.service';
import { MFRecord } from './mfrecord';
import { Subject, Observable } from 'rxjs';
import { MFSearchRecord } from './mfsearch-record';
import { MFSIPRecord } from './mfsiprecord';
import { DatePipe } from '@angular/common';
import { map, debounceTime } from 'rxjs/operators';
import { Stock } from './stock';

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
  header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  .append('x-access-token', localStorage.getItem('token'));

  stockRecordsChanged = new Subject<Stock[]>();
  recordsStock:Stock[] = []; 
  recordStock:Stock;
  updateStock:Stock;
  
  constructor(private httpClnt:HttpClient, public datepipe: DatePipe) { }

  searchMFlist(searchstr:string): Observable<MFSearchRecord[]> {
    return this.httpClnt.get<MFSearchRecord[]>(ConfigClass.mfSearchListURL + searchstr)
  }

  searchAutocompleteMF(searchstr) {
    return this.httpClnt.get(ConfigClass.mfSearchListURL + searchstr)
    .pipe(
        debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
        map(
            (data: any) => {
                return (
                    data.length != 0 ? data as any[] : [{"SchemeName": "No Record Found"} as any]
                );
            }
    ));
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
        for(let record of this.records){
          if(!record.isprofit)
            record.isprofit = false;
        }
        this.records.sort((a,b)=> {return a.code - b.code});
        this.recordsChanged.next(this.records.slice());
      }
    });
  }

  GetSoldMFList(){
    return this.httpClnt.get(ConfigClass.restAPIURL + 'soldmflist', 
            { headers: this.header, 
              params:{ userid: localStorage.getItem('userid')}
            });
  }

  AddNew(entry:MFRecord){
    this.httpClnt.get(ConfigClass.mfGetDataUrl + entry.code)
    .subscribe((response)=>{
      if(response['data'].length > 0){
        if(entry.purchasenav == 0){
          this.record = new MFRecord("",
            +localStorage.getItem('userid'), entry.code, response['meta'].scheme_name, 
            entry.units, response['data'][0].nav, new Date(), response['data'][0].nav, entry.comments, entry.isprofit, entry.issip === undefined? false : entry.issip);
        }
        else{
          this.record = new MFRecord("", +localStorage.getItem('userid'), entry.code, response['meta'].scheme_name, 
          entry.units, entry.purchasenav, entry.purchasedate, response['data'][0].nav, entry.comments, entry.isprofit, entry.issip === undefined? false : entry.issip);
        }
          var mfdata = 'userid=' + localStorage.getItem('userid') + '&code=' + this.record.code
                + '&name=' + this.record.name + '&units=' + this.record.units 
                + '&purchasenav=' + this.record.purchasenav + '&purchasedate=' + this.record.purchasedate
                + '&currentnav=' + this.record.currentnav + '&comments=' + this.record.comments
                + '&isprofit=' + this.record.isprofit + '&issip=' + this.record.issip;

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
                + '&currentnav=' + recordMe.currentnav + '&comments=' + recordMe.comments
                + '&isprofit=' + recordMe.isprofit + '&issip=' + recordMe.issip
                + (recordMe.salenav? '&salenav=' +  recordMe.salenav : "") 
                + (recordMe.saledate?'&saledate=' + recordMe.saledate:"");

console.log(mfdata);
    this.httpClnt.put(ConfigClass.restAPIURL + 'mf/' + recordMe._id, mfdata, {  headers:this.header })
    .subscribe((res)=>{
      if(res['success'])
      {
        this.records.splice(this.records.indexOf(this.records.find(x=>x._id == recordMe._id)), 1);

        if(!recordMe.salenav){
          this.records.push(res['mfrecord']);
        }
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
      console.log(response['data']);
      if(response['data'].length > 0){
        this.update = this.records.find(x=>x._id == mfrecord._id);

        if(this.update){
          this.record = new MFRecord(this.update._id, +localStorage.getItem('userid'), this.update.code, 
                    response['meta'].scheme_name, this.update.units, this.update.purchasenav, 
                    this.update.purchasedate, response['data'][0].nav, this.update.comments, this.update.isprofit);
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

  GetLatestNAV(mfrecord:MFRecord){
    this.httpClnt.get(ConfigClass.mfGetDataUrl + mfrecord.code)
    .subscribe((response)=>{
      // console.log(response['data']);
      if(response['data'].length > 0){
        mfrecord.currentnav = response['data'][0].nav;
      }
      return mfrecord;
    });
    return mfrecord;

  }

  //-----------------------------Snapshot Methods----------------------------------------------

  TakeSnapshot(){
    var mfdata = 'userid=' + localStorage.getItem('userid') + '&snapshotdate=' + new Date(new Date().setHours(0, 0, 0, 0));
    
    return this.httpClnt.post(ConfigClass.restAPIURL + 'snapshot', mfdata ,{ headers: this.header });
  }

  GetSnapshotDates(){
    return this.httpClnt.get(ConfigClass.restAPIURL + 'snapshotdates', 
      { headers: this.header, 
        params:{ userid: localStorage.getItem('userid')}
      }
    );
  }

  GetSnapshotData(snapshotdate){
    return this.httpClnt.get(ConfigClass.restAPIURL + 'snapshotdata', 
      { headers: this.header, 
        params:{ userid: localStorage.getItem('userid'), 
                 snapshotdate : snapshotdate
                }
      }
    );
  }
  
  DeleteSnapshot(snapshotdate){
    return this.httpClnt.delete(ConfigClass.restAPIURL + 'snapshot', 
        { 
          headers: this.header, 
          params:{ userid: localStorage.getItem('userid'), 
                 snapshotdate : snapshotdate
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

  DeleteSIP(_id:string){
    this.httpClnt.delete(ConfigClass.restAPIURL + 'mfsip/'+ _id, {  headers: this.header })
    .subscribe((res)=>{
      if(res['success'])
      {
        this.siprecords.splice(this.siprecords.indexOf(this.siprecords.find(x=>x._id == _id)), 1);
        this.siprecords.sort((a,b)=> {return a.code - b.code});
        this.siprecordsChanged.next(this.siprecords.slice());
      }
    });
  }

  UpdateSIP(recordMe:MFSIPRecord){
    var mfsipdata = 'userid=' + localStorage.getItem('userid') + '&code=' + recordMe.code
                + '&name=' + recordMe.name + '&amount=' +  recordMe.amount 
                + '&startdate=' +  recordMe.startdate + '&enddate=' + recordMe.enddate
                + '&frequency=' + recordMe.frequency;

    this.httpClnt.put(ConfigClass.restAPIURL + 'mfsip/' + recordMe._id, mfsipdata, {  headers:this.header })
    .subscribe((res)=>{
      if(res['success'])
      {
        this.siprecords.splice(this.siprecords.indexOf(this.siprecords.find(x=>x._id == recordMe._id)), 1);
        this.siprecords.push(res['mfsiprecord']);
        this.siprecords.sort((a,b)=> {return a.code - b.code});
        this.siprecordsChanged.next(this.siprecords.slice());
      }
    });
  }
  //---------------------------------END SIP-----------------------------------

  //---------------------------------START STOCK-----------------------------------
  GetStockList(){
    this.httpClnt.get(ConfigClass.restAPIURL + 'stocklist', 
          { headers: this.header, 
            params:{ userid: localStorage.getItem('userid')}
          })
    .subscribe((res:Stock[])=>{
      console.log(res);
      this.recordsStock = res;
      if(this.recordsStock && this.recordsStock.length > 0){
        for(let record of this.recordsStock){
          if(!record.isprofit)
            record.isprofit = false;
        }
        this.recordsStock.sort((a,b)=> {return a.units - b.units});
        this.stockRecordsChanged.next(this.recordsStock.slice());
      }
    });
  }
  
  AddNewStock(entry:Stock){
    this.httpClnt.get(ConfigClass.stockAPIURL + entry.code)
    .subscribe((response)=>{
      console.log(response);
      if(response["data"]){
        
        this.recordStock = new Stock("", +localStorage.getItem('userid'), entry.code, entry.name, entry.units, 
                            entry.purchasenav, entry.purchasedate, 
                            response["data"].pricecurrent, 
                            entry.comments, entry.isprofit);
                            console.log(this.recordStock);

          var stockdata = 'userid=' + localStorage.getItem('userid') + '&code=' + this.recordStock.code
                + '&name=' + this.recordStock.name + '&units=' + this.recordStock.units 
                + '&purchasenav=' + this.recordStock.purchasenav + '&purchasedate=' + this.recordStock.purchasedate
                + '&currentnav=' + this.recordStock.currentnav + '&comments=' + this.recordStock.comments
                + '&isprofit=' + this.recordStock.isprofit;

                console.log(stockdata);
          this.httpClnt.post(ConfigClass.restAPIURL + 'stock', stockdata, { headers: this.header })
          .subscribe((res)=>{
            console.log(res);
              this.recordsStock.push(res['newstock']);
              this.recordsStock.sort((a,b)=> {return a.units - b.units});
              this.stockRecordsChanged.next(this.recordsStock.slice());
          });
      }
    });
  }

  UpdateStock(recordMe:Stock){
    var stockdata = 'userid=' + localStorage.getItem('userid') + '&code=' + recordMe.code
                + '&name=' + recordMe.name + '&units=' + recordMe.units 
                + '&purchasenav=' + recordMe.purchasenav + '&purchasedate=' + recordMe.purchasedate
                + '&currentnav=' + recordMe.currentnav + '&comments=' + recordMe.comments
                + '&isprofit=' + recordMe.isprofit
                + (recordMe.salenav? '&salenav=' +  recordMe.salenav : "") 
                + (recordMe.saledate?'&saledate=' + recordMe.saledate:"");;

                
    console.log(stockdata);
    console.log(ConfigClass.restAPIURL + 'stock/' + recordMe._id);
    this.httpClnt.put(ConfigClass.restAPIURL + 'stock/' + recordMe._id, stockdata, {  headers:this.header })
    .subscribe((res)=>{
      if(res['success'])
      {
        this.recordsStock.splice(this.recordsStock.indexOf(this.recordsStock.find(x=>x._id == recordMe._id)), 1);

        if(!recordMe.salenav){
          this.recordsStock.push(res['stockrecord']);
        }
        this.recordsStock.sort((a,b)=> {return a.units - b.units});
        this.stockRecordsChanged.next(this.recordsStock.slice());
      }
    });
  }

  DeleteStock(_id:string){
    this.httpClnt.delete(ConfigClass.restAPIURL + 'stock/'+ _id, 
        { 
          headers: this.header, 
        })
    .subscribe((res)=>{
      if(res['success'])
      {
        this.recordsStock.splice(this.recordsStock.indexOf(this.recordsStock.find(x=>x._id == _id)), 1);
        this.recordsStock.sort((a,b)=> {return a.units - b.units});
        this.stockRecordsChanged.next(this.recordsStock.slice());
      }
    });
  }

  GetStockData(stkrecord:Stock){
    this.httpClnt.get(ConfigClass.stockAPIURL + stkrecord.code)
    .subscribe((response)=>{
      console.log(response);

      if(response["data"]){
        this.updateStock = this.recordsStock.find(x=>x._id == stkrecord._id);

        if(this.updateStock){
          this.recordStock = new Stock(this.updateStock._id, +localStorage.getItem('userid'), 
                this.updateStock.code, this.updateStock.name, this.updateStock.units, 
                this.updateStock.purchasenav, this.updateStock.purchasedate, 
                response["data"].pricecurrent, 
                this.updateStock.comments, this.updateStock.isprofit);
          this.UpdateStock(this.recordStock);
        }
      }
    });
  }

  GetLatestStockValue(stkrecord:Stock):Stock{
    this.httpClnt.get(ConfigClass.stockAPIURL + stkrecord.code)
    .subscribe((response)=>{
      console.log(response);
      if(response["data"]){
        stkrecord.currentnav = response["data"].pricecurrent;
        return stkrecord;
      }
      return stkrecord;
    });
    return stkrecord;
  }
  //---------------------------------END STOCK-----------------------------------
}
