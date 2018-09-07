import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExcelComponent } from './excel.component';

const routes: Routes = [
  { path: '', component: ExcelComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExcelRouting {
}
