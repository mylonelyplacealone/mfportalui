import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';
 
@NgModule({
 imports:      [ CommonModule ],
 declarations: [ FilterPipe],
 exports:      [ FilterPipe, CommonModule, FormsModule ]
})
export class SharedModule { }