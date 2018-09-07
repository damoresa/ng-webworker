import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from './../../material.module';

import { FactorialComponent } from './factorial.component';
import { FactorialRouting } from './factorial.routing';

@NgModule({
  declarations: [FactorialComponent],
  imports: [
    CommonModule,
    FactorialRouting,
    FormsModule,
    MaterialModule
  ]
})
export class FactorialModule {
}
