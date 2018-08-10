import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HeroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hero',
  templateUrl: 'hero.html',
})
export class HeroPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    localStorage.setItem('navTitle', 'اعلى الصيدليات تفاعلاً') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HeroPage');
  }

}
