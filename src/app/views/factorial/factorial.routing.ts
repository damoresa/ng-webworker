import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FactorialComponent } from './factorial.component';

const routes: Routes = [
  { path: '', component: FactorialComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactorialRouting {
}
