import { Component,ViewChild } from '@angular/core';
import { NavController,Slides } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  @ViewChild('slider') slider: Slides;
  pages="0";
  
  constructor(public navCtrl: NavController) {
    localStorage.setItem('navTitle', 'حول التطبيق') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
  }
  selectedtab(ind){
    this.slider.slideTo(ind);
  }
  moveButton($event){
   this.pages=$event._snapIndex.toString();
  }
  goBack(){
    this.navCtrl.pop()
  }

}
