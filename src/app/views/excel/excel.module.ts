import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './../../material.module';

import { ExcelComponent } from './excel.component';
import { ExcelRouting } from './excel.routing';

@NgModule({
  declarations: [ExcelComponent],
  imports: [
    CommonModule,
    ExcelRouting,
    FormsModule,
    MaterialModule
  ]
})
export class ExcelModule {
}
