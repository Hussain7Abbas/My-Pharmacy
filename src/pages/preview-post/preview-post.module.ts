import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreviewPostPage } from './preview-post';

@NgModule({
  declarations: [
    PreviewPostPage,
  ],
  imports: [
    IonicPageModule.forChild(PreviewPostPage),
  ],
})
export class PreviewPostPageModule {}
