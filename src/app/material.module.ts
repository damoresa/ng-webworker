import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatInputModule, MatTableModule, MatTabsModule } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule
  ]
})
export class MaterialModule {
}
