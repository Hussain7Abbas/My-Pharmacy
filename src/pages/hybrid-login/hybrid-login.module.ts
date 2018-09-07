import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HybridLoginPage } from './hybrid-login';

@NgModule({
  declarations: [
    HybridLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(HybridLoginPage),
  ],
})
export class HybridLoginPageModule {}
