import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareComponent } from './share.component';
import { ShareRoutingModule } from './share-routing.module';

@NgModule({
  declarations: [ShareComponent],
  imports: [
    CommonModule,
    ShareRoutingModule
  ]
})
export class ShareModule { }
