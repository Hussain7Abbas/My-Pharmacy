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
        title: '<h2>حسين عباس<h2>',
        subTitle: '<h3>صاحب الفكرة <h3> <h3> شارك في البرمجة والتصميم<h3>  ',
        buttons: ['OK']
      });
      alert.present();
    }
    showinfo1(){
   
      const alert = this.alertCtrl.create({
        title: '<h2>حسين كريم<h2>',
        subTitle: ' <h3> شارك في البرمجة <h3>  ',
        buttons: ['OK']
      });
      alert.present();
    }
    showinfo2(){
   
      const alert = this.alertCtrl.create({
        title: '<h2>حلا حازم<h2>',
        subTitle: ' <h3> شاركت في البرمجة والخوارزمية<h3>  ',
        buttons: ['OK']
      });
      alert.present();
    }
    showinfo3(){
   
      const alert = this.alertCtrl.create({
        title: '<h2>سيف علي<h2>',
        subTitle: '<h3> شارك في البرمجة والشعار<h3>  ',
        buttons: ['OK']
      });
      alert.present();
    }
    showinfo4(){
   
      const alert = this.alertCtrl.create({
        title: '<h2>الهام علي<h2>',
        subTitle: ' <h3> شاركت في البرمجة <h3>  ',
        buttons: ['OK']
      });
      alert.present();
    }
    showinfo5(){
   
      const alert = this.alertCtrl.create({
        title: '<h2>هبة ستار<h2>',
        subTitle: ' <h3>المشرفة على التطبيق <h3>  ',
        buttons: ['OK']
      });
      alert.present();
    }
}
