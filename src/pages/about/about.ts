import { Component,ViewChild } from '@angular/core';
import { NavController,Slides } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  @ViewChild('slider') slider: Slides;
  pages="0";

  constructor(public navCtrl: NavController,public alertCtrl: AlertController) {
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
  showinfo(){
   
      const alert = this.alertCtrl.create({
        title: '<h1>حسين عباس<h1>',
        message: '<h3>صاحب الفكرة <h3> <h3> شارك في البرمجة والتصميم<h3>  ',
        buttons: ['OK'],
        cssClass: 'alertCustomCss'

      });
      alert.present();
    }
    showinfo1(){
   
      const alert = this.alertCtrl.create({
        title: '<h1>حسين كريم<h1>',
        message: ' <h3> شارك في البرمجة <h3>  ',
        buttons: ['OK'],
        cssClass: 'alertCustomCss'

      });
      alert.present();
    }
    showinfo2(){        
      const alert = this.alertCtrl.create({
        title: '<h1>حلا حازم<h1>',
        message: ' <h3> شاركت في البرمجة والخوارزمية<h3>  ',
        buttons: ['OK'],
        cssClass: 'alertCustomCss'

      });
      alert.present();
    }
    showinfo3(){
   
      const alert = this.alertCtrl.create({
        title: '<h1>سيف علي<h1>',
        message: '<h3> شارك في البرمجة والشعار<h3>  ',
        buttons: ['OK'],
        cssClass: 'alertCustomCss'

      });
      alert.present();
    }
    showinfo4(){
   
      const alert = this.alertCtrl.create({
        title: '<h1>الهام علي<h1>',
        message: ' <h3> شاركت في البرمجة <h3>  ',
        buttons: ['OK'],
        cssClass: 'alertCustomCss'

      });
      alert.present();
    }
    showinfo5(){
   
      const alert = this.alertCtrl.create({
        title: '<h1>هبة ستار<h1>',
        message: ' <h3>المشرفة على التطبيق <h3>  ',
        buttons: ['OK'],
        cssClass: 'alertCustomCss'

      });
      alert.present();
    }
}
