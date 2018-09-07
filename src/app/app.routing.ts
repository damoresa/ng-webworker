import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'excel', loadChildren: './views/excel/excel.module#ExcelModule' },
  { path: 'factorial', loadChildren: './views/factorial/factorial.module#FactorialModule' },
  { path: '**', redirectTo: 'factorial' }
];

// We use hash location to keep static distribution reloads easy instead of adding
// fallbacks on the serve-static script. It is not mandatory to use hash location.
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRouting {
}
