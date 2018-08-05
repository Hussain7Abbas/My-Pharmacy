import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    localStorage.setItem('navTitle', 'بحث') // هذا المتغير في مساحة الخزن المحلية يقوم بتغيير عنوان الناف بار
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

}
