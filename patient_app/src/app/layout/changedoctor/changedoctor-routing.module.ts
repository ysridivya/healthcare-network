import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangedoctorComponent } from './changedoctor.component'

const routes: Routes = [
  {
    path: '', component: ChangedoctorComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangedoctorRoutingModule { }


