import { Component, OnInit } from '@angular/core';
import { MFSearchRecord } from '../mfsearch-record';
import { MfService } from '../mf-service.service';
import { MFRecord } from '../mfrecord';

@Component({
  selector: 'app-searchmf',
  templateUrl: './searchmf.component.html',
  styleUrls: ['./searchmf.component.css']
})
export class SearchmfComponent implements OnInit {
  mfrecords:MFSearchRecord[];
  searchstr:string = "";

  constructor(private mfService:MfService) { }

  ngOnInit() {
  }

  search(){
    //this.mfService.searchMFlist(this.searchstr);
    console.log(this.searchstr);

    this.mfService.searchMFlist(this.searchstr)
    .subscribe(searchlist => {
      console.log(searchlist);
       this.mfrecords = searchlist });
  }

  AddEntry(code:number, units:number, id:number, ){
    // this.mfService.AddNew(code, units, id);
    this.mfService.AddNew(new MFRecord("", 101, code, "", units, 0, new Date(), 0));
  }
}
