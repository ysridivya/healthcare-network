import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangedoctorRoutingModule } from './changedoctor-routing.module';
import { ChangedoctorComponent } from './changedoctor.component';

@NgModule({
  declarations: [ChangedoctorComponent],
  imports: [
    CommonModule,
    ChangedoctorRoutingModule
  ]
})
export class ChangedoctorModule { }
