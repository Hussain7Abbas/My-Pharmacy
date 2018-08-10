import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HeroPage } from './hero';

@NgModule({
  declarations: [
    HeroPage,
  ],
  imports: [
    IonicPageModule.forChild(HeroPage),
  ],
})
export class HeroPageModule {}
